from typing import List

from src.server.domain.Lane import Lane
from src.server.core.workflow import get_lanes, get_reports, rebuild_csv_files, post_lanes
from src.server.domain.Report import Report

def create_endpoints(app):
	@app.get("/reports", response_model=List[Report], operation_id="get_reports")
	def get_reports_requests():
		return get_reports()
	
	@app.get("/reports/rebuild_csv", response_model=str, operation_id="rebuild_csv")
	def rebuild_csv_request():
		rebuild_csv_files()
		return "successfully created csv files"
	
	@app.get("/lanes", response_model=List[Lane], operation_id="get_lanes")
	def get_lanes_request():
		return get_lanes()

	@app.post("/lanes", response_model=List[Lane], operation_id="post_lanes")
	def post_lanes_request(lanes: List[Lane]):
		return post_lanes(lanes)
