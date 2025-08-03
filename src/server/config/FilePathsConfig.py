import os

class FilePathsConfig:
	@staticmethod
	def get_kontoauszug_csv_root():
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'Kontoauszuege'))
	
	@staticmethod
	def get_kontoauszug_pdfs_root_dir_relative():
		return "resources/Kontoauszuege"
	
	@staticmethod
	def get_lane_file_path():
		return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'lanes', 'lanes.csv'))
