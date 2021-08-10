import { ObjectId } from 'mongoose'; 
import { prop, mongoose } from "@typegoose/typegoose"; 
//import {  } from '@typegoose/typegoose/lib/types'; 
import { Base } from '@typegoose/typegoose/lib/defaultClasses'; 



const validateValue = [ 
  { 
    name: 'longerthan', 
    min: 10, 
    validator: (v:string) => { 
      return v.length >= 10; 
    }, 
    message: 'value is 10+ characters long!', 
  }, 
  { 
    name: 'shorterthan', 
    max: 20, 
    validator: (v:string) => { 
      return v.length <= 20; 
    }, 
    message: 'value is 20- less characters long!', 
  } 
] 


/** Form
 * Form with a title and description for that form. 
 * 
 * fid 
 * title ... multilingual 
 * description ... multilingual 
 */
export class Form extends Base { 
  @prop({label:["fid", "fid"], 
    required:true, unique:true, abbrev:true  
  }) 
  fid!: string; 

  @prop({label:["title", "titre"], 
    type: [String], 
    required:true}) 
  title!: string[]; 

  @prop({label:["description", "description"], 
    type: [String], 
    required:true}) 
  description!: string[]; 
}