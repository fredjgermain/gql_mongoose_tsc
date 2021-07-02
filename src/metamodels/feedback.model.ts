import { prop } from "@typegoose/typegoose"; 


/** FeedbackMsg 
 * FeedbackMsg stores multilingual messages 
 * Includes success messages, confirmation messages, error messages 
 * ?FeedbackMsg ought to be searched by name, rather than by Id? 
*/ 
enum FeedbackTypeEnum { 
  Success, 
  Error 
} 

export class FeedbackMsg { 
  // unique name for errmsg 
  @prop({required:true, unique:true}) 
  name: string; 

  /* Enums: Success, Error */ 
  @prop({ enum: FeedbackTypeEnum, type: Number }) 
  type: FeedbackTypeEnum; 

  // Multilingual error messages. 
  @prop({type: [String], required:true}) 
  errmsg: string[]; 
} 
