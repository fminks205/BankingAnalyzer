import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import uvicorn

from api.API import API

if __name__ == "__main__":
	api = API()
	app = api.app
	
	HOST = "127.0.0.1"
	PORT = 8000
	uvicorn.run(
		app, 
		host=f"{HOST}", 
		port=PORT
	)