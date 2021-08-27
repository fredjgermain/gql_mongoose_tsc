import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 


// --------------------------------------------------------------- 
//import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 



export const descriptorForm = { 
  accessor: 'Form', 
  label: ['Forms', 'Formulaires'], 
  description: ['Forms description', 'Description de formulaire'] 
} 

/** Form
 * Form with a title and description for that form. 
 * 
 * fid 
 * title ... multilingual 
 * description ... multilingual 
 */
@ObjectType({ description: "Form"})
export class Form { 
  @Field(type => ID) 
  _id: string; 

  @Field()
  @prop({label:["fid", "fid"], 
    required:true, unique:true, abbrev:true}) 
  fid: string; 

  @Field(() => [String])
  @prop({label:["title", "titre"], 
    type: [String], 
    required:true}) 
  title: string[]; 

  @Field(() => [String])
  @prop({label:["description", "description"], 
    type: [String], 
    required:true}) 
  description: string[]; 
}