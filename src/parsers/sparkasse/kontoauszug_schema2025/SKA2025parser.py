import pdfplumber
import re
from typing import List
import sys

# Table
## Header
TABLE_HEADER = "Datum Erläuterung Betrag EUR"
## Optional balacne line: Kontostand am 30.06.2025, Auszug Nr. 6 2.845,42
## Entry
### 1st line: "03.07.2025Lastschrift -66,89"
# Updated regex to allow optional spaces and match descriptions with slashes/colons
ENTRY_REGEX = re.compile(r"(\d{2}\.\d{2}\.\d{4})\s*(.*)\s*(-?\d+,\d{2})")
### Subject lines: "Some Company 02122any-gibberish-stuff12323 Gläubiger-ID"
SUBJECT_REGEX = re.compile(r"(.*) Gläubiger-ID:(.+)")

# Break Patterns
## Signature, directly after table "Sparkasse ... Vorstand:"
SIGNATURE_BLOCK_REGEX = re.compile(r"Sparkasse.*?Vorstand:")
## Kontostand info at the end of table "Kontostand am 31.07.2025 um 20:04 Uhr"
FINAL_BALANCE_REGEX = re.compile(r"Kontostand am .*")

class EntryRawText:
	def __init__(self, header, subject):
		self.header = header
		self.subject = subject

class Entry:
	def __init__(self, date: str, kind: str, amount: str, subject: str, creditor_id: str = None):
		self.date = date
		self.kind = kind
		self.amount = amount
		self.subject = subject
		self.creditor_id = creditor_id

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

def read_sparkasse_kontoauszug(pdf_path):
	pages_text = []
	with pdfplumber.open(pdf_path) as pdf:
		for page in pdf.pages:
			pages_text.append(page.extract_text())
	return pages_text

if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("Usage: python SKA2025parser.py <pdf_file_path>")
		sys.exit(1)
	pdf_file = sys.argv[1]
	text_pages = read_sparkasse_kontoauszug(pdf_file)
	for i, page_text in enumerate(text_pages):
		print(f"--- Page {i+1} ---")
		raw_entries = extract_raw_entries_from_page_text(page_text)
		for i_e, raw_entry in enumerate(raw_entries):
			entry = entryRawText_to_entry(raw_entry)
			print(f"- Entry {i+1}.{i_e+1} -")
			print(entry.date)
			print(entry.kind)
			print(entry.amount)
			print(entry.subject)
			print(entry.creditor_id)
			print()