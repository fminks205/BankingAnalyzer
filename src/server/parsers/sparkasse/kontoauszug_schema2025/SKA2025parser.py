import re
from typing import List

from src.server.domain.Entry import Entry
from src.server.domain.EntryRawText import EntryRawText

# Table
## Date
DATE_REGEX = re.compile(r"Kontoauszug (\d+)/(\d+)")

## Header
TABLE_HEADER = "Datum Erläuterung Betrag EUR"
## Optional balacne line: Kontostand am 30.06.2025, Auszug Nr. 6 2.845,42
## Entry
### 1st line: "03.07.2025Lastschrift -66,89"
# Updated regex to allow optional spaces and match descriptions with slashes/colons
ENTRY_REGEX = re.compile(r"(\d{2}\.\d{2}\.\d{4})\s*(.*?)\s*(-?[\.\d]+,\d{2})")
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

def extract_date(text: str):
	lines = text.splitlines()
	for line in lines:
		date_match = DATE_REGEX.match(line)
		if date_match:
			month, year = date_match.groups()
			return int(month), int(year)
	return 0, 0