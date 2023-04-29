/*import { MongoClient, Db } from 'mongodb';

async function main() {
  const uri = 'mongodb+srv://vxs324:Senior2023@seniorproject.nag0hxc.mongodb.net/test';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database: Db = client.db("spotifyData");;
    const collections = await database.listCollections().toArray();

    console.log('Collections in the database:');
    for (const collection of collections) {
      console.log(collection.name);
    }

    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error(err);
  }
}
*/
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // read environment variables from .env file

const accessToken = process.env.SPOTIFY_ACCESS_TOKEN; // replace with your access token
const trackId = '2VxeLyX666F8uXCJ0dZF8B'; // replace with your desired track ID

interface Track {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
  };
}

async function getTrack(): Promise<void> {
  const url = `https://api.spotify.com/v1/tracks/${trackId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    const track: Track = {
      id: data.id,
      name: data.name,
      artists: data.artists.map((artist: any) => ({
        name: artist.name
      })),
      album: {
        name: data.album.name
      }
    };
    console.log('Track:', track);
  } else {
    console.error('Failed to get track:', response.statusText);
  }
}

getTrack();


