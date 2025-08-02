from typing import List
import pandas as pd
import os

from src.server.parsers.sparkasse.kontoauszug_schema2025.SKA2025parser import rebuild_csv_files
from src.server.filesystem.csvutil import find_csv_files
from src.server.domain.Report import Report
from src.server.domain.Entry import Entry

def create_endpoints(app):
	@app.get("/reports", response_model=List[Report])
	def get_reports():
		raw_data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'Kontoauszuege'))
		files = find_csv_files(raw_data_dir)
		reports = []
		for file in files:
			df = pd.read_csv(file)
			df = df.fillna('')
			entries = [Entry(**row) for row in df.to_dict(orient='records')]
			report = Report(year=0, month=0, entries=entries)
			reports.append(report)
		return reports
	
	@app.get("/reports/rebuild_csv", response_model=str)
	def rebuild_csv():
		csv_target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','persistence' ,'Kontoauszuege'))
		rebuild_csv_files("resources/Kontoauszuege", csv_target_dir)
		return "successfully created csv files"
