import mongoose from 'mongoose'; 

// --------------------------------------------------------
import { MetaCollection } from '../typegoose.utils/metacollections.class'; 
import { FormDatas } from './forms.mockdata'; 
import { InstructionDatas } from './instructions.mockdata'; 
import { ResponseGroupDatas } from './responses.mockdata'; 
import { QuestionDatas } from './questions.mockdata'; 
import { PatientDatas } from './patients.mockdata'; 
import { AnswerDatas } from './answers.mockdata'; 

// Mock Collections -----------------------------
const MetaCollectionDatas:MetaCollection[] = [ 
  { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'ResponseGroup', 
    label:['Responses'], 
    description: [''], 
  }, 
  { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Instruction', 
    label:['Instructions'], 
    description: [''], 
  }, 
  {
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Form', 
    label:['Forms'], 
    description: [''], 
  }, 
  {
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Question', 
    label:['Questions'], 
    description: [''], 
  }, 
  {
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Patient', 
    label:['Patients'], 
    description: [''] 
  }, 
  {
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'Answer', 
    label:['Answers'], 
    description: [''], 
  }, 
]; 
export const mockDatas = {MetaCollectionDatas, FormDatas, InstructionDatas, ResponseGroupDatas, QuestionDatas, PatientDatas, AnswerDatas}; 
