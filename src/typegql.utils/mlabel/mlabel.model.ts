import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop } from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 



export const MLabelDescriptor = { 
  //_id: new mongoose.Types.ObjectId(), 
  accessor:'MLabel', 
  label:['MLabel'], 
  description: [''], 
} 



// MLabel ================================================= 
@ObjectType({ description: "Multi lingual label" }) 
export class MLabel { 
  @Field(type => ID) 
  _id: string; 
  // @Field(() => ID) 
  // id: string; 

  @Field(type => String) 
  @prop({label: ["Name", "Nom"], 
  required:true, unique:true, abbrev:true}) 
  name: string; 

  @Field(type => [String]) 
  @prop({type:[String], required:true }) 
  label: string[]; 
}
