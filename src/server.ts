// Dependancies
import { ApolloServer } from "apollo-server-express"; 
import express from "express"; 
import "reflect-metadata"; 
import { buildSchema } from "type-graphql"; 
import { connect } from "mongoose"; 
import { MakeController } from './controllertest/testcontroler'; 

import cors from "cors";


// Local-import 
import { mongodbUrl } from './mongodb.connectionurl'; 
// resolvers
import { Resolvers } from './resolvers/resolvers'; 

const main = async () => {
  const schema = await buildSchema({ 
    resolvers: Resolvers, 
    emitSchemaFile: true, 
    validate: false, 
  });

// create mongoose connection
const mongodbConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true } 
const mongoose = await connect(mongodbUrl, mongodbConnectionOptions); 
await mongoose.connection; 

const PORT = process.env.PORT || 8000; 
const app = express(); 


// Express CORS -------------------
app.use(cors()); 
app.use(cors({ 
  origin: 'http://localhost:3000' 
})); 

// Express CORS -------------------
const server = new ApolloServer({schema}); 
server.applyMiddleware({ app }); 

app.listen({ port: PORT }, () => 
  console.log(`Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`)) 
}; 
main().catch((error)=>{ 
    console.log(error, 'error'); 
}) 