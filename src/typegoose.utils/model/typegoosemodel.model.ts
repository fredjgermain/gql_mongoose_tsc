import { prop } from "@typegoose/typegoose"; 

/** TypegooseModel
 * TypegooseModel stores metadata and descriptors for other collections and models 
 * ?TypegooseModel ought to be searched by their accessor, rather than by Id? 
*/
export class TypegooseModel { 
  // unique accessor for collection 
  @prop({required:true, unique:true}) 
  accessor: string; 

  // Multilingual label 
  @prop({type: [String], required:true}) 
  label: string[]; 

  // Multilingual description 
  @prop({type: [String], required:true}) 
  description: string[]; 
} 

export const TypegooseModelDatas = [
  { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'TypegooseModel', 
    label:['TypegooseModel'], 
    description: [''], 
  }, 
  { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'FeedbackMsg', 
    label:['FeedbackMsg'], 
    description: [''], 
  }, 
  { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'MLangLabel', 
    label:['MLangLabel'], 
    description: [''], 
  }, 
]
