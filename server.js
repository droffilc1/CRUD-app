const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient; 
const app = express();
const connectionString = 'mongodb+srv://crud:TgTJdL71tiuVHUna@cluster0.mess5jo.mongodb.net/?retryWrites=true&w=majority'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    // Middleware
    app.set('view engine', 'ejs');       
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public')); 

    
    // Routes
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(quotes => {
          res.render('index.ejs', { quotes: quotes })
        })
        .catch(/* ... */)
    });

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    });

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body,quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
          return res.json('No quote to deleted')
        }
        res.json('Deleted Darth Vader\'s quote')
        })
        .catch(error => console.error(error))
    })

    // Listen

    app.listen(3000, function () {
      console.log('listening on 3000');
    });
  })
  .catch(error => console.error(error))

