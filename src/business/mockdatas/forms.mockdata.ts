import mongoose from 'mongoose'; 

// ----------------------------------------------
import { Form } from '../models/form.model'; 

// FORM -----------------------------------------
export const data:Form[] = [ 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    fid: 'pdqd5', 
    title: ['Dépression PDQ-D-5'], 
    description: ['PDQD5'] 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    fid: 'asrs', 
    title: ['ASRS'], 
    description: ["ASRS"] 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    fid: 'whodas', 
    title: ['WHODAS 2.0'], 
    description: ["WHODAS 2.0"] 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    fid: 'edec', 
    title: ["EDEC Échelle d'autoévaluation cognitive"], 
    description: ["EDEC Échelle d'autoévaluation cognitive"]
  } 
] 
