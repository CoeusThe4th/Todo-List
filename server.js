const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const { request } = require('http')
const uri = process.env.DB_STRING

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
})


MongoClient.connect(uri)
.then(client => {
    console.log('Connected to Database')
    const db = client.db('todoList')
    const collection = db.collection('todo')
  
// Connect to MongoDB
async function connectToMongoDB() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      // Once connected, start the Express server
      app.listen(process.env.PORT || PORT, () => {     //access to a port to host server either locally or external hosting website
        console.log(`Server running on ${PORT}`);
    })
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
connectToMongoDB()   // Call the function to connect to MongoDB

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

    app.get('/', (req, res) => {            // endpoint leading to mainpage request 
        db.collection('todo').find().toArray()
            .then(data => {
                res.render('index.ejs', { info: data })
            })
            .catch(err => console.log(err));
    });

    app.post('/addItem', (req, res) => {      //endoint leading to add a new todo list item
        const newTodo = {
            itemName: req.body.itemName
        }
        db.collection('todo').insertOne(newTodo)
            .then(result => {
                console.log('New item added fr.')
                res.redirect('/')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/')
            })
    })

    app.delete('/deleteItem', (req, res) => {          //endpoint leading to cross out of an item 
        db.collection('todo').deleteOne({ itemName: req.body.itemName})
            .then(result => {
                console.log('Item completed.')
                res.json('Item removed.')
            })
            .catch(err => { 
                console.log(err);
                res.status(500).json({ message: 'Error erasing item.' });
            })
    }) 

    // Insert todo item into the collection (would have used this if you made an object in this server code  and wanted to insert it)
    // collection.insertMany(Object.entries(todo).map(([key, value]) => ({ _id: key, ...value })))
    // .then(result => {
    //     console.log(`${result.insertedCount} items inserted into the todoList database.`);
    // })
    // .catch(error => {
    //     console.error('Error inserting new item:', error);
    // })
})
