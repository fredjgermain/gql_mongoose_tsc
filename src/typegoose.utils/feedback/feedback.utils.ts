import { prop } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { GetMongoModelObject } from '../getmodel.util'; 


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


/** FetchFeedbackMsg --------------------------------------
 * Fetch feedback msg from mongo DB 
 * @param feedbackName 
 * @returns 
 */
 export async function FetchFeedbackMsg(feedbackName:string) { 
  const model = GetMongoModelObject('FeedbackMsg'); 
  try{ 
    const [feedbackMsg] = await model.find({name:feedbackName}); 
    return feedbackMsg as FeedbackMsg; 
  }catch(err) { 
    return; // FeedbackMsg not found. 
  } 
}


export const FEEDBACK_MSG = { 
  // Errors ...............................................
  ERROR_ITEMNOTFOUND: { 
    name: 'ERROR_ITEMNOTFOUND', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["Item not found", "Item est introuvable"], 
  }, 
  ERROR_DUPLICATE: { 
    name: 'ERROR_DUPLICATE', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["This field must have a unique value", "Ce champ doit avoir une valeur unique"], 
  }, 
  ERROR_REQUIRED: { 
    name: 'ERROR_REQUIRED', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    name: 'ERROR_REGEX', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    name: 'ERROR_CREATE', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    name: 'ERROR_UPDATE', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    name: 'ERROR_DELETE', 
    type: FeedbackTypeEnum.Error, 
    // msg: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_ITEMFOUND: { 
    name: 'SUCCESS_ITEMFOUND', 
    type: FeedbackTypeEnum.Success, 
    // msg: ["Item found", "Item introuvé"], 
  }, 
  // Crud success 
  SUCCESS_CREATE: { 
    name: 'SUCCESS_CREATE', 
    type: FeedbackTypeEnum.Success, 
    // msg: ["Creation successful", "Création réussie"], 
  }, 
  SUCCESS_UPDATE: { 
    name: 'SUCCESS_UPDATE', 
    type: FeedbackTypeEnum.Success, 
    // msg: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    name: 'SUCCESS_DELETE', 
    type: FeedbackTypeEnum.Success, 
    // msg: ["Delete successful", "Suppression réussie"], 
  } 
}
