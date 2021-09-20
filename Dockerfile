FROM python:3.8-slim

RUN apt update
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY ./ /app

RUN pip install --no-cache-dir -r requirements.txt && \
    python manage.py makemigrations && \
    python manage.py migrate
