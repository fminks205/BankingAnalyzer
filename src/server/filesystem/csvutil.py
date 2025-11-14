import csv
import os
from typing import List

from src.server.domain.LaneEntryAssignment import LaneEntryAssignment
from src.server.domain.Lane import Lane
from src.server.domain.Entry import Entry
from src.server.domain.Filter import Filter

def write_filters_to_csv(path: str, filters: list[Filter])->List[Filter]:
	written_filters = []
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(["lane_id", "subject_substring"])
		for filter in filters:
			writer.writerow([filter.lane_id, filter.subject_substring])
			written_filters.append(filter)
	return written_filters

def write_lanes_to_csv(path: str, lanes: list[Lane])->List[Lane]:
	written_lanes = []
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(["id", "name", "description"])
		for lane in lanes:
			writer.writerow([lane.id, lane.name, lane.description if lane.description else ""])
			written_lanes.append(lane)
	return written_lanes

def write_lane_entry_assignments_to_csv(path: str, assignments: list[LaneEntryAssignment])->List[LaneEntryAssignment]:
	written_assignments = []
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(["month", "year", "lane", "entry"])
		for assignment in assignments:
			if assignment.lane is None:
				continue
			writer.writerow([assignment.month, assignment.year, assignment.lane, assignment.entry])
			written_assignments.append(assignment)
	return written_assignments

def find_csv_files(directory: str) -> List[str]:
	results = []
	for root, _, files in os.walk(directory):
		for file in files:
			if file.lower().endswith('.csv'):
				results.append(os.path.join(root, file))
	return results

def write_entries_to_csv(path: str, entries: list[Entry], metadata):
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		for k, v in metadata.items():
			csvfile.write(f"# {k}: {v}\n")
		writer.writerow(["id", "date", "kind", "amount", "subject", "creditor_id"])
		for entry in entries:
			writer.writerow([entry.id, entry.date, entry.kind, entry.amount, entry.subject, entry.creditor_id if entry.creditor_id else ""])

def read_csv_metadata(file_path):
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