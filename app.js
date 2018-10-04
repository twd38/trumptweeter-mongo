const server = require('express')
const mongo = require('mongodb')
const keys = require('./config/keys')

const express = server()
const db = mongo.MongoClient

express.set('view engine', 'ejs')
express.use(server.static(__dirname+'/views'))

// db.connect('mongodb://localhost:27017', (err,client) => {
db.connect(keys.mongoURI, (err,client) => {
  const database = client.db('trumptweeter');

  let searchString = [];

  express.get('/', (req,res) => {
    res.render('index.ejs')
  })

  express.get('/search',(req,res) => {
    console.log('searchString: '+req.query.searchString)
    var cursor = database.collection('things').find({"Tweet": {$regex : ".*"+req.query.searchString+".*"}}).toArray( function(err,results){
      console.log(results)
      res.json({status:'Success', message:'found tweet', tweet:results});
    })

    // res.send({status:'Success', message:'Successfully Voted'});
    // searchDB = database.collection('things').findOne({"Tweet": {$regex : ".*"+req.query.searchString+".*"}})
    // searchDB = database.collection('things').find().count()

    // db.things.find({"Twitter_Handle":{$regex : ".*women.*"}})

    // res.send({status:'Success', message:'found tweet', tweet:database.collection('things').find().count()});
    // if(req.query.searchString != "") {
    //     console.log(searchDB)
    //     database.collection('things').find().count(), (err,result) => {
    //     if(err) return process.exit(1);
    //     res.send({status:'Success', message:'found tweet', tweet:'tweeterrrrr' });
    //   }
    // } else {
    //     res.send({status:'Error', message: 'did not find tweet'});
    // }

    // if(!Tweet.includes(req.query.searchString)) {
    //   database.collection('votes').insert({vote:req.query.vote}, (err,result) => {
    //     if(err) return process.exit(1);
    //
    //     ssn.unshift(req.query.ssn) //this appends to ssn array
    //     res.send({status:'Success', message:'Successfully Voted'});
    //   })
    // } else {
    //   res.send({status:'Error', message: 'Already Voted'});
    // }
  })


})

express.listen(3000)
