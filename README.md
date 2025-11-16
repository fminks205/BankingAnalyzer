## Usage

Start server
```shell
py -m src.server.main.server
```

Start gui
```shell
cd src\gui
npm run start
```

## Development

```shell
.\venv\Scripts\Activate
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

