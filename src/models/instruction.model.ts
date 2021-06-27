import { prop } from "@typegoose/typegoose"; 


/** Instruction
 * Instruction assignable to a question, giving a bit of instruction about a question of series of questions. 
 * 
 * iid 
 * label ... multilingual 
 */
export class Instruction {
  @prop({label:["iid", "iid"], 
    required:true, unique:true}) 
  iid: string; 

  @prop({label:["label", "libélé"], 
    type: [String], 
    required:true}) 
  label: string[]; 
}