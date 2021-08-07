import { prop } from "@typegoose/typegoose"; 


/** FeedbackTypeEnum 
 * Success, Warning, Notif, Error 
 */
export enum FeedbackTypeEnum { 
  Success, 
  Warning, 
  Notif, 
  Error 
} 

/** FeedbackMsg 
 * FeedbackMsg stores multilingual messages 
 * Includes success messages, confirmation messages, error messages 
 * ?FeedbackMsg ought to be searched by name, rather than by Id? 
*/ 
export class FeedbackMsg { 
  // unique name for errmsg 
  @prop({required:true, unique:true}) 
  name: string; 

  /* Enums: Success, Error */ 
  @prop({ enum: FeedbackTypeEnum, type: Number }) 
  type: FeedbackTypeEnum; 

  // Multilingual feedback messages, it may include error message. 
  @prop({type: [String], required:true}) 
  msg: string[]; 
} 