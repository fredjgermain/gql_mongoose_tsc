import { prop } from "@typegoose/typegoose"; 
import { Form } from './form.model'; 
import { ResponseType } from './responsetype.model'; 
import { Instruction } from './instruction.model'; 


/** Question 
 * Each item is a question addressed to a patient. 
 * 
 * qid ... a string readable unique id. 
 * form ... reference to the question's form. 
 * instructions ... instructions for that question. 
 * responsetype ... the types possible response to that question. 
 * label ... a multi-lingual question label. 
 * optional ... indicate if that question if optional or not. 
 */ 
export class Question { 
  @prop({label:["qid", "qid"], 
    required:true, unique:true}) 
  qid!: string; 

  @prop({label:["form", "formulaire"], 
    ref:'Form', 
    required:true})
  form!: Form; 

  @prop({label:["instructions", "instructions"], 
    type: [Instruction], ref:'Instruction', 
    required:true}) 
  instruction!: Instruction[]; 

  @prop({label:["response type", "type de réponse"], 
    type: [ResponseType], ref:'ResponseType', 
    required:true}) 
  responsetype!: ResponseType; 

  @prop({label:["label", "libélé"], 
    type: [String], 
    required:true}) 
  label!: string[]; 

  @prop({label:["optional", "optionnel"], default:true}) 
  optional: boolean; 
}
