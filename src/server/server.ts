/// <reference path="../types.d.ts" />
/* reference: 
    https://hackandslash.blog/apollo-server-typescript/ 
    https://blog.logrocket.com/integrating-typescript-graphql/ 
*/ 

// ------------------------------------------------------
import { RunApolloserver } from "./apolloserver"; 
import { MakeMongooseConnect } from './mongooseconnection'; 

// Preppings 
import { Prepping } from "../business/business.prepping";  
 
// RunServer function 
const RunServer = async () => { 
  await MakeMongooseConnect(); 
	//const PORT = process.env.PORT || 8000; 
  
  const resolvers = Prepping(); 
  await RunApolloserver(resolvers); 

  
	//BusinessPrepping(); 
}; 
RunServer().catch((error)=>{ 
    console.log(error, 'error'); 
}) 

