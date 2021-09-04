import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 


import { Form } from './form.model'; 
import { ResponseGroup } from './responsegroup.model'; 
import { Instruction } from './instruction.model'; 



export const descriptorQuestion = { 
  accessor: 'Question', 
  label: ['Question', 'Question'], 
  description: ['Question', 'Question'] 
} 

/** Question 
 * Each item is a question addressed to a patient. 
 * 
 * qid ... a string readable unique id. 
 * form ... reference to the question's form. 
 * instructions ... instructions for that question. 
 * responsetype ... the types possible response to that question. 
 * label ... a multi-lingual question label. 
 * optional ... indicate if that question if optional or not. 
 */ 
@ObjectType({description:"Question"})
export class Question { 
  @Field(type => ID) 
  _id: string; 

  @Field(() => String) 
  @prop({label:["qid", "qid"], 
    required:true, unique:true}) 
  qid!: string; 

  @Field(() => Form) 
  @prop({label:["form", "formulaire"], 
    required:true, ...OneToOne(Form) }) 
  form!: Ref<Form>; 

  @Field(() => [Instruction]) 
  @prop({label:["instructions", "instructions"], 
    required:true, ...OneToMany(Instruction) }) 
  instructions!: Ref<Instruction[]>; 

  @Field(() => ResponseGroup) 
  @prop({label:["response type", "type de réponse"], 
    required:true, ...OneToOne(ResponseGroup)}) 
  responsegroup!: Ref<ResponseGroup>; 

  @Field(() => [String]) 
  @prop({label:["label", "libel"], 
    type: [String], 
    required:true}) 
  label!: string[]; 

  @Field(() => Boolean) 
  @prop({label:["optional", "optionnel"], default:true}) 
  optional: boolean; 
}


// AbbrevResolver -----------------------------------------
@Resolver(type => Question) 
export class QuestionAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Question = root._doc; 
    return `${item.qid}`; 
  } 
} 