FROM python:3.8-slim

ARG POSTGRES_HOST
ENV POSTGRES_HOST $POSTGRES_HOST
RUN apt update
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt && \
    python manage.py makemigrations && \
    python manage.py migrate
