const downloadCsv = require('download-csv')
const server = require('express')
const mongo = require('mongodb')
const keys = require('./config/keys')
const json2csv = require('json2csv').parse;
const fs = require('fs')

const express = server()
const db = mongo.MongoClient

var searchResults = []

express.set('view engine', 'ejs')
express.use(server.static(__dirname+'/views'))

db.connect(keys.mongoURI, (err,client) => {
  const database = client.db('trumptweeter');

  let searchString = [];

  express.get('/', (req,res) => {
    res.render('index.ejs')
  })

  express.get('/search',(req,res) => {
    console.log('searchString: '+req.query.searchString)
    sortBy= { "none" :1 }

      if(req.query.sortBy == "none") {
        sortBy= { "none" :1 }
      }
      if(req.query.sortBy == "random") {
        sortBy= { "none" :1 }
      }
      if(req.query.sortBy == "Name") {
        sortBy = { "Name" :1 }
      }
      if(req.query.sortBy == "Date") {
        sortBy = { "Date" :1 }
      }
      if(req.query.sortBy == "Agency") {
        sortBy = { "Agency" :1 }
      }

    var cursor = database.collection('things').find({"Tweet": {$regex : ".*"+req.query.searchString+".*"}}).sort( sortBy ).toArray( function(err,results){
      console.log(sortBy)
      res.json({status:'Success', message:'found tweet', tweet:results});
      searchResults = results
      // searchString = searchString.push(res.query.searchString)
    })
  })

  express.get('/export', (req,res) => {
    console.log("Export to CSV");
    var json = searchResults;
    var jsonLength  = searchResults.length;
    var columns= ['_id','','Agency','Date','Job','Name','Tweet','Twitter_Handle','tweet_URL'];
    const opts = { columns };
    const csv = json2csv(json, opts);

    res.json({csv:csv});
  })



})

const PORT = process.env.PORT || 3000;
express.listen(PORT);
