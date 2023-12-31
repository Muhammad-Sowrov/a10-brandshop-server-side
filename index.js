const express = require('express');
const cors = require('cors');
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE

app.use(express.json());
app.use(cors());


// MONGO

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xz3kocr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productsDB").collection('products');


    app.get('/products/:brand_name', async(req, res)=>{
      // const brandName = req.params.brand_name;
      // const query = {brandName: brandName}
      const result = productCollection.find({brand_name:req.params.brand_name})
      const final = await result.toArray()
      res.send(final)
    })

    app.get('/products', async(req, res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    // 
    app.get('/products/id/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(id);
      console.log(query);
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    
    // CREATE 
    app.post('/products', async(req, res)=>{
      const newProducts = req.body;
      console.log(newProducts);
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    })


    // UPDATE
    app.put('/products/id/:id', async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedProduct= req.body;
      const product = {
        $set: {
          image: updatedProduct.image,
          name: updatedProduct.name,
          brand_name:updatedProduct.brand_name,
          type: updatedProduct.type,
          price: updatedProduct.price,
          description: updatedProduct.description,
          rating: updatedProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Blushly server is running')
})

app.listen(port, () => {
    console.log(`Blusly server is running on: ${port}`);
})