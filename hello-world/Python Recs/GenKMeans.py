#Take a csv and data weights as an input. Output the dataset with K-means classifications
import sys
import pandas as pd
import numpy as np
#from yellowbrick.cluser import KElbowVisualizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import matplotlib as plt

def main():
    #input is an array of weights
    args = sys.argv[1:]

    #temp UPDATE WITH WEIGHTS
    weights = [1,1,1,1,1,1,1,1,1,1]

    #import the data file: Update with recent data... TO DO
    df = pd.read_csv('SpotifyFeatures.csv')

    df.drop(columns=['duration_ms'])

    #NOTEATE WHAT EACH COLUMN IS...
    temp = df.iloc[:,[4,5,6,8,9,12,15,17]].values
    

    kmeans = KMeans(n_clusters=12, random_state=0, n_init="auto")
    df['Cluster'] = kmeans.fit_predict(temp)
    print(df)

    df.to_csv('SpotifyFeaturesKmeans.csv')

    #To do implement Elbow metod


if __name__ == '__main__':
    main()