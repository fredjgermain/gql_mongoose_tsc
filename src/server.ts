// /// <reference path="./types.d.ts" />


// // Dependancies
// import 'dotenv/config';
// import { ApolloServer } from "apollo-server-express"; 
// import express from "express"; 
// import "reflect-metadata"; 
// import { buildSchema, NonEmptyArray } from "type-graphql"; 
// import { connect } from "mongoose";  

// import cors from "cors"; 



// // ------------------------------------------------------
// // Preppings 
// import { BusinessPrepping, resolvers } from './business/business.prepping'; 



// const main = async () => {
//   const schema = await buildSchema({ 
//     resolvers: [...resolvers] as NonEmptyArray<Function> | NonEmptyArray<string>,  
//     //scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }], 
//     emitSchemaFile: true, 
//     validate: false, 
//   });

//   const mongodbUrl = process.env.MONGODB_URL as string; 

//   //console.log( "Connexion:", mongodbUrl ); 

//   // create mongoose connection
//   const mongodbConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true } 
//   const mongoose = await connect(mongodbUrl, mongodbConnectionOptions); 
//   await mongoose.connection; 

//   const PORT = process.env.PORT || 8000; 
//   const app = express(); 


//   // Express CORS -------------------
//   app.use(cors()); 
//   /*app.use(cors({ 
//     //origin: 'http://localhost:3000' 
//     //origin: "https://react-mongoose-demo.herokuapp.com", 
//     //origin: "https://fjg-demo-typegql-backend.com", 
//   })); */

//   const server = new ApolloServer({
//     schema, 
//     introspection:true, 
//   }); 
//   server.applyMiddleware({ app }); 


//   // INIT MOCK DATA ----------------
//   BusinessPrepping(); 
//   // init mock data ... 

//   app.listen(PORT, () => 
//     console.log(`Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`)) 
  
//   // app.listen({ port: PORT }, () => 
//   //   console.log(`Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`)) 
// }; 
// main().catch((error)=>{ 
//     console.log(error, 'error'); 
// }) 
