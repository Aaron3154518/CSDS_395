import sys
import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import SongRecNew as sr

def linear_regression(data):

    col_names = ['popularity', 'acousticness', 'danceability', 'duration_ms', 'energy', 'instrumentalness',  'liveness', 'loudness','speechiness','tempo','valence','liked_by_user']
    # load dataset
    df = pd.read_csv('PythonRecs/SpotifyFeatures.csv')
    cleaned_df = sr.data_clean(df)
    final_df = cleaned_df[~cleaned_df['track_id'].isin(data)]

    temp = final_df.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'],axis=1,inplace=False)
    pca = PCA(n_components=12)
    ss, pca, temp = sr.run_pca(temp, 12)
    song_std = ss.transform(search_song)
    song1 = pca.transform(song_std)

    #Change this for output of top songs
    temp = sr.vec_cos(song1,temp,data_og)
    ids = list(set(temp.head(20).loc[:, 'track_id'].to_list()))
    scores = list(set(temp.head(20).loc[:,'sim_score'].to_list()))
    print(','.join(ids))
    print(','.join([str(s) for s in scores]))


    #split dataset in features and target variable
    feature_cols = ['popularity', 'acousticness', 'danceability', 'duration_ms', 'energy', 'instrumentalness',  'liveness', 'loudness','speechiness','tempo','valence']
    X = cleaned_df[feature_cols] # Features
    y = cleaned_df.liked_by_user # Target variable

    # split X and y into training and testing sets

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.6, random_state=16)

    # instantiate the model (using the default parameters)
    logreg = LogisticRegression(random_state=16)

    # fit the model with data
    logreg.fit(X_train, y_train)

    y_pred = logreg.predict_proba(X_test.head(50))
    y_pred[:,1],y_test.head(50)


    np.sum(np.dot(y_pred,y_train))/np.size(y_pred)

    return y_pred

def main():

    data = pd.read_csv('PythonRecs/SpotifyFeatures.csv')
    # args = sys.argv[1:]
    print(linear_regression(data))
    

if __name__ == '__main__':
    main()

