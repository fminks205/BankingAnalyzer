import re
from typing import List
import sys
import os
import csv

from src.server.filesystem.pdfutil import find_pdf_files, read_pdf
from src.server.domain.Entry import Entry
from src.server.domain.EntryRawText import EntryRawText

# Table
## Header
TABLE_HEADER = "Datum Erläuterung Betrag EUR"
## Optional balacne line: Kontostand am 30.06.2025, Auszug Nr. 6 2.845,42
## Entry
### 1st line: "03.07.2025Lastschrift -66,89"
# Updated regex to allow optional spaces and match descriptions with slashes/colons
ENTRY_REGEX = re.compile(r"(\d{2}\.\d{2}\.\d{4})\s*(.*?)\s*(-?\d+,\d{2})")
### Subject lines: "Some Company 02122any-gibberish-stuff12323 Gläubiger-ID"
SUBJECT_REGEX = re.compile(r"(.*) Gläubiger-ID:(.+)")

# Break Patterns
## Signature, directly after table "Sparkasse ... Vorstand:"
SIGNATURE_BLOCK_REGEX = re.compile(r"Sparkasse.*?Vorstand:")
## Kontostand info at the end of table "Kontostand am 31.07.2025 um 20:04 Uhr"
FINAL_BALANCE_REGEX = re.compile(r"Kontostand am .*")


def entryRawText_to_entry(raw_entry: EntryRawText) -> Entry:
	header_match = ENTRY_REGEX.match(raw_entry.header)
	if not header_match:
		raise ValueError(f"Header does not match expected format: {raw_entry.header}")
	date, kind, amount = header_match.groups()

	subject_match = SUBJECT_REGEX.search(raw_entry.subject)
	if subject_match:
		subject, creditor_id = subject_match.groups()
		subject = subject.strip()
	else:
		subject = raw_entry.subject.strip()
		creditor_id = None

	return Entry(date=date, kind=kind.strip(), amount=amount, subject=subject, creditor_id=creditor_id)

def extract_raw_entries_from_page_text(text: str) -> List[EntryRawText]:
	entries: List[EntryRawText] = []

	current_header: str | None = None
	current_subject: str = ""
	collecting: bool = False

	lines = text.splitlines()
	for line in lines:
		if SIGNATURE_BLOCK_REGEX.match(line) or FINAL_BALANCE_REGEX.match(line):
			break
		if ENTRY_REGEX.match(line):
			if current_header is not None:
				entries.append(EntryRawText(current_header, current_subject))
			current_header = line.strip()
			current_subject = ""
			collecting = True
		elif collecting:
			current_subject = current_subject + line.strip()

	if current_header is not None and current_subject:
		entries.append(EntryRawText(current_header, current_subject))

	return entries

def rebuild_csv_files(pdf_root_dir: str, csv_root_dir: str):
	files = find_pdf_files(pdf_root_dir)
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
		csv_file_path = os.path.join(csv_root_dir, csv_file)
		with open(csv_file_path, mode="w", newline="", encoding="utf-8") as csvfile:
			writer = csv.writer(csvfile)
			writer.writerow(["date", "kind", "amount", "subject", "creditor_id"])
			for entry in entries:
				writer.writerow([entry.date, entry.kind, entry.amount, entry.subject, entry.creditor_id if entry.creditor_id else ""])