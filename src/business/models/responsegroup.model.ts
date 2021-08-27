import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
//import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 

export const descriptorResponse = { 
  accessor: 'ResponseGroup', 
  label: ['ResponseGroup', 'ResponseGroup'], 
  description: ['ResponseGroup', 'ResponseGroup'] 
} 
// /** ResponseChoice 
//  * A single possible choice with multilingual label 
//  * 
//  * rid 
//  * label 
//  */
// export class ResponseChoice { 
//   @prop({label:["rid", "rid"], 
//     required:true, unique:true}) 
//   rid: string; 

//   @prop({label:["response choices", "choix de réponse"], 
//     type: [String], 
//     required:true}) 
//   label: string[]; 
// } 

/** ResponseType 
 * Regroup a set of possible responses 
 * 
 * rid 
 * responsechocies 
 */ 
@ObjectType({description:"ResponseGroup"}) 
export class ResponseGroup { 
  @Field(() => ID) 
  _id: string; 

  @Field() 
  @prop({label:["rid", "rid"], 
    required:true, unique:true}) 
  rid: string; 

  @Field(() => [[String]]) 
  @prop({label:["response choices", "choix de réponse"], 
    type: [[String]], required:true}) 
  responsechoices: string[][]; 
}
