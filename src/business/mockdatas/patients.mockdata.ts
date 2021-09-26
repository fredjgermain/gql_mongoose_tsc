import mongoose from 'mongoose'; 
import { DateToString } from '../../../lib/utils/date.utils'; 



// ----------------------------------------------- 
import { Patient } from '../models/patient.model'; 



// PATIENTS -------------------------------------
export const data = [
  {
    _id: new mongoose.Types.ObjectId() as any as string, 
    firstname: 'Frédéric', 
    lastname: 'Jean-Germain', 
    ramq: 'JEAF11111111', 
    birthday: new Date(1990, 11, 11) 
  }
]