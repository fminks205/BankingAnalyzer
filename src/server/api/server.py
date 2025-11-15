import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.API import API

HOST = "127.0.0.1"
PORT = 8000

if __name__ == "__main__":
	app = FastAPI()

	api = API()
	api.create_endpoints(app)

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_methods=["*"],
		allow_headers=["*"],
	)

	uvicorn.run(app, host=f"{HOST}", port=PORT)