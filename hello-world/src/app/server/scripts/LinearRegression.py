import pandas as pd
import io

from google.colab import drive
drive.mount('/content/drive')
from google.colab import files
uploaded = files.upload()
col_names = ['popularity', 'acousticness', 'danceability', 'duration_ms', 'energy', 'instrumentalness',  'liveness', 'loudness','speechiness','tempo','valence','liked_by_user']
# load dataset
pima = pd.read_csv(io.StringIO(uploaded['user_new.csv'].decode('utf-8')), names=col_names)

#split dataset in features and target variable
feature_cols = ['popularity', 'acousticness', 'danceability', 'duration_ms', 'energy', 'instrumentalness',  'liveness', 'loudness','speechiness','tempo','valence']
X = pima[feature_cols] # Features
y = pima.liked_by_user # Target variable

# split X and y into training and testing sets
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.6, random_state=16)

# import the class
import numpy as np
from sklearn.linear_model import LogisticRegression

# instantiate the model (using the default parameters)
logreg = LogisticRegression(random_state=16)

# fit the model with data
logreg.fit(X_train, y_train)

y_pred = logreg.predict_proba(X_test.head(50))
y_pred[:,1],y_test.head(50)

import numpy as np

np.sum(np.dot(y_pred,y_train))/np.size(y_pred)

