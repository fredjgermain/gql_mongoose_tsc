import { prop } from "@typegoose/typegoose"; 


/** ResponseChoice 
 * A single possible choice with multilingual label 
 * 
 * rid 
 * label 
 */
export class ResponseChoice { 
  @prop({label:["rid", "rid"], 
    required:true, unique:true}) 
  rid: string; 

  @prop({label:["response choices", "choix de réponse"], 
    type: [String], 
    required:true}) 
  label: string[]; 
} 

/** ResponseType 
 * Regroup a set of possible responses 
 * 
 * rid 
 * responsechocies 
 */ 
export class ResponseType { 
  @prop({label:["rid", "rid"], 
    required:true, unique:true}) 
  rid: string; 

  @prop({label:["response choices", "choix de réponse"], 
    type: [ResponseChoice], ref: "ResponseChoice", 
    required:true}) 
  responsechoices: ResponseChoice[]; 
}
