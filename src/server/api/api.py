from fastapi.responses import HTMLResponse

from typing import List

from src.server.domain.Filter import Filter
from src.server.core.dashboardCreator import create_dashboard
from src.server.domain.Lane import Lane
from src.server.domain.LaneEntryAssignment import LaneEntryAssignment
from src.server.domain.Report import Report
from src.server.core.workflow import get_filter, get_lane_entry_assignments, get_lanes, get_reports, post_filter, rebuild_csv_files, post_lanes, post_lane_entry_assignments

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
	
	@app.get("/lanes-entry-assignments", response_model=List[LaneEntryAssignment], operation_id="get_lane_entry_assignments")
	def post_lanes_request():
		return get_lane_entry_assignments()
	
	@app.post("/lanes-entry-assignments", response_model=List[LaneEntryAssignment], operation_id="post_lane_entry_assignments")
	def post_lanes_request(assignments: List[LaneEntryAssignment]):
		return post_lane_entry_assignments(assignments)
	
	@app.get("/filter", response_model=List[Filter], operation_id="get_filter")
	def get_filter_request():
		return get_filter()
	
	@app.post("/filter", response_model=List[Filter], operation_id="post_filter")
	def post_filter_request(filters: List[Filter]):
		return post_filter(filters)
	
	@app.get("/dashboard", response_class=HTMLResponse, operation_id="get_dashboard")
	def dashboard():
		html_str = create_dashboard()
		return HTMLResponse(content=html_str)
