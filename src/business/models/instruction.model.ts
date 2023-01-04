import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 


// --------------------------------------------------------------- 
import { ModelStack } from "../../prepping/typegoose.stacker"; 
import { CrudResolverStack, ResolverStack } from "../../prepping/typegql.stacker";



/** Instruction
 * Instruction assignable to a question, giving a bit of instruction about a question of series of questions. 
 * 
 * iid 
 * label ... multilingual 
 */
@ModelStack({description:"Form's instruction." , label:'Instruction'}) 
@CrudResolverStack() 
@ObjectType({description:"instruction"})
export class Instruction  {
  @Field(type => ID) 
  _id: string; 

  @Field() 
  @prop({label:["iid", "iid"], 
    required:true, unique:true}) 
  iid: string; 

  @Field(() => [String]) 
  @prop({label:["label", "libélé"], 
    type: [String], 
    required:true}) 
  label: string[]; 
}


// AbbrevResolver -----------------------------------------
@ResolverStack() 
@Resolver(type => Instruction) 
export class InstructionAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Instruction = root._doc; 
    return item.iid; 
  } 
} 