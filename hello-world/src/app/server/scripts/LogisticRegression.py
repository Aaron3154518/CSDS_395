import sys
import pandas as pd
import numpy as np
from random import choice
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import SongRecNew as sr

def logistic_regression(data, pca_var, final_dat):

    reduced_df = final_dat[~final_dat['track_id'].isin(data)]
    final_df = reduced_df.drop(columns=['track_id'],axis=1,inplace=False)

    df_cp = data.drop(columns=['track_id'],axis=1,inplace=False)
    X_train, X_test, y_train, y_test = train_test_split(df_cp.drop('liked_by_user', axis=1), df_cp['liked_by_user'], test_size=0.2, random_state=42)

    # instantiate the model (using the default parameters)
    logreg = LogisticRegression(random_state=16)

    # fit the model with data
    logreg.fit(X_train, y_train)

    reduced_df['Logistic Regression'] = logreg.predict_proba(final_df)[:,1]
    print(sum(reduced_df['Logistic Regression'].tolist()))

    ret_songs_3 = reduced_df[['track_id','Logistic Regression']].sort_values(by=['Logistic Regression'], ascending=False)
    print(ret_songs_3)
    return(ret_songs_3)


def main():

    #test data
#     args = ['0OUKJBWS2IhHmVIxACwZzp', '53XBXgtdqf1gmWMm3rqV27',
#   '27L8sESb3KR79asDUBu8nW', '4UDmDIqJIbrW0hMBQMFOsM',
#   '7ACxUo21jtTHzy7ZEV56vU', '1fDsrQ23eTAVFElUMaf38X',
#   '6FBmHx1FuaSnTnnnaThgbF', '2kR3B09M6KeJnchOkxwszt',
#   '6QDbGdbJ57Mtkflsg42WV5', '54eZmuggBFJbV7k248bTTt',
#   '0UOxp1BpnD8uPQMKU4wKjz', '7Cp69rNBwU0gaFT8zxExlE',
#   '4bHsxqR3GMrXTxEPLuK5ue', '4ECNtOnqzxutZkXP4TE3n3',
#   '1jDJFeK9x3OZboIAHsY9k2', '2grjqo0Frpf2okIBiifQKs',
#   '7x8dCjCr0x6x2lXKujYD34', '5QTxFnGygVM4jFQiBovmRo',
#   '0ST6uPfvaPpJLtQwhE6KfC', '43DeSV93pJPT4lCZaWZ6b1',
#   '3yrSvpt2l1xhsV9Em88Pul', '1xsYj84j7hUDDnTTerGWlH',
#   '1QEEqeFIZktqIpPI4jSVSF', '1UBQ5GK8JaQjm5VbkBZY66',
#   '5IPJsGFKtxKDPCkT8lhEjN', '5WTxbyWTpoqhdxEN2szOnl',
#   '3dCKwOvBK9MTIw2QWM59Le', '1nmZ8yqKkfooOuYvtFctDp',
#   '12yHvSYFXI7PGzNecUvIDu', '5EWPGh7jbTNO2wakv8LjUI',
#   '2oSpQ7QtIKTNFfA08Cy0ku', '2SiXAy7TuUkycRVbbWDEpo',
#   '72ahyckBJfTigJCFCviVN7', '0oerlffJSzhRVvtDfLcp3N',
#   '4aVuWgvD0X63hcOCnZtNFA', '0S3gpZzlT9Hb7CCSV2owX7',
#   '7w6PJe5KBPyvuRYxFkPssC', '4JfuiOWlWCkjP6OKurHjSn',
#   '6gQUbFwwdYXlKdmqRoWKJe', '7N3PAbqfTjSEU1edb2tY8j',
#   '5Z8EDau8uNcP1E8JvmfkZe', '1gzIbdFnGJ226LTl0Cn2SX',
#   '6eN1f9KNmiWEhpE2RhQqB5']
    args = sys.argv[1].split(',')

    liked = args[0].split(',') #UPDATE FOR PROPER IO
    #df = pd.read_csv('user1_PCA.csv')
    #df_cp = df.drop(columns=['track_id'],axis=1,inplace=False)
    df = pd.read_csv('SpotifyFeatures.csv')
    df_og = df.copy()
    df = sr.data_clean(df)
    songs = [choice(liked) for _ in range(5)]
    temp_s = []
    df_1 = df.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'])
    scaler_1, pca_1, reduced_1 = sr.run_pca(df_1,8)
    #find the songs in the data
    for i in songs:
        temp = df.loc[(df['track_id'] == i)]
        temp = temp.drop(columns=['track_id','artist_name', 'track_name', 'time_signature','mode','genre','key'])
        if len(temp)>0:
            song_std = scaler_1.transform(temp)
            song1 = pca_1.transform(song_std)
        #song1['liked_by_user'] = [0]*len(song1['1'])
            temp_s.append(song1[0])
    
    #Gen song dislikes
    dislikes = []
    for i in temp_s: 
        dislikes+=(list(set(sr.least_vec_cos(i,reduced_1, df).head(20).loc[:, 'track_id'].to_list())))

    #Make data to format to be used
    final = pd.read_csv('SpotifyFeatures.csv')
    test = np.concatenate((args, dislikes))
    #filtered_df = final[final['track_id'].isin(test)]
    #filtered_df['liked_by_user'] = filtered_df['track_id'].isin(args).astype(int)
    reduced = pd.DataFrame(reduced_1)
    reduced_2 = reduced.join(final['track_id'], on=final.index)
    filtered_df_1 = reduced_2[final['track_id'].isin(test)]
    filtered_df_1['liked_by_user'] = filtered_df_1['track_id'].isin(args).astype(int)

    print(temp)

    temp = logistic_regression(filtered_df_1,pca_1, reduced_2)
    ids, scores = [], []
    for id, score in zip(temp.head(20).loc[:, 'track_id'], temp.head(20).loc[:, 'Logistic Regression']):
        if not id in ids:
            ids.append(id)
            scores.append(str(score))
    print(','.join(ids))
    print(','.join(scores))
    

if __name__ == '__main__':
    main()

