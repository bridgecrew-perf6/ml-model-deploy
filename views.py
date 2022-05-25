import os
import csv
import pandas as pd
import numpy as np

from flask import Flask, render_template, request, redirect, url_for
from joblib import load

print(os.getcwd())

pipeline = load("model/human_activity_classification.joblib")

def predict_result(data):
    df = pd.DataFrame(data[1:], columns =data[0])
    df = df.drop('Activity',axis=1)
    prediction = pipeline.predict(df)
    repacked = np.transpose([prediction])
    return repacked

app = Flask(__name__)
app.config['FILE_UPLOADS'] = os.getcwd() + "/upload/"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    data = []
    uploaded_file = request.files['test-csv']
    filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
    uploaded_file.save(filepath)
    with open(filepath) as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            data.append(row)
    prediction = predict_result(data)
    return render_template('index.html', data=data, prediction=prediction)

if __name__ == '__main__' :
    app.run(debug=True)

