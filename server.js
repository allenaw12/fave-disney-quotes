require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const connectionString=process.env.MONGODB_URL

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

MongoClient.connect(connectionString, {useUnifiedTopology: true })
    .then(client => {
        console.log('connected to db')
        const db = client.db('disney-quotes')
        const quotesCollection = db.collection('quotes')
        app.get('/', (req, res)=>{
                    db.collection('quotes').find().toArray()
                .then(results => {
                    //console.log(results)
                    res.render('index.ejs', {quotes: results})
                    //console.log(results)
                })
                .catch(err => console.error(err))
        })
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(err => console.error(err))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                {title: req.body.title},
                {$set: {
                    title: req.body.title,
                    name: req.body.name,
                    quote: req.body.quote
                }
                },
                {
                    upsert: true
                }
            )
                .then(result => {
                    res.json('success')
                })
                .catch(error => console.error(error))
            
        })
        //app.use()
        //app.listen()
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { quote: req.body.quote},
                //options
            )
            .then(result => {
                if(result.deletedCount === 0){
                    return res.json('No quotes to delete')
                }
                res.json('Deleted Olaf quote')
            })
            .catch(err => console.error(err))
        })
    })
    .catch(error => console.error(error))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// app.post('/quotes', (req, res) => {
//     console.log(req.body)
// })

app.listen(3000, function() {
    console.log('we listening')
})

console.log('We writing a crab app')