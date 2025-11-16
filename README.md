## Usage

```shell
docker-compose up --build
```

```shell
docker build --target frontend-build -t frontend-build .
```

## Development

### Start server

```shell
.\venv\Scripts\Activate
```

```shell
py -m src.server.main.RestServer
```

### Start gui
```shell
cd src\gui
npm run start
```


```shell
pip freeze > requirements.txt
```

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