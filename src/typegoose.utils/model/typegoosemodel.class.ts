import { prop } from "@typegoose/typegoose"; 

/** TypegooseModel
 * TypegooseModel stores metadata and descriptors for other collections and models 
 * ?TypegooseModel ought to be searched by their accessor, rather than by Id? 
*/
export class TypegooseModel { 
  // unique accessor for collection 
  @prop({required:true, unique:true}) 
  accessor: string; 

  // Multilingual label 
  @prop({type: [String], required:true}) 
  label: string[]; 

  // Multilingual description 
  @prop({type: [String], required:true}) 
  description: string[]; 
} 