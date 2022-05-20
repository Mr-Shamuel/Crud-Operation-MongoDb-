const express = require('express');

const bodyParser = require('body-parser');

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://CrudUser:cP3rBhvVpFKRlePt@cluster0.9v7jf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const Crudcollection = client.db("CRUD").collection("crudCollections");
    //    Add user
    app.post('/adduser', (req, res) => {
        const user = req.body;
        console.log(user);

        Crudcollection.insertOne(user)
            .then(result => {
                console.log("data added successfully");
               res.redirect('/');
            })
    })
     //delete user

     app.delete('/delete/:id',(req,res)=>{
        Crudcollection.deleteOne({_id: ObjectId(req.params.id)})
       .then(result=>{
           res.send(result.deletedCount>0);
           

       })
    })

    //load single products

    app.get('/userinfo/:id', (req, res) => {
        Crudcollection.find({_id:ObjectId(req.params.id)})
        .toArray((err,documents )=> {
            res.send(documents[0]);
        })
    })

    //final update 
    app.patch('/update/:id',(req, res)=>{
        Crudcollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set:{name:req.body.name, age:req.body.age}
        })
  
        .then(result=>{
            res.send(result.modifiedCount > 0)

        })
    })

    

    //read user data
    app.get('/userDetails', (req, res) => {

        Crudcollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })





})







app.listen(5000);

