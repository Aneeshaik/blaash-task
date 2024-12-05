require('dotenv').config()
const mongoose = require('mongoose');
const mongodb = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URL

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const connectDB = async() => {
    console.log("connectDB called..."); 
  try {
    await mongoose.connect(uri);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(error) {
    console.log("Error connecting to MongoDB", error);
  }
}

module.exports = connectDB