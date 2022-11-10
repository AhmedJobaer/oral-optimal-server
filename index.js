const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;



// middle wares
app.use(cors());
app.use(express.json());
//ITaLFQbTTgf4i1a9
const uri = "mongodb+srv://DB_USER:DB_PASSWORD@cluster0.r2o8evu.mongodb.net/?retryWrites=true&w=majority";

//const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('oralOptimal').collection('services');
        const reviewCollection = client.db('oralOptimal').collection('serviceReview');


        app.get('/servicesHome', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/serviceDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //add service

        app.post("/addServices", async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            console.log(result);
            res.send(result);
        })


        app.post("/addReview", async (req, res) => {
            const newService = req.body;
            const result = await reviewCollection.insertOne(newService);
            console.log(result);
            res.send(result);
        })




        app.get('/serviceReview', async (req, res) => {
            let query = {};
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.get('/myReview', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.delete('/myReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })






        //app.get('')

        /*  const user = {
             name: 'test',
             email: 'test@gmail.com',
             title: 'Asif Ahmed'
         }
         const result = await serviceCollection.insertOne(user);
         console.log(result); */
    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Oral Optimal server is running!')
})

app.listen(port, () => {
    console.log(`Oral Optimal server running on ${port}`)
})