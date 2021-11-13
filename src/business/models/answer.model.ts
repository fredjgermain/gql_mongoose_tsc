import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
import { OneToOne, OneToMany, FindObjectByClassAndId } from '../../typegoose.utils/datarelation.util'; 
import { Patient } from './patient.model'; 
import { ObjectScalar } from "../../typegql.utils/customscalar/object.scalar";



export const descriptorAnswer = { 
  accessor: 'Answer', 
  label: ['Answers', 'Réponses'], 
  description: ['Given answers', 'Réponses données'] 
} 

/** Answer 
 * Each item is answer to series of question, given by 1 patient on a specific day. 
 * 
 * patient
 * question
 * date
 * answervalues ... unanswered question are -1 
 */
@ObjectType({ description: "" }) 
export class Answer { 
  @Field(type => ID) 
  _id: string; 

  @Field(() => Patient) 
  @prop({ label: ["patient", "patient"], required:true, ...OneToOne(Patient) }) 
  patient: Ref<Patient>; 

  @Field(() => Date) 
  @prop({label: ["Date", "Date"], required:true}) 
  date: Date; 

  // @Field(() => Number) 
  // @prop({label: ["Answers values", "Valeurs répondues"], 
  //   type: Number, 
  //   required:true, default:-1}) 
  // answervalues: number; 

  @Field(() => [ObjectScalar]) 
  @prop({label: ["Qid_Value", "Qid_Valeur"]}) 
  answers: {qid:string, value:number}[]; 
} 

// AbbrevResolver -----------------------------------------
@Resolver(type => Answer) 
export class AnswerAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Answer = root._doc; 
    const patient = await FindObjectByClassAndId(Patient, item.patient) as Patient; 
    return `${patient.ramq} : ${item.date}`; 
  } 
} 