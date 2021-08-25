// Dependancies
import { ApolloServer } from "apollo-server-express"; 
import express from "express"; 
import "reflect-metadata"; 
import { buildSchema, NonEmptyArray } from "type-graphql"; 
import { connect } from "mongoose";  
import { ObjectId } from "mongodb"; 

import cors from "cors"; 



// Local-import -------------------------------------------
import { mongodbUrl } from './mongodb.connectionurl'; 
// resolvers
import { PreppingWithDummies, dummiesResolvers } from './factoryresolver/dummies.resolver'; 
//import { Resolvers } from './typegql.utils/resolver'; 
import { ObjectIdScalar }  from './typegql.utils/customscalar/objectid.scalar'; 

import { InitMockDatas } from './mockdata/mockinit'; 



const main = async () => {
  const schema = await buildSchema({ 
    resolvers: [...dummiesResolvers] as NonEmptyArray<Function> | NonEmptyArray<string>,  
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }], 
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


  // INIT MOCK DATA ----------------
  PreppingWithDummies(); 
  // init mock data ... 

  app.listen({ port: PORT }, () => 
    console.log(`Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`)) 
}; 
main().catch((error)=>{ 
    console.log(error, 'error'); 
}) 
