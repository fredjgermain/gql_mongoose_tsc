import { FeedbackTypeEnum } from './feedback.utils'; 


export const FEEDBACK_MSG_MOCK = { 
  // Errors ...............................................
  ERROR_MODEL_NOT_FOUND: { 
    name: 'ERROR_MODEL_NOT_FOUND', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Model not found", "Model introuvé"], 
  }, 
  ERROR_ITEM_NOT_FOUND: { 
    name: 'ERROR_ITEM_NOT_FOUND', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Item not found", "Item introuvé"], 
  }, 
  ERROR_DUPLICATE: { 
    name: 'ERROR_DUPLICATE', 
    type: FeedbackTypeEnum.Error, 
    msg: ["This field must have a unique value", "Ce champ doit avoir une valeur unique"], 
  }, 
  ERROR_REQUIRED: { 
    name: 'ERROR_REQUIRED', 
    type: FeedbackTypeEnum.Error, 
    msg: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    name: 'ERROR_REGEX', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    name: 'ERROR_CREATE', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    name: 'ERROR_UPDATE', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    name: 'ERROR_DELETE', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_MODEL_FOUND: { 
    name: 'ERROR_MODEL_FOUND', 
    type: FeedbackTypeEnum.Error, 
    msg: ["Model found", "Model trouvé"], 
  }, 
  SUCCESS_ITEM_FOUND: { 
    name: 'SUCCESS_ITEM_FOUND', 
    type: FeedbackTypeEnum.Success, 
    msg: ["Item found", "Item trouvé"], 
  }, 
  SUCCESS_UPDATE: { 
    name: 'SUCCESS_UPDATE', 
    type: FeedbackTypeEnum.Success, 
    msg: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    name: 'SUCCESS_DELETE', 
    type: FeedbackTypeEnum.Success, 
    msg: ["Delete successful", "Suppression réussie"], 
  } 
}


