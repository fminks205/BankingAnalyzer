## Usage

Start server
```shell
py -m src.server.api.server
```

For Auszug-pdf files extract .csv files
```shell
py -m src.server.parsers.sparkasse.kontoauszug_schema2025.SKA2025parser <path to pdf root>
```


## Development

```shell
.\venv\Scripts\Activate
```

```shell
py -m src.server.api.openapiExport
```

