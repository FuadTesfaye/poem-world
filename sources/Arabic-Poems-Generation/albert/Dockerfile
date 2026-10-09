FROM python:3.11-slim

WORKDIR /app

# Copy service source
COPY . .

# Environment
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "index.py"]
