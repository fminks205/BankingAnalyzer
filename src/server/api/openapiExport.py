import requests
import yaml

HOST = "127.0.0.1"
PORT = 8000


def write_openapi_yaml(api_endpoint: str, path: str):
	response = requests.get(api_endpoint)
	openapi_yaml = yaml.dump(response.json())

	with open(path, "w") as f:
		f.write(openapi_yaml)

if __name__ == "__main__":
	write_openapi_yaml(
		f"http://{HOST}:{PORT}/openapi.json", 
		"build/openapi/openapi.yml"
	)
	print("Wrote openapi.yml")
