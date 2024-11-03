from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address

import json
from python import text_response
from python import sql_response
from python import csv_response

api_key = "" # Set the OpenAI key here
engine = "gpt-3.5-turbo"

db_conn="postgresql+psycopg2://postgres:postgres@localhost:5432/postgres"

app = Flask(__name__)
CORS(app)  # Permit all of the access from the origin
# limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["10 per minute"])
# limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["10 per minute"], storage_uri="redis://localhost:6379")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['POST'])
def process_data():
    new_text = request.form.get('new_text')
    done_list = json.loads(request.form.get('done_list'))
    input_type = request.form.get('input_type')
    file = request.files.get('file')  # Use request.files for file handling

    if len(new_text)<500:
        if input_type == "text":
            response = text_response.get_text_response(engine, new_text, done_list, api_key)
        elif input_type == "Database":
            response = sql_response.get_sql_response(engine, new_text, db_conn, api_key)
        elif input_type == "CSV":
            response = csv_response.get_csv_response(engine, new_text, file.stream, api_key)
    else:
        response = "too many words"
 
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
    # app.run()