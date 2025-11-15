import os

class FilePathsConfig:
	def get_kontoauszug_csv_root(self):
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'Kontoauszuege'))
	
	def get_kontoauszug_pdfs_root_dir_relative(self):
		return "resources/Kontoauszuege"
	
	def get_lane_file_path(self):
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'lanes', 'lanes.csv'))
	
	def get_lane_entry_assignments_file_path(self):
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'lanes', 'lane-entry-assignments.csv'))

	def get_filter_file_path(self):
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'filters', 'filters.csv'))