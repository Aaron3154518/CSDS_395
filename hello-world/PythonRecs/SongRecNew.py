import sys
import pandas as pd
import numpy as np
from numpy.linalg import norm
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
import pymongo
from pymongo import MongoClient

#To do: figure out Input output needs for website and adapt
#Add functionality that handles more recent songs and songs not in DB

def data_clean(data):
    #Create a dummy variable to code for genre, key and mode
    dummies_g = pd.get_dummies(data['genre'], prefix='genre')
    data = pd.concat([data, dummies_g], axis=1)

    #dummies_k = pd.get_dummies(df['key'], prefix='key')
    #df = pd.concat([df, dummies_k], axis=1)

    dummies_m = pd.get_dummies(data['mode'], prefix='mode')
    data = pd.concat([data, dummies_m], axis=1)

    #search_song = df.loc[(df['track_name'] == song[0]) & (df['artist_name'] == song[1])]
    #search_song = search_song.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'])
    return data
    #drop song specific data and non-numeric values
    #df = df.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'])

#runs the pca on the data
def run_pca(data, perc):
    #Standardize the data
    scaler = StandardScaler()
    scaler.fit(data)
    df_std = pd.DataFrame(scaler.transform(data), columns=data.columns)
    #song_std = scaler.transform(search_song)

    #Implement PCA
    #Create a PCA instance, you can set the number of components (will show this later)
    pca = PCA(n_components = perc)

    #Find the primary components in the data
    pca.fit(df_std)

    #Transform the data into principal components
    reduced = pca.transform(df_std)
    #song1 = pca.transform(song_std)

    #Will return the standard scalar the pca object and finaly the end dataset
    return scaler,pca,reduced


#Make sure to input PCA formated data
def vec_cos(song,dta,fin_data):
    #final = pd.read_csv('SpotifyFeatures.csv')
    final = fin_data
    similarity_scores = cosine_similarity(dta, song[0].reshape(1,-1))
    final['sim_score'] = similarity_scores
    ret_songs = final[['track_name','artist_name','track_id','sim_score']].sort_values(by=['sim_score'], ascending=False)
    #change this for needed output
    return(ret_songs)

def least_vec_cos(song,dta,fin_data):
    final=fin_data
    #final = pd.read_csv('SpotifyFeatures.csv')
    similarity_scores = cosine_similarity(dta, song.reshape(1,-1))
    final['sim_score'] = similarity_scores
    ret_songs_2 = final[['track_name','artist_name','track_id','sim_score']].sort_values(by=['sim_score'], ascending=True)
    #change this for needed output
    return(ret_songs_2)

def main_1():
    #Intput: weights, song title, artist, spotify id(optional)
    args = sys.argv[1:]
    weights = [1,1,1,1,1,1,1,1,1,1]
    #song = args[0]
    song = ["Free Bird", "Lynyrd Skynyrd"]
    #song = ['Shake It Off', 'Taylor Swift'] #this is just temp

    #df = pd.read_csv('SpotifyFeatures.csv')

    cluster = MongoClient("mongodb+srv://vxs324:Senior2023@seniorproject.nag0hxc.mongodb.net/test")
    db = cluster["spotifyData"]
    collection=db["Song"]
    
    #This expands the dataset to be 51 features making dummy variables for genre

    data = list(collection.find())
    df = pd.DataFrame(data)
    data_og = df.copy()

    df = data_clean(df)
    search_song = df.loc[(df['track_name'] == song[0]) & (df['artist_name'] == song[1])]
    search_song = search_song.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key','_id'])
    #print(df_1)
    #drop song specific data and non-numeric values
    df = df.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key','_id'])
    scaler_1, pca_1, reduced_1 = run_pca(df,0.9)
    song_std = scaler_1.transform(search_song)
    song1 = pca_1.transform(song_std)

    #Change this for output of top songs
    temp = vec_cos(song1,reduced_1,data_og)
    ids = temp.head(10).loc[:, 'track_id'].to_list()
    scores = temp.head(10).loc[:,'sim_score'].to_list()
    print(','.join(ids))
    print(','.join([str(s) for s in scores]))


if __name__ == '__main__':
    main_1()
