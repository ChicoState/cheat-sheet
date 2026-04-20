FROM python:3.14.3

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    wget \
    tar \
    fontconfig \
    libpq-dev \
    pkg-config \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Download and extract the appropriate Tectonic binary
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then \
    wget -qO tectonic.tar.gz "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-aarch64-unknown-linux-musl.tar.gz" ; \
    else \
    wget -qO tectonic.tar.gz "https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz" ; \
    fi && \
    tar -xzf tectonic.tar.gz && \
    mv tectonic /usr/local/bin/ && \
    rm tectonic.tar.gz

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "export PGPASSWORD=${POSTGRES_PASSWORD:-cheatsheet_pass}; until pg_isready -h ${POSTGRES_HOST:-db} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-cheatsheet_user} -d ${POSTGRES_DB:-cheatsheet_db}; do sleep 2; done && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
