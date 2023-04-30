import sys
import pandas as pd
import numpy as np
from random import choice
from numpy.linalg import norm
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import SongRecNew as sr


def naive_bayes(data):
    final = pd.read_csv('SpotifyFeatures.csv')
    final = sr.data_clean(final)
    final = final[~final['track_id'].isin(data)]
    #NTS DROP ID
    temp = final.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'],axis=1,inplace=False)
    ss, pca, temp = sr.run_pca(temp, 12)
    #print(data)
    #temp_data = ss.transform(data)
    #temp_data = pca.transform(temp_data)
    X_train, X_test, y_train, y_test = train_test_split(data.drop('liked_by_user', axis=1), data['liked_by_user'], test_size=0.2, random_state=42)
    gnb = GaussianNB()
    gnb.fit(X_train, y_train)
    results = gnb.predict_proba(temp)[:,1]
    final['Naive Bayes'] = results
    ret_songs_3 = final[['track_name','artist_name','track_id', 'genre','Naive Bayes']].sort_values(by=['Naive Bayes'], ascending=False)
    return(ret_songs_3.head(20))


def main_2():
    #This is just a test I need more data
    args = sys.argv[1:]
    liked = args[0].split(',') #UPDATE FOR PROPER IO
    #df = pd.read_csv('user1_PCA.csv')
    #df_cp = df.drop(columns=['track_id'],axis=1,inplace=False)
    df = pd.read_csv('SpotifyFeatures.csv')
    songs = [choice(liked) for _ in range(5)]
    dislikes = []
    for i in songs: 
        dislikes.append(sr.least_vec_cos(i,df_std))
    print(naive_bayes(df_cp))
    #df = sr.data_clean(df)

    #Might need depending on what input data is recived
    #drop song specific data and non-numeric values
    #df = df.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'])
    #scaler_1, pca_1, reduced_1 = sr.run_pca(df,0.9)
    #print(reduced_1)






if __name__ == '__main__':
    main_2()