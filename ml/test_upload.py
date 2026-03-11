import requests
import os

backend_url = os.getenv("BACKEND_URL", "https://pharmaguard-backend.onrender.com")
url = f"{backend_url}/api/analyze"
files = {"vcf_file": open(r"C:\Users\sharm\OneDrive\Desktop\PharmaGuard\ml\high_risk_patient.vcf", "rb")}
data = {"drugs": "Clopidogrel,Codeine"}
resp = requests.post(url, files=files, data=data, timeout=120)
print("Status:", resp.status_code)
try:
    print(resp.json())
except Exception:
    print(resp.text)
