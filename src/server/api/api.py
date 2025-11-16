from fastapi.responses import HTMLResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from typing import List

from core.Persistence import Persistence
from core.Workflow import Workflow
from core.DashboardCreator import DashboardCreator
from domain.Filter import Filter
from domain.Lane import Lane
from domain.LaneEntryAssignment import LaneEntryAssignment
from domain.Report import Report


class API:
	def __init__(self):
		self.app = FastAPI()

		self.create_endpoints()

		self.app.add_middleware(
			CORSMiddleware,
			allow_origins=["*"],
			allow_methods=["*"],
			allow_headers=["*"],
		)

		self.persistence: Persistence = Persistence()
		self.workflow: Workflow = Workflow(self.persistence)
		self.dashboard_creator: DashboardCreator = DashboardCreator()

	def create_endpoints(self):
		app = self.app

		@app.get("/reports", response_model=List[Report], operation_id="get_reports")
		def get_reports_requests():
			return self.persistence.get_reports()
		
		@app.get("/reports/rebuild_csv", response_model=str, operation_id="rebuild_csv")
		def rebuild_csv_request():
			self.workflow.rebuild_csv_files()
			return "successfully created csv files"
		
		@app.get("/lanes", response_model=List[Lane], operation_id="get_lanes")
		def get_lanes_request():
			return self.persistence.read_lanes()

		@app.post("/lanes", response_model=List[Lane], operation_id="post_lanes")
		def post_lanes_request(lanes: List[Lane]):
			return self.persistence.save_lanes(lanes)
		
		@app.get("/lanes-entry-assignments", response_model=List[LaneEntryAssignment], operation_id="get_lane_entry_assignments")
		def post_lanes_request():
			return self.persistence.read_lane_entry_assignments()
		
		@app.post("/lanes-entry-assignments", response_model=List[LaneEntryAssignment], operation_id="post_lane_entry_assignments")
		def post_lanes_request(assignments: List[LaneEntryAssignment]):
			return self.persistence.save_lane_entry_assignments(assignments)
		
		@app.get("/filter", response_model=List[Filter], operation_id="get_filter")
		def get_filter_request():
			return self.persistence.read_filters()
		
		@app.post("/filter", response_model=List[Filter], operation_id="post_filter")
		def post_filter_request(filters: List[Filter]):
			return self.persistence.save_filters(filters)
		
		@app.get("/dashboard", response_class=HTMLResponse, operation_id="get_dashboard")
		def dashboard():
			html_str = self.dashboard_creator.create_dashboard(
				self.persistence.read_lane_entry_assignments(),
				self.persistence.read_lanes(),
				self.persistence.get_reports()
			)
			return HTMLResponse(content=html_str)
