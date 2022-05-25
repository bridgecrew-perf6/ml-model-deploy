import pandas as pd
import numpy as np

train_df=pd.read_csv('train.csv')
test_df=pd.read_csv('test.csv')

X_train=train_df.drop('Activity',axis=1)
Y_train=train_df['Activity']
X_test=test_df.drop('Activity',axis=1)
Y_test=test_df['Activity']

from sklearn.linear_model import LogisticRegression
# lr_clf=LogisticRegression(C=0.01,solver='liblinear')
# lr_clf.fit(X_train,Y_train)

# from sklearn.metrics import classification_report,accuracy_score
# y_hat=lr_clf.predict(X_test)
# print('accuracy score(test data): \n',accuracy_score(Y_test,y_hat))
# print('Classification report(test dataset): \n',classification_report(Y_test,y_hat))

# define the stages of the pipeline
from sklearn.pipeline import Pipeline
pipeline = Pipeline(steps= [('model', LogisticRegression(C=0.01,solver='liblinear'))])

# fit the pipeline model with the training data                            
pipeline.fit(X_train, Y_train)

print(pipeline.predict(X_test))

# import joblib
# from joblib import dump

# # dump the pipeline model
# dump(pipeline, filename="human_activity_classification.joblib")
