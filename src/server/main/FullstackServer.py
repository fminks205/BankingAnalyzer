import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi.staticfiles import StaticFiles

from api.API import API

root_dir = "/app" 
for dirpath, dirnames, filenames in os.walk(root_dir):
    print(f"DIR: {dirpath}")
    for name in filenames:
        print(f"  FILE: {name}")

api = API()
app = api.app

static_dir = "/app/server/public"

try:
	print(f"[INFO] Mounting frontend from: {static_dir}")
	app.mount("/", StaticFiles(directory=static_dir, html=True), name="frontend")
except Exception as e:
    print(f"[ERROR] Failed to mount static files: {e}")

