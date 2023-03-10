const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://vxs324:Senior2023@seniorproject.nag0hxc.mongodb.net/test';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("senior_project");
    // Your database operations go here
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();

console.log("Success");