import sys
import pandas as pd
import numpy as np
from numpy.linalg import norm
from sklearn.metrics.pairwise import cosine_similarity

pd.options.mode.chained_assignment = None

#To do: figure out Input output needs for website and adapt
#Add functionality that handles more recent songs and songs not in DB

def main():
    #Intput: weights, song title, artist, spotify id(optional)
    #args = sys.argv[1:]
    weights = [1,1,1,1,1,1,1,1,1,1]
    args = [weights] + sys.argv[1:]


    df = pd.read_csv('scripts/SpotifyFeatures.csv')
    df.drop(columns=['duration_ms'])

    #Some temp cleaning...
    df.loc[:, 'popularity'] = df.loc[:, 'popularity'].div(100)
    df.loc[:, 'tempo'] = df.loc[:, 'tempo'].div(100)
    df.loc[:, 'loudness'] = df.loc[:, 'loudness'].div(10)
    #df['genre_indicator'] = 0

    #Finds the song being searched for
    if len(args)==2:
        search_song = df.loc[df.loc[:, 'track_id'] == args[1]]
    else:
        search_song = df.loc[(df.loc[:, 'track_name'] == args[1]) & (df.loc[:, 'artist_name'] == args[2])]

    #...   
    search_song.loc[:, 'genre_indicator'] = 1
    search_song.loc[:, 'artist_indicator'] = 1
    df.loc[:, 'genre_indicator'] = 0

    #deals with multiple genre entries for the same song
    temp_arr = []
    for index, row in search_song.iterrows():
        row_df = pd.DataFrame(row).transpose()

        #Make variables to indicate if the songs have similar genres and artists
        df.loc[:, 'genre_indicator'] = np.where(df.loc[:, 'genre']==row_df.loc[:, 'genre'].to_numpy()[0],1,df.loc[:, 'genre_indicator'])
        df.loc[:, 'artist_indicator'] = np.where(df.loc[:, 'artist_name']==row_df.loc[:, 'artist_name'].to_numpy()[0],0,0)
        #...
        temp_arr.append(row_df)

    temp = df.iloc[:,[4,5,6,8,9,12,15,17,18,19]]
    song = temp_arr[0].iloc[:,[4,5,6,8,9,12,15,17,18,19]]#.to_numpy()

    #Run the cosine sim algorithm
    similarity_scores = cosine_similarity(temp, song)
    df.loc[:, 'sim score'] = similarity_scores


    final = df.loc[:, ['track_name','track_id','sim score']].sort_values(by=['sim score'], ascending=False)
    final.drop_duplicates(subset=['track_id'], inplace=True)

    
    #Need to figure out output...
    # with open('output.txt', 'w') as f:
    #     f.write(final.head(10).to_string())

    ids = final.head(10).loc[:, 'track_id'].to_list()
    scores = final.head(10).loc[:, 'sim score'].to_list()
    print(','.join(ids))
    print(','.join([str(s) for s in scores]))
        
    #Make variables to indicate if the songs have similar genres and artists
    #df['genre_indicator'] = np.where(df['genre']==search_song['genre'].to_numpy()[0],1,0)
    #df['artist_indicator'] = np.where(df['artist_name']==search_song['artist_name'].to_numpy()[0],1,0)
    #print(df['artist_indicator'].sum())


   

def cos_sim(a,b):
    return np.dot(a,b)/(norm(a)*norm(b))

if __name__ == '__main__':
    main()

