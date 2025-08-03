import os
import pandas as pd

from src.server.domain.Entry import Entry
from src.server.domain.Report import Report
from src.server.config.FilePathsConfig import FilePathsConfig
from src.server.filesystem.csvutil import find_csv_files, read_csv_metadata, write_entries_to_csv, write_lanes_to_csv
from src.server.filesystem.pdfutil import find_pdf_files, read_pdf
from src.server.parsers.sparkasse.kontoauszug_schema2025.SKA2025parser import entryRawText_to_entry, extract_date, extract_raw_entries_from_page_text


def init_lane_file():
	path = FilePathsConfig.get_lane_file_path()
	if os.path.isfile(path):
		print("Lanes file already exists")
	else:
		print("Creating lanes file")
		write_lanes_to_csv(path, [])


def rebuild_csv_files():
	files = find_pdf_files(FilePathsConfig.get_kontoauszug_pdfs_root_dir_relative())
	for pdf_file in files:
		print(f"generating csv for {pdf_file}")
		text_pages = read_pdf(pdf_file)

		month, year = extract_date(text_pages[0])
		metadata = {
			"month": month,
			"year": year
		}

		entries = []
		for page_text in text_pages:
			raw_entries = extract_raw_entries_from_page_text(page_text)
			for raw_entry in raw_entries:
				entry = entryRawText_to_entry(raw_entry)
				entries.append(entry)

		base_filename = os.path.basename(pdf_file)
		csv_file = f"{base_filename}.csv"
		csv_file_path = os.path.join(FilePathsConfig.get_kontoauszug_csv_root(), csv_file)
		write_entries_to_csv(csv_file_path, entries, metadata)

def get_reports():
	files = find_csv_files(FilePathsConfig.get_kontoauszug_csv_root())
	reports = []
	for file in files:
		metadata = read_csv_metadata(file)
		df = pd.read_csv(file, comment="#")
		df = df.fillna('')
		entries = [Entry(**row) for row in df.to_dict(orient='records')]
		report = Report(year=0, month=0, entries=entries)
		if metadata["month"]:
			report.month = int(metadata["month"])
		if metadata["year"]:
			report.year = int(metadata["year"])
		reports.append(report)
	return reports