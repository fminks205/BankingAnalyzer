import os
from typing import List
import csv
import pandas as pd

from domain.Filter import Filter
from domain.Lane import Lane
from domain.Entry import Entry
from domain.LaneEntryAssignment import LaneEntryAssignment
from domain.Report import Report
from config.FilePathsConfig import FilePathsConfig

class Persistence:
	def __init__(self):
		self.file_config = FilePathsConfig()

		self.lanes_path = self.file_config.get_lane_file_path()
		self.assignments_path = self.file_config.get_lane_entry_assignments_file_path()
		self.filter_path = self.file_config.get_filter_file_path()

		self._create_nonexisting_files()


	def _create_nonexisting_files(self):
		for file_path in [self.lanes_path, self.assignments_path, self.filter_path]:
			parent_dir = os.path.dirname(file_path)
			if parent_dir:
				os.makedirs(parent_dir, exist_ok=True)

		if not os.path.isfile(self.lanes_path):
			print("Lanes file does not exist yet, initalizing...")
			self.save_lanes([])
		if not os.path.isfile(self.assignments_path):
			print("Assignments file does not exist yet, initalizing...")
			self.save_lane_entry_assignments([])
		if not os.path.isfile(self.filter_path):
			print("Filter file does not exist yet, initalizing...")
			self.save_filters([])

	def _find_csv_files(self, directory: str) -> List[str]:
		results = []
		for root, _, files in os.walk(directory):
			for file in files:
				if file.lower().endswith('.csv'):
					results.append(os.path.join(root, file))
		return results

	def _read_csv_metadata(self, file_path):
		metadata = {}
		with open(file_path, "r") as file:
			lines = file.readlines()
			for line in lines:
				if not line.startswith("#"):
					break
				else:
					k, v = line[1:].strip().split(":",1)
					metadata[k.strip()] = v.strip()
		return metadata

	# --- Filters ---

	def read_filters(self):
		file = self.file_config.get_filter_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [Filter(**row) for row in df.to_dict(orient='records')]

	def save_filters(self, filters: list[Filter])->List[Filter]:
		path = self.file_config.get_filter_file_path()
		written_filters = []
		with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
			writer = csv.writer(csvfile)
			writer.writerow(["lane_id", "subject_substring"])
			for filter in filters:
				writer.writerow([filter.lane_id, filter.subject_substring])
				written_filters.append(filter)
		return written_filters

	# --- Lanes ---

	def save_lanes(self, lanes: list[Lane])->List[Lane]:
		path = self.lanes_path
		written_lanes = []
		with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
			writer = csv.writer(csvfile)
			writer.writerow(["id", "name", "description"])
			for lane in lanes:
				writer.writerow([lane.id, lane.name, lane.description if lane.description else ""])
				written_lanes.append(lane)
		return written_lanes
	
	def read_lanes(self):
		file = self.file_config.get_lane_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [Lane(**row) for row in df.to_dict(orient='records')]

	# --- Assignments ---

	def save_lane_entry_assignments(self, assignments: list[LaneEntryAssignment])->List[LaneEntryAssignment]:
		written_assignments = []
		with open(self.assignments_path, mode="w", newline="", encoding="utf-8") as csvfile:
			writer = csv.writer(csvfile)
			writer.writerow(["month", "year", "lane", "entry"])
			for assignment in assignments:
				if assignment.lane is None:
					continue
				writer.writerow([assignment.month, assignment.year, assignment.lane, assignment.entry])
				written_assignments.append(assignment)
		return written_assignments
	
	def read_lane_entry_assignments(self):
		file = self.file_config.get_lane_entry_assignments_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [LaneEntryAssignment(**row) for row in df.to_dict(orient='records')]
	
	# --- Reports ---

	def get_reports(self) -> list[Report]:
		files = self._find_csv_files(self.file_config.get_kontoauszug_csv_root())
		reports = []
		for file in files:
			metadata = self._read_csv_metadata(file)
			df = pd.read_csv(file, comment="#")
			df = df.fillna('')
			entries: list[Entry] = [Entry(**row) for row in df.to_dict(orient='records')]
			report = Report(year=0, month=0, entries=entries)
			if metadata["month"]:
				report.month = int(metadata["month"])
			if metadata["year"]:
				report.year = int(metadata["year"])
			reports.append(report)
		return reports

	def save_report_for_src_pdf(self, src_pdf, report: Report):
		dst_csv = self._dst_csv_path_for_src_report_pdf(src_pdf)

		metadata = {
			"month": report.month,
			"year": report.year
		}
		with open(dst_csv, mode="w", newline="", encoding="utf-8") as csvfile:
			writer = csv.writer(csvfile)
			for k, v in metadata.items():
				csvfile.write(f"# {k}: {v}\n")
			writer.writerow(["id", "date", "kind", "amount", "subject", "creditor_id"])
			for entry in report.entries:
				writer.writerow([entry.id, entry.date, entry.kind, entry.amount, entry.subject, entry.creditor_id if entry.creditor_id else ""])

	def _dst_csv_path_for_src_report_pdf(self, src_pdf):
		base_filename = os.path.basename(src_pdf)
		csv_file = f"{base_filename}.csv"
		csv_file_path = os.path.join(self.file_config.get_kontoauszug_csv_root(), csv_file)
		return csv_file_path




