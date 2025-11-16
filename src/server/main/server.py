import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import uvicorn

from api.API import API

HOST = "127.0.0.1"
PORT = 8000

if __name__ == "__main__":
	api = API()
	uvicorn.run(
		api.app, 
		host=f"{HOST}", 
		port=PORT
	)