# 1. Use a lightweight Python base image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /code

# 3. Copy just the requirements file first (this caches your dependencies so builds are faster)
COPY ./requirements.txt /code/requirements.txt

# 4. Install the Python packages
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 5. Copy your entire app folder into the container
COPY ./app /code/app

# 6. Expose the port FastAPI runs on
EXPOSE 8000

# 7. The command to boot up Uvicorn when the container starts
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
