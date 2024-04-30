const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ysdrtdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        

        const craftCollection = client.db('craftDB').collection('craft');
        const ArtCraftCollection = client.db('craftDB').collection('ArtcraftS');

        app.get('/ArtcraftS', async(req, res) => {
            const cursor = ArtCraftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/craft', async(req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/myCraft/:email', async( req, res) => {
            console.log(req.params.email);
            const result = await craftCollection.find({email: req.params.email}).toArray();
            res.send(result);
        })

        app.get('/craft/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            const result = await craftCollection.findOne(query);
            res.send(result);
        })


        app.post('/craft', async(req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
        })

        app.put('/craft/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id:new ObjectId(id)};
            const options = { upsert: true};
            const updatedCraft = req.body;
            const craft = {
                $set: {
                    name: updatedCraft.name, scName: updatedCraft.scName, description: updatedCraft.description, price: updatedCraft.price, rating: updatedCraft.rating, customization: updatedCraft.customization, time: updatedCraft.time, status: updatedCraft.status, email: updatedCraft.email, uName: updatedCraft.uName, image: updatedCraft.image
                }
            }
            const result = await craftCollection.updateOne(filter, craft, options);
            res.send(result);
        })

        app.delete('/craft/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            const result = await craftCollection.deleteOne(query);
            res.send(result);
        })


        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
       
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Craft store server is running ')
})

app.listen(port, () => {
    console.log(`craft Server is running on port: ${port}`);
})

