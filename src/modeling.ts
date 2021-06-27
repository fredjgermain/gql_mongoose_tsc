import { getModelForClass, getModelWithString } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { ErrMsg } from './metamodels/errmsg.model'; 
import { MetaCollection } from './metamodels/metacollections.model'; 

import { Answer } from './models/answer.model'; 
import { Form } from './models/form.model'; 
import { Instruction } from './models/instruction.model'; 
import { Patient } from './models/patient.model'; 
import { Question } from './models/question.model'; 
import { ResponseChoice, ResponseType } from './models/responsetype.model'; 

// Register collections 
export async function RegisterModels() { 
  getModelForClass(ErrMsg); 
  getModelForClass(MetaCollection); 

  getModelForClass(Answer); 
  getModelForClass(Form); 
  getModelForClass(Instruction); 
  getModelForClass(Patient); 
  getModelForClass(Question); 
  getModelForClass(ResponseChoice); 
  getModelForClass(ResponseType); 
}
