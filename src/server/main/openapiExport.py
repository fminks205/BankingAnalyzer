import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

import yaml
from fastapi.openapi.utils import get_openapi

from api.api import API

def write_openapi_yaml(path: str):
    api = API()
    app = api.app

    schema = get_openapi(
        title=app.title if hasattr(app, "title") else "API",
        version=app.version if hasattr(app, "version") else "0.1.0",
        routes=app.routes,
    )

    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", encoding="utf-8") as f:
        yaml.dump(schema, f, sort_keys=False, allow_unicode=True)

    print(f"Wrote OpenAPI specification to: {path}")


if __name__ == "__main__":
    write_openapi_yaml("build/openapi/openapi.yml")

