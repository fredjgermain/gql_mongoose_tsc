import { prop } from "@typegoose/typegoose"; 
import { Base } from '@typegoose/typegoose/lib/defaultClasses'; 


// /** ResponseChoice 
//  * A single possible choice with multilingual label 
//  * 
//  * rid 
//  * label 
//  */
// export class ResponseChoice { 
//   @prop({label:["rid", "rid"], 
//     required:true, unique:true}) 
//   rid: string; 

//   @prop({label:["response choices", "choix de réponse"], 
//     type: [String], 
//     required:true}) 
//   label: string[]; 
// } 

/** ResponseType 
 * Regroup a set of possible responses 
 * 
 * rid 
 * responsechocies 
 */ 
export class ResponseGroup extends Base { 
  @prop({label:["rid", "rid"], 
    required:true, unique:true}) 
  rid: string; 

  @prop({label:["response choices", "choix de réponse"], 
    type: [[String]], ref: "ResponseChoice", 
    required:true}) 
  responsechoices: string[][]; 
}
