# =====================
# Stage 1: Backend dependencies & OpenAPI generation
# =====================
FROM python:3.12-slim AS backend-build

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY src/server ./server

# Generate OpenAPI YAML
RUN python -m server.main.openapiExport

# =====================
# Stage 2: Frontend build (Angular + OpenAPI client)
# =====================
FROM node:22 AS frontend-build

WORKDIR /app/frontend

# Install Java (for OpenAPI generator)
RUN apt-get update && apt-get install -y openjdk-17-jdk && rm -rf /var/lib/apt/lists/*

# Install Angular CLI + OpenAPI generator
RUN npm install -g @angular/cli @openapitools/openapi-generator-cli

# Copy frontend code
COPY src/gui/package*.json ./
RUN npm install
COPY src/gui .

# Copy OpenAPI spec from backend build
COPY --from=backend-build /app/build/openapi/openapi.yml ./openapi.yml

# Generate Angular client from OpenAPI
RUN openapi-generator-cli generate \
    -i openapi.yml \
    -g typescript-angular \
    -o src/app/client/openapi \
    --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model

# Build Angular production bundle

RUN npx ng build --configuration=production --output-path=/app/frontend/dist

# =====================
# Stage 3: Final image (Python backend + Angular static files)
# =====================
FROM python:3.12-slim AS final

WORKDIR /app

# Install backend deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY --from=backend-build /app/server/ /app/server/

# Copy Angular production build from frontend stage
COPY --from=frontend-build /app/frontend/dist/browser/ /app/server/public/

# Expose backend port
EXPOSE 8000

# Start backend
CMD ["uvicorn", "server.main.FullstackServer:app", "--host", "0.0.0.0", "--port", "8000"]
