import 'dotenv/config'; 
import "reflect-metadata"; 
import { connect } from "mongoose"; 



/* MONGOOSE CONNECTION ------------------------------------
 * Sets up a Mongoose connection to MongoDb  
*/ 
export async function MakeMongooseConnect() { 
  const mongodbUrl = process.env.MONGODB_URL as string; 

  // create mongoose connection
  const mongodbConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true } 
  const mongoose = await connect(mongodbUrl, mongodbConnectionOptions); 
  mongoose.connection; 
} 

