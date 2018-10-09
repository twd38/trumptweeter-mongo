const server = require('express')
const mongo = require('mongodb')
const keys = require('./config/keys')

const express = server()
const db = mongo.MongoClient

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
    })
  })
})

const PORT = process.env.PORT || 3000;
express.listen(PORT);
