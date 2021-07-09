import mongoose from 'mongoose'; 
// ----------------------------------------------
import { Patient } from '../models/patient.model'; 

// PATIENTS -------------------------------------
export const PatientDatas:Patient[] = [
  {
    //_id: new mongoose.Types.ObjectId(), 
    firstname: 'Frédéric', 
    lastname: 'Jean-Germain', 
    ramq: 'JEAF83112314', 
    birthday: new Date('1983/11/83') 
  }
]