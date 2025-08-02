import os
from fastapi import FastAPI
from typing import List

from src.server.filesystem.csvutil import find_csv_files
from src.server.domain.Report import Report
from src.server.domain.Entry import Entry
import pandas as pd
import uvicorn

if __name__ == "__main__":

	app = FastAPI()

	@app.get("/reports", response_model=List[Report])
	def get_reports():
		raw_data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..','resources' ,'Kontoauszuege'))
		files = find_csv_files(raw_data_dir)
		reports = []
		for file in files:
			df = pd.read_csv(file)
			print(df)
			df = df.fillna('')
			entries = [Entry(**row) for row in df.to_dict(orient='records')]
			print(entries)
			report = Report(year=0, month=0, entries=entries)
			reports.append(report)
		return reports

	uvicorn.run(app, host="127.0.0.1", port=8000)
