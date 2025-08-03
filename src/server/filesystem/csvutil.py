import csv
import os
from typing import List

from src.server.domain.Lane import Lane
from src.server.domain.Entry import Entry

def write_lanes_to_csv(path: str, lanes: list[Lane]):
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(["id", "name", "description"])
		for lane in lanes:
			writer.writerow([lane.id, lane.name, lane.description if lane.description else ""])

def find_csv_files(directory: str) -> List[str]:
	results = []
	for root, _, files in os.walk(directory):
		for file in files:
			if file.lower().endswith('.csv'):
				results.append(os.path.join(root, file))
	return results

def write_entries_to_csv(path: str, entries: list[Entry]):
	with open(path, mode="w", newline="", encoding="utf-8") as csvfile:
		writer = csv.writer(csvfile)
		writer.writerow(["date", "kind", "amount", "subject", "creditor_id"])
		for entry in entries:
			writer.writerow([entry.date, entry.kind, entry.amount, entry.subject, entry.creditor_id if entry.creditor_id else ""])