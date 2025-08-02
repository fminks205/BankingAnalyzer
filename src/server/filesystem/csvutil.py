import os
from typing import List

def find_csv_files(directory: str) -> List[str]:
	results = []
	for root, _, files in os.walk(directory):
		for file in files:
			if file.lower().endswith('.csv'):
				results.append(os.path.join(root, file))
	return results