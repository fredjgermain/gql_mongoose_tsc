/// <reference path="./types.d.ts" />
/* reference: 
    https://hackandslash.blog/apollo-server-typescript/ 
    https://blog.logrocket.com/integrating-typescript-graphql/ 
*/ 


/* 
­­Seperate	
	Mongoose connection section. 
	ApolloServer section (includes CORS). 

Server main 
	await mongoose connection section 

*/ 



// Dependancies
import 'dotenv/config';
import { ApolloServer } from "apollo-server-express"; 
import express from "express"; 
import "reflect-metadata"; 
import { buildSchema, NonEmptyArray } from "type-graphql"; 
import { connect } from "mongoose";  

import cors from "cors"; 



// ------------------------------------------------------
// Preppings 
import { BusinessPrepping, resolvers } from './business/business.prepping'; 



const main = async () => {
  const schema = await buildSchema({ 
    resolvers: [...resolvers] as NonEmptyArray<Function> | NonEmptyArray<string>,  
    //scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }], 
    emitSchemaFile: true, 
    validate: false, 
  }); 

  await MongooseConnect(); 

  RunApolloserver(schema, ExpressCORS()); 
}; 
main().catch((error)=>{ 
    console.log(error, 'error'); 
}) 




// 
async function MongooseConnect() { 
  const mongodbUrl = process.env.MONGODB_URL as string; 

  // create mongoose connection
  const mongodbConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true } 
  const mongoose = await connect(mongodbUrl, mongodbConnectionOptions); 
  mongoose.connection; 
} 



// EXPRESS ------------------------------------------------ 
function ExpressCORS() { 
  const app = express(); 

	// Express CORS -------------------
	app.use(cors()); 
	/*app.use(cors({ 
		//origin: 'http://localhost:3000' 
		//origin: "https://react-mongoose-demo.herokuapp.com", 
		//origin: "https://fjg-demo-typegql-backend.com", 
	})); */

  return app; 
} 


// APOLLO SERVER ---------------------------------------------
function RunApolloserver(schema:any, app: any) { 
	const PORT = process.env.PORT || 8000;  

	const server = new ApolloServer({
		schema, 
		introspection:true, 
	}); 
	server.applyMiddleware({ app }); 

	// INIT MOCK DATA ----------------
	//BusinessPrepping(); 
	// init mock data ... 
  
	app.listen(PORT, () => 
	console.log(`Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`)) 
  
}