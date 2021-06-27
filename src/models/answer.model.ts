import { prop } from "@typegoose/typegoose"; 
import { Patient } from './patient.model'; 
import { Question } from './question.model'; 


/** Answer 
 * Each item is answer to series of question, given by 1 patient on a specific day. 
 * 
 * patient
 * question
 * date
 * answervalues ... unanswered question are -1 
 */
export class Answer { 
  @prop({label: ["patient", "patient"], 
    ref:'Patient', 
    required:true}) 
  patient: Patient; 

  @prop({label: ["question", "question"], 
    ref:'Question', 
    required:true}) 
  question: Question; 

  @prop({label: ["date", "date"], 
    required:true}) 
  date: Date; 

  @prop({label: ["Answers values", "Valeurs répondues"], 
    type: [Number], 
    required:true, default:-1}) 
  answervalues: number[]; 
}
