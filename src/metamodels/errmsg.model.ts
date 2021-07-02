import { prop, getModelForClass } from "@typegoose/typegoose"; 


/** ErrMsg 
 * ErrMsg stores multilingual error messages 
 * ?ErrMsg ought to be searched by accessor, rather than by Id? 
*/
export class ErrMsg { 
  // unique name for errmsg 
  @prop({required:true, unique:true}) 
  name: string; 

  // Multilingual error messages. 
  @prop({type: [String], 
    required:true}) 
  errmsg: string[]; 
} 
export const ErrMsgModel = getModelForClass(ErrMsg); 
