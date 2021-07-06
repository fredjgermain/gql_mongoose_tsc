import { mongoose } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { FeedbackMsg } from '../metamodels/feedback.model'; 
import { GetMongoModelObject } from './getmodel.util'; 



export interface ErrProp { 
  name: string; 
  path: string; 
  value: any; 
  [key:string]: any; 
} 

export interface InputError { 
  input: object|string; // input (object) or id (string). 
  errors: ErrProp[]; 
} 


// Get modelName MLang label 
// Get modelName MLang FeedbackMsg 
export async function FetchMLangFeedbackMsg(modelName:string, feedbackName:string) { 
  const FeedbackMsgModel = GetMongoModelObject('FeedbackMsg'); 
  const [found] = (await FeedbackMsgModel.find({name:feedbackName})) as FeedbackMsg[]; 
  
  // pass arguments to string interpolation ?? 
  return found; 
} 


export function ErrorParsing(error:any):ErrProp[] { 
  // Mongo Error duplication 
  if('name' in error && 'keyPattern' in error && 'keyValue' in error && error.name === 'MongoError') { 
    const [path] = Object.keys(error['keyPattern']); 
    const [value] = Object.values(error['keyValue']); 
    return [{name:'Duplicate', path, value}] 
  } 
  // Validation Error 
  else if('name' in error && error.name === 'ValidationError') { 
    return Object.values(error['errors']) 
      .map( (e:any) => e['properties']) as ErrProp[]; 
  } 
  return [error]; 
} 