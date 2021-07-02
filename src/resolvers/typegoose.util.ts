import { mongoose } from "@typegoose/typegoose"; 


export type MongoModel = mongoose.Model<any, {}, {}>; 

export function GetModelObject(modelName:string) { 
  return mongoose.models[modelName]; 
} 

export function GetModelFields(modelName:string) { 
  return mongoose.models[modelName].schema.paths; 
} 