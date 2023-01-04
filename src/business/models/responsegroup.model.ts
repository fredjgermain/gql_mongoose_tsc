import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
import { ModelStack } from "../../prepping/typegoose.stacker"; 
import { CrudResolverStack, ResolverStack } from "../../prepping/typegql.stacker";



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
@ModelStack({description:"Group reponse choices." , label:"Response group"}) 
@CrudResolverStack() 
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



// AbbrevResolver -----------------------------------------
@ResolverStack() 
@Resolver(type => ResponseGroup) 
export class ResponseGroupAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:ResponseGroup = root._doc; 
    return `${item.rid}`; 
  } 
} 
