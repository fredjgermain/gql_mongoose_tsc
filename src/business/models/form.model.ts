import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 


// --------------------------------------------------------------- 
import { ModelStack } from "../../prepping/typegoose.stacker"; 
import { CrudResolverStack, ResolverStack } from "../../prepping/typegql.stacker";



/** Form
 * Form with a title and description for that form. 
 * 
 * fid 
 * title ... multilingual 
 * description ... multilingual 
 */
@ModelStack({description:"Form" , label:'Form'}) 
@CrudResolverStack() 
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


// AbbrevResolver -----------------------------------------
@ResolverStack() 
@Resolver(type => Form) 
export class FormAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Form = root._doc; 
    return item.fid; 
  } 
} 