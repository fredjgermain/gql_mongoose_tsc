import mongoose from 'mongoose'; 



// -------------------------------------------------------- 
import { DataToPopulate } from "../../prepping/typegoose.stacker"; 
import { Instruction } from '../models/instruction.model'; 



// INSTRUCTION ----------------------------------
export const data:Instruction[] = [ 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: "i_pdqd5_1", 
    label: ['Veuillez choisir a meilleure réponse correspondant a ce que vous avez vécu au cours des 7 derniers jours.'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: "i_pdqd5_2", 
    label: ['Au cours des 7 derniers jours a quelle fréquence avez-vous ...'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_0', 
    label: ['Dans les 30 derniers jours, combien de difficultés avez-vus eues pour:'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d1', 
    label: ['Compréhension et communication'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d2', 
    label: ['Mobilité'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d3', 
    label: ['Soins personnels'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d4', 
    label: ['Vous entendre avec votre entourage'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d5', 
    label: ['Vous entendre avec votre entourage'], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d5optional', 
    label: [`Si vous etes (employé, bénévole, indépendant) ou allez a l'école, complétez les questions D5.5-D5.8, Sinon, allez a D6.1`], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_whodas_d6', 
    label: [`Participation a la société`], 
  }, 
  {
    _id: new mongoose.Types.ObjectId() as any as string, 
    iid: 'i_eded', 
    label: [`Avez-vous des difficultés:`], 
  }
] 
DataToPopulate(Instruction, data); 