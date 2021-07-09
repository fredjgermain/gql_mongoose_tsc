import { getModelForClass } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { Answer } from './answer.model'; 
import { Form } from './form.model'; 
import { Instruction } from './instruction.model'; 
import { Patient } from './patient.model'; 
import { Question } from './question.model'; 
import { ResponseGroup } from './responsegroup.model'; 

import { MetaCollection } from '../metamodels/metacollections.model'; 
import { FeedbackMsg } from '../metamodels/feedback.model'; 


// Register collections 
export async function RegisterModels() { 
  getModelForClass(MetaCollection); 
  getModelForClass(FeedbackMsg); 

  getModelForClass(Answer); 
  getModelForClass(Form); 
  getModelForClass(Instruction); 
  getModelForClass(Patient); 
  getModelForClass(Question); 
  getModelForClass(ResponseGroup); 
} 


