# Pandas
import pandas as pd

# SQL Alchemy
from sqlalchemy import create_engine

# Flask
from flask import Flask, jsonify

# JSON encoder and decoder
import json

from flask import after_this_request

from config import username,pwd

app = Flask(__name__)

# Create engine and connect
# Please enter your Postgres Username and Password in config.py file before you proceed
engine = create_engine(f'postgresql://{username}:{pwd}@localhost/Project_2')
conn = engine.connect()

# Create index route
@app.route("/")
def index():
    return 'API for Schools data, Enter /schools in the browser to see the data'


@app.route("/schools", methods=['GET'])
def schools():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    data = pd.read_sql("SELECT * FROM project_data", conn)

    json_string = data.to_json(orient='records')

    # Decoding JSON present in the string
    json_list = json.loads(json_string)

    return jsonify(json_list)


if __name__ == '__main__':
    app.run(debug=True)