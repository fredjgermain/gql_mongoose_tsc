import mongoose from 'mongoose'; 


// -------------------------------------------------------- 
import { DataToPopulate } from "../../prepping/typegoose.stacker"; 
import { Answer } from '../models/answer.model'; 
import { data as patientsData } from './patients.mockdata'; 
import { data as questionsData } from './questions.mockdata'; 

export const data = [
  {
    _id: new mongoose.Types.ObjectId() as any as string, 
    date: new Date(), 
    patient: patientsData[0], 
    answers: [{qid:questionsData[0].qid, value:-1}], 
  } 
] as Answer[]; 
DataToPopulate(Answer, data); 
