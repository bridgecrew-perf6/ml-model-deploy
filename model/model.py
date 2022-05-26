import pandas as pd
import numpy as np

from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

train_df=pd.read_csv('train.csv')
test_df=pd.read_csv('test.csv')

X_train=train_df.drop('Activity',axis=1)
Y_train=train_df['Activity']
X_test=test_df.drop('Activity',axis=1)
Y_test=test_df['Activity']

# use a simple logistic regression for this classification problem
pipeline = Pipeline(steps= [('model', LogisticRegression(C=0.01,solver='liblinear'))])                     
pipeline.fit(X_train, Y_train)


# dump the pipeline model to be used in the front-end
from joblib import dump
dump(pipeline, filename="human_activity_classification.joblib")
