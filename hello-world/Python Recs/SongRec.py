import sys
import pandas as pd
import numpy as np
from numpy.linalg import norm
from sklearn.metrics.pairwise import cosine_similarity

#To do: figure out Input output needs for website and adapt
#Add functionality that handles more recent songs and songs not in DB

def main():
    #Intput: weights, song title, artist, spotify id(optional)
    #args = sys.argv[1:]
    weights = [1,1,1,1,1,1,1,1,1,1]
    args = [weights,"Never Gonna Give You Up", "Rick Astley"]

    df = pd.read_csv('SpotifyFeatures.csv')
    df.drop(columns=['duration_ms'])

    #Some temp cleaning...
    df['popularity'] = df['popularity'].div(100)
    df['tempo'] = df['tempo'].div(100)
    df['loudness'] = df['loudness'].div(10)
    #df['genre_indicator'] = 0

    #Finds the song being searched for
    search_song = df.loc[(df['track_name'] == args[1]) & (df['artist_name'] == args[2])]
    if len(args)>3:
        search_song = df.loc[df['track_id'] == args[3]]

    #...   
    search_song['genre_indicator']=1
    search_song['artist_indicator']=1
    df['genre_indicator'] = 0

    #deals with multiple genre entries for the same song
    temp_arr = []
    for index, row in search_song.iterrows():
        row_df = pd.DataFrame(row).transpose()

        #Make variables to indicate if the songs have similar genres and artists
        df['genre_indicator'] = np.where(df['genre']==row_df['genre'].to_numpy()[0],1,df['genre_indicator'])
        df['artist_indicator'] = np.where(df['artist_name']==row_df['artist_name'].to_numpy()[0],1,0)
        #...
        temp_arr.append(row_df)

    temp = df.iloc[:,[4,5,6,8,9,12,15,17,18,19]]
    song = temp_arr[0].iloc[:,[4,5,6,8,9,12,15,17,18,19]]#.to_numpy()

    #Run the cosine sim algorithm
    similarity_scores = cosine_similarity(temp, song)
    df['sim score'] = similarity_scores


    final = df[['track_name','track_id','sim score']].sort_values(by=['sim score'], ascending=False)
    final.drop_duplicates(subset=['track_id'], inplace=True)

    
    #Need to figure out output...
    with open('output.txt', 'w') as f:
        f.write(final.head(10).to_string())

    
        
    #Make variables to indicate if the songs have similar genres and artists
    #df['genre_indicator'] = np.where(df['genre']==search_song['genre'].to_numpy()[0],1,0)
    #df['artist_indicator'] = np.where(df['artist_name']==search_song['artist_name'].to_numpy()[0],1,0)
    #print(df['artist_indicator'].sum())


   

def cos_sim(a,b):
    return np.dot(a,b)/(norm(a)*norm(b))

if __name__ == '__main__':
    main()

