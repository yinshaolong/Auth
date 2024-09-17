import express from "express";
import { createServer } from "http";
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import bodyParser from 'body-parser';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());//returns middleware that only parses json
app.use(bodyParser.urlencoded({ extended: true }));//


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/api/users', usersController.register)

io.on('connection', () => {
    console.log("connected")
})

mongoose.connect('mongodb://localhost:27017/DefinitelyNotTrello').then(() => {
    console.log("Connected to MongoDB");
    // only connect to web server AFTER we are connected to mongoDB
    httpServer.listen(4001, () => {
        console.log('listening on *:4001');
    });
})
