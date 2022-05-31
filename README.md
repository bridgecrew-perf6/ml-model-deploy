# ml-model-deploy
## Introduction
In this project, I have built a simple interface that accepts the Human Activity Recognition test data from [Kaggle](https://www.kaggle.com/uciml/human-activity-recognition-with-smartphones) and displays a simple table-based visualisation of the data uploaded and the prediction made

**UPDATE (v0.2.0):** Have added more visualisation in the front-end, including a pie chart and a bar chart 

## Setting up the Project
1. Create a virtual environment using `virtualenv venv`
2. Activate the virtual environment using `source venv/bin/activate`
3. Install all the python requirements: `pip install -r requirements.txt`
4. Run `model/model.py` to dump the machine learning pipeline. A new file `human_activity_classification.joblib` should appear in `model/`
5. Run `server.py` to start the backend server. Keep this terminal open
6. Open a new terminal and navigate to `frontend/`. Run `npm install` to install the libraries required, then run `npm start` to start the frontend server
7. Navigate to `localhost:3000` in your browser
8. Upload the test file `model/test.csv` and observe the prediction result

## Implementation
### Interface
This project is built on Flask as a back-end and the front-end is built on HTML/CSS. I have used `sklearn` for the implementation of the machine learning model and the pipeline is dumped using `joblib`

**UPDATE (v0.2.0):** In this new version, I have ported the front-end to ReactJS

### Machine Learning Model
Since this is a classification problem, a logistic regression model should work well as a baseline model. Due to time constraint of this project, no pre-processing was done to the data and all columns were used to predict the target class. This yielded an accuracy of close to 94% in the given `test.csv`

## Future Improvements
There are a lot of ways this project can be improved, including the following:
- [x] Add in more visualisations for the prediction result, such as a confusion matrix
- [ ] Improve the machine learning model, such as
    - [ ] Include more pre-processing steps to the data. There are a lot of columns (more than 500) in the training data. We can carry out a Principal Component Analysis to see which columns account for the most variance in the target class
    - [ ] We can use a different machine learning model. Logistic regression is good for basic classification but a neural-network based model may be able to capture non-linearity in the data better
    - [x] ~~Use a different metric to measure the performance. Accuracy might not be the best indicator in dataset with highly skewed target class~~ **Accuracy works fine in this dataset**
- [ ] Add in more features in the interface
    - [ ] Validate that the csv is in the correct format before running the pipeline
    - [ ] Upload interface can be connected to a cloud storage system instead of storing locally
- [ ] Deploy the interface 
