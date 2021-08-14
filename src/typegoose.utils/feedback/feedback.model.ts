import { prop } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { MLangLabel } from '../mlang/mlanglabel.model'; 

/** FeedbackTypeEnum 
 * Success, Warning, Notif, Error 
 */
export enum FeedbackTypeEnum { 
  Success, 
  Warning, 
  Notif, 
  Error 
} 

/** FeedbackMsg MODEL -------------------------------------------
 * FeedbackMsg stores multilingual messages 
 * Includes success messages, confirmation messages, error messages 
 * ?FeedbackMsg ought to be searched by name, rather than by Id? 
*/ 
export class FeedbackMsg extends MLangLabel { 
  /* Enums: Success, Error */ 
  @prop({ enum: FeedbackTypeEnum, type: Number }) 
  type: FeedbackTypeEnum; 
} 
