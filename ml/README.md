PharmaGuard ML service (Docker)

This folder contains a Dockerfile and docker-compose to run the Flask-based ML service with a conda-provided `cyvcf2` binary (installed via micromamba/conda-forge).

Build and run with Docker Compose:

```bash
cd ml
docker-compose up --build
```

The Flask app will be exposed on http://localhost:8000. The endpoint used by the backend is expected to be `http://localhost:8000/analyze`.

If you prefer to run locally without Docker, install `cyvcf2` via conda/conda-forge before `pip install -r requirements.txt`:

```bash
conda create -n pharmaguard python=3.11
conda activate pharmaguard
conda install -c conda-forge cyvcf2
pip install -r requirements.txt
python app.py
```
