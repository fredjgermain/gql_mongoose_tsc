import { prop } from "@typegoose/typegoose"; 


/** Form
 * Form with a title and description for that form. 
 * 
 * fid 
 * title ... multilingual 
 * description ... multilingual 
 */
export class Form { 
  @prop({label:["fid", "fid"], 
    required:true, unique:true}) 
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