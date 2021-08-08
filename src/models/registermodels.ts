import { getModelForClass } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { Answer } from './answer.model'; 
import { Form } from './form.model'; 
import { Instruction } from './instruction.model'; 
import { Patient } from './patient.model'; 
import { Question } from './question.model'; 
import { ResponseGroup } from './responsegroup.model'; 

import { MetaCollection } from '../typegoose.utils/model/metacollections.class'; 
import { FeedbackMsg } from '../typegoose.utils/feedback/feedback.utils'; 


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


