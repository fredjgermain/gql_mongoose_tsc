import mongoose from 'mongoose'; 

// ANSWERS -----------------------------------------
//import { Answer } from '../models/answer.model'; 

import { data as patientsData } from './patients.mockdata'; 
import { data as questionsData } from './questions.mockdata'; 

export const data = [
  {
    _id: new mongoose.Types.ObjectId() as any as string, 
    date: new Date(), 
    patient: patientsData[0], 
    question: questionsData[0], 
    answervalues: 4, 
  }
]; 