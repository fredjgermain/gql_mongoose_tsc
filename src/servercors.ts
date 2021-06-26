import express from 'express'; 
//import {MakeController} from '../controller/controller'; 
//import {MockData} from '../mockdb/mockinit'; 
import * as bodyParser from 'body-parser';
import cors from "cors"; 

const app = express(); 
app.use(cors()); 
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 

// Connect to mongoose Db 
const url = "mongodb+srv://admin:Ks6LwjuT2zewWcT@cluster0.m1ee1.mongodb.net/Cluster0?retryWrites=true&w=majority"; 
const dbName = 'TestDb'; 
const router = MakeController(url, dbName, MockData); 
app.use(router); 


const options: cors.CorsOptions = {
/*allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
],
credentials: true,
methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',*/
origin: "http://localhost:3000", 
//origin: "https://react-mongoose-demo.herokuapp.com", 
//origin: API_URL, 
//preflightContinue: false, 
}; 

app.use(cors(options)); 
app.options('*', cors(options)); 

const PORT : string|number = process.env.PORT || 5000; 

/*app.use("*",(req, res) =>{
    res.send("<h1>Welcome to your simple server! Awesome right</h1>");
});*/

app.listen(PORT,() => console.log(`hosting @${PORT}`)); 

