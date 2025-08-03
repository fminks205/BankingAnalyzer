import os
import pandas as pd

from src.server.domain.Entry import Entry
from src.server.domain.Report import Report
from src.server.config.FilePathsConfig import FilePathsConfig
from src.server.filesystem.csvutil import find_csv_files, write_entries_to_csv
from src.server.filesystem.pdfutil import find_pdf_files, read_pdf
from src.server.parsers.sparkasse.kontoauszug_schema2025.SKA2025parser import entryRawText_to_entry, extract_raw_entries_from_page_text


def rebuild_csv_files():
	files = find_pdf_files(FilePathsConfig.get_kontoauszug_pdfs_root_dir_relative())
	for pdf_file in files:
		print(f"generating csv for {pdf_file}")
		text_pages = read_pdf(pdf_file)

		entries = []
		for page_text in text_pages:
			raw_entries = extract_raw_entries_from_page_text(page_text)
			for raw_entry in raw_entries:
				entry = entryRawText_to_entry(raw_entry)
				entries.append(entry)

		base_filename = os.path.basename(pdf_file)
		csv_file = f"{base_filename}.csv"
		csv_file_path = os.path.join(FilePathsConfig.get_kontoauszug_csv_root(), csv_file)
		write_entries_to_csv(csv_file_path, entries)

def get_reports():
	files = find_csv_files(FilePathsConfig.get_kontoauszug_csv_root())
	reports = []
	for file in files:
		df = pd.read_csv(file)
		df = df.fillna('')
		entries = [Entry(**row) for row in df.to_dict(orient='records')]
		report = Report(year=0, month=0, entries=entries)
		reports.append(report)
	return reports