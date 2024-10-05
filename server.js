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

const bcrypt = require('bcryptjs');
const saltLength = 8;


require('dotenv').config();

const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(url);
client.connect();




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
            let newProfile = {email: req.body.email, username: req.body.username};
            profiles.insertOne(newProfile);
            res.status(200).json({'error': " "});
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
                res.status(200).json({error: 'woohoo!'});
            }
            else {
                res.status(200).json({ error: 'Permission Denied' });
            }
        })

    });

    app.post('/api/test', async (req, res) => {
        if (!req.body.message) {
            res.status(404).json({error: 'Provide message!'});
            return;
        } 
        res.status(200).json({'message': "ok i got it"});
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

