const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const next = require('next');
const socketIo = require('socket.io');
const http = require('http');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const { sign } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Worker } = require('worker_threads');
const crypto = require('crypto');
const saltLength = 8;
const jwt = require("jsonwebtoken");


require('dotenv').config();

const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(url);
client.connect();

const worker = new Worker('./Recommender.js');


const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));


const server = http.createServer(app);
const io = socketIo(server);

async function grabData() {
    const db = client.db("hackathon");
    const products = db.collection("products");
    const products_data = await products.find({}).toArray();
    //console.log(products_data);
    worker.postMessage({ type: 'start' , task: {data: products_data}});
}
grabData();

nextApp.prepare().then(() => {
    app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

    app.post('/api/signup', async (req, res) => {
        if (!req.body.username) {
            res.status(200).json({ error: 'No username provided' });
            return;
        }
        if (!req.body.email) {
            res.status(200).json({ error: 'No email provided' });
            return;
        }
        if (!req.body.password) {
            res.status(200).json({ error: 'No password provided' });
            return;
        }
        // todo validate
        const db = client.db('hackathon');
        const users = db.collection('users');
        const profiles = db.collection('profiles');
        const duplicateUser = await profiles.findOne({email: req.body.email});
        if (duplicateUser != null) {
            res.status(200).json({ error: 'Duplicate User!' });
            return;
        }
        bcrypt.hash(req.body.password, saltLength, function (err, hash) {
            if (err) {
                res.status(200).json({ error: 'Unable to signup new user' });
                return;
            }
            let newUser = req.body;
            newUser.password = hash;
            users.insertOne(newUser);
            let newProfile = {email: req.body.email, username: req.body.username, createdProfile: false};
            profiles.insertOne(newProfile);
            res.status(200).json({'error': ""});
        });

    });

    app.post('/api/login', async (req,res) =>  {
        if (!req.body.email) {
            res.status(200).json({ error: 'No email provided' });
            return;
        }
        if (!req.body.password) {
            res.status(200).json({ error: 'No password provided' });
            return;
        }
        const db = client.db('hackathon');
        const users = db.collection('users');

        let user = await users.findOne({ email: req.body.email });
        if (!user) {
            res.status(200).json({ error: 'No user found!' });
            return;
        }
        bcrypt.compare(req.body.password, user.password, function (err, bRes) {
            if (bRes) {
                refreshToken = createRefreshToken(user.email);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7, 
                });
    
                let ret = { accessToken: createAccessToken(user.email), createProfile: user.createdProfile };
                res.status(200).json(ret);
            }
            else {
                res.status(200).json({ error: 'Permission Denied' });
            }
        })

    });

    app.post('/api/setProfile', async(req, res) => {
        const tokenResult = verifyAndDecodeToken(req);
        if (tokenResult.hasOwnProperty('error')) {
            res.status(401).json({results: "", error:tokenResult.error});
            return;
        }
        email = tokenResult.email;
        const profiles = db.collection('profiles');
        profiles.updateOne({email: email},
            { 
                $set: {"createdProfile": true},
            }
        );
        res.status(200).json({"error": ""});

    })

    app.post('/api/test', async (req, res) => {
        if (!req.body.message) {
            res.status(404).json({error: 'Provide message!'});
            return;
        } 
        res.status(200).json({'message': "ok i got it"});
    });

    app.post('/api/query', async (req,res) =>  {
        const url = process.env.AI_URL;
        const tokenResult = verifyAndDecodeToken(req);
        console.log(tokenResult);
        if (tokenResult.hasOwnProperty('error')) {
            res.status(401).json({results: "", error:tokenResult.error});
            return;
        } 
        
        const model = "@cf/meta/llama-3-8b-instruct";
        let result = await run(model, req.body);

        worker.postMessage({ type: 'query', task: {rec:result} });
        worker.once('message', (msg) => {
            if (msg.type === 'recommendResult') {
                ret = msg.results;
                res.status(200).json({results: ret, error:""});
                
            }
        });
        //res.status(200).json({message: result});


    });

// asdf

    app.all('*', (req, res) => {
        return handle(req, res);
    });
    
    io.on('connection', (socket) => {
        console.log('New client connected');
    
        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
    });


    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server running on port ${port}`);
    });

});


async function run(model, input) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/93b38e0183d1f13355594d817e26ee80/ai/run/${model}`,
      {
        headers: { Authorization: "Bearer "+process.env.API_TOKEN},
        method: "POST",
        body: JSON.stringify(input),
      }
    );
    const result = await response.json();
    console.log(result);
    return result;
  }
  
  
  
  const createAccessToken = (email) => {
      return sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '15m'
      });
  }
  
  const createRefreshToken = (email) => {
      return sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '7d'
      });
  };
  
  function verifyAndDecodeToken(req) {
      if(!req.headers.authorization) {
          return {"error":"No req auth headers","result":false};
              
      }
      const token = req.headers.authorization;
      if (!token) {
          return {"error":"no token in req header auth","result":false};
      }
      try {
          const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          return decodedToken;
          
      } catch (error) {
          return {"error":error,"result":false};
      }
  
  }
  

