# Bankalyzer

## Usage

To run this web app simply run:

```shell
docker-compose up --build
```

If you want to persist the containers data on your machine <br>
uncomment the volume statements in the `docker-compose.yml`.


## Development

### Server

All server development should happen in a virtual environment:
```shell
.\venv\Scripts\Activate
```

Start the server:
```shell
py -m src.server.main.RestServer
```

After installing new dependencies into the virtual environment, add them to dependencies:
```shell
pip freeze > requirements.txt
```

### GUI to Server connection

Create openapi.yml
```shell
py -m src.server.main.openapiExport
```

Create angular client from openapi.yml
``` shell
cd .\src\gui &
npx openapi-generator-cli generate -i ../../build/openapi/openapi.yml -g typescript-angular -o src/app/client/openapi --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model &
cd ..\..
```

### GUI

Start the GUI:
```shell
cd src\gui
npm run start
```

