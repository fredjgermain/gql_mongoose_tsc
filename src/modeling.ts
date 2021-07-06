import { getModelForClass } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { Answer } from './models/answer.model'; 
import { Form } from './models/form.model'; 
import { Instruction } from './models/instruction.model'; 
import { Patient } from './models/patient.model'; 
import { Question } from './models/question.model'; 
import { ResponseChoice, ResponseType } from './models/responsetype.model'; 

import { MetaCollection } from './metamodels/metacollections.model'; 
import { FeedbackMsg } from './metamodels/feedback.model'; 


// Register collections 
export async function RegisterModels() { 
  getModelForClass(MetaCollection); 
  getModelForClass(FeedbackMsg); 

  getModelForClass(Answer); 
  getModelForClass(Form); 
  getModelForClass(Instruction); 
  getModelForClass(Patient); 
  getModelForClass(Question); 
  getModelForClass(ResponseChoice); 
  getModelForClass(ResponseType); 
} 