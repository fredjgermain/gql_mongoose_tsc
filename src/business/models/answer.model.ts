import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 
import { Patient } from './patient.model'; 
import { Question } from './question.model'; 



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
  @prop({label: ["patient", "patient"], 
    required:true, ...OneToOne(Patient) 
  }) 
  patient: Ref<Patient>; 

  @prop({label: ["Question", "Question"], 
    required:true, ...OneToOne(Question), 
  }) 
  question: Ref<Question>; 

  @prop({label: ["Date", "Date"], 
    required:true}) 
  date: Date; 

  @prop({label: ["Answers values", "Valeurs répondues"], 
    type: [Number], 
    required:true, default:-1}) 
  answervalues: number[]; 
}
