## Usage

Start server
```shell
py -m src.server.api.server
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
py -m src.server.api.openapiExport
```

Create angular client from openapi.yml
```
npx openapi-generator-cli generate -i ../../build/openapi/openapi.yml -g typescript-angular -o src/app/client/openapi --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model
```

