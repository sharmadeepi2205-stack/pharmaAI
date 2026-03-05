FROM mambaorg/micromamba:1.5.0

WORKDIR /app

# Copy source into container
COPY . /app

# Install Python + cyvcf2 from conda-forge (micromamba), then pip install remaining requirements
RUN micromamba install -y -n base -c conda-forge -c bioconda -c defaults python=3.11 cyvcf2 && \
    micromamba run -n base python -m pip install --no-cache-dir -r requirements.txt

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Use Gunicorn with proper port binding
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "sync", "--timeout", "120"]
