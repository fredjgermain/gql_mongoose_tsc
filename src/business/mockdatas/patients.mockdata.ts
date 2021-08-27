import mongoose from 'mongoose'; 
// ----------------------------------------------
import { Patient } from '../models/patient.model'; 

// PATIENTS -------------------------------------
export const data:Patient[] = [
  {
    _id: new mongoose.Types.ObjectId() as any as string, 
    firstname: 'Frédéric', 
    lastname: 'Jean-Germain', 
    ramq: 'JEAF11111111', 
    birthday: new Date(1990, 11, 11) 
  }
]