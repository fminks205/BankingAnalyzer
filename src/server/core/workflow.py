import os
from config.FilePathsConfig import FilePathsConfig
from core.Persistence import Persistence
from domain.Entry import Entry
from parsers.sparkasse.kontoauszug_schema2025.SKA2025parser import SKA2025parser


class Workflow:
	def __init__(self, persistence: Persistence):
		self.persistence = persistence
		self.file_paths_config = FilePathsConfig()
		self.parser = SKA2025parser()
	
	def rebuild_csv_files(self):
		src_pdfs = self.persistence.find_pdf_files(self.file_paths_config.get_kontoauszug_pdfs_root_dir_relative())
		for src_pdf in src_pdfs:
			text_pages = self.persistenceread_pdf(src_pdf)

			month, year = self.parser.extract_date(text_pages[0])
			metadata = {
				"month": month,
				"year": year
			}

			entries: list[Entry] = []
			for page_text in text_pages:
				raw_entries = self.parser.extract_raw_entries_from_page_text(page_text)
				for raw_entry in raw_entries:
					entry = self.parser.entryRawText_to_entry(raw_entry)
					entries.append(entry)
			for i, entry in enumerate(entries):
				entry.id = i

			base_filename = os.path.basename(src_pdf)
			csv_file = f"{base_filename}.csv"
			csv_file_path = os.path.join(FilePathsConfig.get_kontoauszug_csv_root(), csv_file)
			self.persistence.write_entries_to_csv(csv_file_path, entries, metadata)