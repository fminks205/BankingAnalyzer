import os
from typing import List
import pandas as pd

from domain.Filter import Filter
from domain.Lane import Lane
from domain.Entry import Entry
from domain.LaneEntryAssignment import LaneEntryAssignment
from domain.Report import Report
from config.FilePathsConfig import FilePathsConfig
from filesystem.csvutil import find_csv_files, read_csv_metadata, write_filters_to_csv, write_lanes_to_csv, write_lane_entry_assignments_to_csv

class Persistence:
	def __init__(self):
		self.file_config = FilePathsConfig()
		self._init_lane_file()

	def _init_lane_file(self):
		path = self.file_config.get_lane_file_path()
		if os.path.isfile(path):
			print("Lanes file already exists")
		else:
			print("Creating lanes file")
			write_lanes_to_csv(path, [])

	def get_reports(self) -> list[Report]:
		files = find_csv_files(self.file_config.get_kontoauszug_csv_root())
		reports = []
		for file in files:
			metadata = read_csv_metadata(file)
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

	def get_lanes(self):
		file = self.file_config.get_lane_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [Lane(**row) for row in df.to_dict(orient='records')]

	def post_lanes(self, lanes: List[Lane]):
		path = self.file_config.get_lane_file_path()
		return write_lanes_to_csv(path, lanes)

	def get_lane_entry_assignments(self):
		file = self.file_config.get_lane_entry_assignments_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [LaneEntryAssignment(**row) for row in df.to_dict(orient='records')]

	def post_lane_entry_assignments(self, assignments: List[LaneEntryAssignment]):
		path = self.file_config.get_lane_entry_assignments_file_path()
		return write_lane_entry_assignments_to_csv(path, assignments)

	def post_filter(self, filters: list[Filter]):
		path = self.file_config.get_filter_file_path()
		return write_filters_to_csv(path, filters)

	def get_filter(self):
		file = self.file_config.get_filter_file_path()
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		return [Filter(**row) for row in df.to_dict(orient='records')]