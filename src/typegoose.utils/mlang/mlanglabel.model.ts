import { prop } from "@typegoose/typegoose"; 
import { Base } from '@typegoose/typegoose/lib/defaultClasses'; 


export const MLangLabelDescriptor = { 
    //_id: new mongoose.Types.ObjectId(), 
    accessor:'MLangLabel', 
    label:['MLangLabel'], 
    description: [''], 
  } 
/** MLangLabel 
 * 
 */
export class MLangLabel extends Base { 
  @prop({label: ["Name", "Nom"], 
    required:true, unique:true, abbrev:true}) 
  name: string; 

  @prop({label: ["Labels", "Libélés"], 
    type: [String], 
    required:true}) 
  labels: string[]; 
} 