## Usage

Start server
```shell
py -m src.server.api.server
```

Start gui
```shell
cd src\gui
npx ng serve
```

For Auszug-pdf files extract .csv files
```shell
py -m src.server.parsers.sparkasse.kontoauszug_schema2025.SKA2025parser <path to pdf root>
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
npx openapi-generator-cli generate -i ../../build/openapi/openapi.yml -g typescript-angular -o client/src/app/core/modules/openapi --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model
```

