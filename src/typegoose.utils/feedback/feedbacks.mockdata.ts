import { FeedbackTypeEnum } from './feedback.model'; 


export const FEEDBACK_MSG_MOCK = { 
  // Errors ...............................................
  ERROR_MODEL_NOT_FOUND: { 
    name: 'ERROR_MODEL_NOT_FOUND', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Model not found", "Model introuvé"], 
  }, 
  ERROR_ITEM_NOT_FOUND: { 
    name: 'ERROR_ITEM_NOT_FOUND', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Item not found", "Item introuvé"], 
  }, 
  ERROR_DUPLICATE: { 
    name: 'ERROR_DUPLICATE', 
    type: FeedbackTypeEnum.Error, 
    labels: ["This field must have a unique value", "Ce champ doit avoir une valeur unique"], 
  }, 
  ERROR_REQUIRED: { 
    name: 'ERROR_REQUIRED', 
    type: FeedbackTypeEnum.Error, 
    labels: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    name: 'ERROR_REGEX', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    name: 'ERROR_CREATE', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    name: 'ERROR_UPDATE', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    name: 'ERROR_DELETE', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_MODEL_FOUND: { 
    name: 'ERROR_MODEL_FOUND', 
    type: FeedbackTypeEnum.Error, 
    labels: ["Model found", "Model trouvé"], 
  }, 
  SUCCESS_ITEM_FOUND: { 
    name: 'SUCCESS_ITEM_FOUND', 
    type: FeedbackTypeEnum.Success, 
    labels: ["Item found", "Item trouvé"], 
  }, 
  SUCCESS_UPDATE: { 
    name: 'SUCCESS_UPDATE', 
    type: FeedbackTypeEnum.Success, 
    labels: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    name: 'SUCCESS_DELETE', 
    type: FeedbackTypeEnum.Success, 
    labels: ["Delete successful", "Suppression réussie"], 
  } 
}


