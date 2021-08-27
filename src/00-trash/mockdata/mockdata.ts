// import mongoose from 'mongoose'; 

// --------------------------------------------------------
import { data as Form } from './forms.mockdata'; 
import { data as Instruction } from './instructions.mockdata'; 
import { data as ResponseGroup } from './responses.mockdata'; 
import { data as Question } from './questions.mockdata'; 
import { data as Patient } from './patients.mockdata'; 
import { data as Answer } from './answers.mockdata'; 

import { Models } from '../models/models'; 


export const datas = {Form, Instruction, ResponseGroup, Question, Patient, Answer}; 

export const modelDatas = Models.map( model => { 
  return {...model, data:(datas as any)[model.modelName] } 
}) 


