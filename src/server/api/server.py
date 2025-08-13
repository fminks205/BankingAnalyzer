from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.server.core.workflow import init_lane_file
from src.server.api.api import create_endpoints


HOST = "127.0.0.1"
PORT = 8000

if __name__ == "__main__":
	init_lane_file()

	app = FastAPI()
	create_endpoints(app)

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_methods=["*"],
		allow_headers=["*"],
	)

	uvicorn.run(app, host=f"{HOST}", port=PORT)