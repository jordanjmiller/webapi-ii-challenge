console.log('its alive');

const express = require('express');

const server = express();

server.use(express.json()); //need for put and post so server can read json

const db = require('./data/db.js');


const postRouter = require('./routers/postRouter.js');

server.use('/api/posts/', postRouter);




server.get('/', (req, res) => { 
    res.send('Hello world!');
 });






const port = 8000;
server.listen(port, () => console.log(`Server running on port ${port}`));
