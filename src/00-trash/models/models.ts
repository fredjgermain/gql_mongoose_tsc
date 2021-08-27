//import { getModelForClass } from "@typegoose/typegoose"; 
// --------------------------------------------------------
import { TypegooseModel } from '../typegoose.utils/typegoosemodel/typegoosemodel.model'; 

import { Answer } from './answer.model'; 
import { Form } from './form.model'; 
import { Instruction } from './instruction.model'; 
import { Patient } from './patient.model'; 
import { Question } from './question.model'; 
import { ResponseGroup } from './responsegroup.model'; 


// Mock Collections -----------------------------
const TypegooseModelDatas = {
  ResponseGroup:{ 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'ResponseGroup', 
    label:['Responses'], 
    description: [''], 
  }, 
  Instruction:{ 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Instruction', 
    label:['Instructions'], 
    description: [''], 
  }, 
  Form:{
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Form', 
    label:['Forms'], 
    description: [''], 
  }, 
  Question:{
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Question', 
    label:['Questions'], 
    description: [''], 
  }, 
  Patient:{
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Patient', 
    label:['Patients'], 
    description: [''] 
  }, 
  Answer:{
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Answer', 
    label:['Answers'], 
    description: [''], 
  }, 
} as {[key:string]:TypegooseModel}; 

export const Models = [Answer, Form, Instruction, Patient, Question, ResponseGroup].map( model => 
  {return {modelName:model.name, model:model, modelItem:TypegooseModelDatas[model.name]}} 
) 

// import { Answer } from './answer.model'; 
// import { Form } from './form.model'; 
// import { Instruction } from './instruction.model'; 
// import { Patient } from './patient.model'; 
// import { Question } from './question.model'; 
// import { ResponseGroup } from './responsegroup.model'; 

// // import { TypegooseModel } from '../typegoose.utils/model/typegoosemodel.class'; 
// // import { FeedbackMsg } from '../typegoose.utils/feedback/feedback.model'; 


// // Register collections 
// export async function RegisterModels() { 
//   // getModelForClass(TypegooseModel); 
//   // getModelForClass(FeedbackMsg); 

//   [Answer, Form, Instruction, Patient, Question, ResponseGroup].forEach( 
//     cl => getModelForClass(cl) 
//   )

//   // getModelForClass(Answer); 
//   // getModelForClass(Form); 
//   // getModelForClass(Instruction); 
//   // getModelForClass(Patient); 
//   // getModelForClass(Question); 
//   // getModelForClass(ResponseGroup); 
// } 

// export function TestRegister(model:any) {
//   getModelForClass(model); 
// }

