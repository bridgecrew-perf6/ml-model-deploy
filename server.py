import os
import csv
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix

from flask import Flask, request
from flask_cors import CORS
from joblib import load

pipeline = load("model/human_activity_classification.joblib")

def predict_result(data):
    df = pd.DataFrame(data[1:], columns =data[0])
    df = df.drop('Activity',axis=1)
    prediction = pipeline.predict(df)
    repacked = np.transpose([prediction])
    return repacked

train_df=pd.read_csv('model/train.csv')
def generate_data_imbalance_pie():
    return train_df.groupby('Activity').size().to_dict()

def get_ground_truth_array_from_data(data):
    ground_truth = []
    for index in range(len(data)):
        if index == 0:
            continue

        row = data[index]
        ground_truth.append(row[-1])

    return ground_truth

def generate_confusion_matrix(data, prediction, label):
    ground_truth = get_ground_truth_array_from_data(data)
    return confusion_matrix(ground_truth, prediction, labels=label)

def calculate_accuracy(data, prediction):
    ground_truth = get_ground_truth_array_from_data(data)
    return accuracy_score(ground_truth, prediction)

app = Flask(__name__)
CORS(app) # to allow cross-origin request between axios and Flask
app.config['FILE_UPLOADS'] = os.getcwd() + "/upload/"

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    # upload file locally
    uploaded_file = request.files['test-csv']
    filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
    uploaded_file.save(filepath)

    # read csv into 2d array
    data = []
    with open(filepath) as file:
        csv_file = csv.reader(file)
        for row in csv_file:
            data.append(row)

    # make prediction
    prediction = predict_result(data)

    # generate data for useful visualisation
    pie = generate_data_imbalance_pie()
    label = ['LAYING', 'SITTING', 'STANDING', 'WALKING', 'WALKING_DOWNSTAIRS', 'WALKING_UPSTAIRS']
    matrix = generate_confusion_matrix(data, prediction, label)
    accuracy = calculate_accuracy(data, prediction)

    return {
        "data": data,
        "prediction": prediction.tolist(),
        "visualisation": {
            "pie": pie,
            "confusion": {
                "matrix": matrix.tolist(),
                "label": label
            },
            "accuracy": accuracy
        }
    }

if __name__ == '__main__' :
    app.run(debug=True)
