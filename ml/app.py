from flask import Flask, request, jsonify
import json
import os
from werkzeug.utils import secure_filename
from analysis import process_vcf_submission

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_DIR
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # 8MB safety limit

ALLOWED_EXT = {'.vcf'}


def allowed_filename(filename):
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXT


@app.route('/analyze', methods=['POST'])
def analyze():
    # Expect multipart form with file and optional drugs
    if 'vcf_file' not in request.files:
        return jsonify({"status": "error", "message": "No vcf_file part"}), 400
    file = request.files['vcf_file']
    if file.filename == '':
        return jsonify({"status": "error", "message": "No selected file"}), 400

    filename = secure_filename(file.filename)
    if not allowed_filename(filename):
        return jsonify({"status": "error", "message": "Invalid file extension, .vcf required"}), 400

    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    try:
        results_json = process_vcf_submission(save_path)
        # process_vcf_submission returns JSON string; convert to Python object for consistent response
        results = json.loads(results_json)
        return jsonify({"status": "success", "results": results}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        try:
            os.remove(save_path)
        except Exception:
            pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
