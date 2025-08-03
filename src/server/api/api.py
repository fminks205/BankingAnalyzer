from typing import List

from src.server.core.workflow import get_reports, rebuild_csv_files
from src.server.domain.Report import Report

def create_endpoints(app):
	@app.get("/reports", response_model=List[Report])
	def get_reports_requests():
		return get_reports()
	
	@app.get("/reports/rebuild_csv", response_model=str)
	def rebuild_csv_request():
		rebuild_csv_files()
		return "successfully created csv files"
