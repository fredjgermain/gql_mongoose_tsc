export const FEEDBACK = { 
  // Errors ...............................................
  ERROR_MODEL_NOT_FOUND: { 
    name: 'ERROR_MODEL_NOT_FOUND', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Model not found", "Model introuvé"], 
  }, 
  ERROR_ITEM_NOT_FOUND: { 
    name: 'ERROR_ITEM_NOT_FOUND', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Item not found", "Item introuvé"], 
  }, 
  ERROR_VALIDATION: { 
    name: 'ERROR_VALIDATION', 
    //type: FeedbackTypeEnum.Error, 
    // msg: ["This item is not valide", "L'item n,est pas valid"], 
  }, 
  ERROR_DUPLICATE: { 
    name: 'ERROR_DUPLICATE', 
    //type: FeedbackTypeEnum.Error, 
    label: ["This field must have a unique value", "Ce champ doit avoir une valeur unique"], 
  }, 
  ERROR_REQUIRED: { 
    name: 'ERROR_REQUIRED', 
    //type: FeedbackTypeEnum.Error, 
    label: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    name: 'ERROR_REGEX', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    name: 'ERROR_CREATE', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    name: 'ERROR_UPDATE', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    name: 'ERROR_DELETE', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_MODEL_FOUND: { 
    name: 'ERROR_MODEL_FOUND', 
    //type: FeedbackTypeEnum.Error, 
    label: ["Model found", "Model trouvé"], 
  }, 
  SUCCESS_ITEM_FOUND: { 
    name: 'SUCCESS_ITEM_FOUND', 
    //type: FeedbackTypeEnum.Success, 
    label: ["Item found", "Item trouvé"], 
  }, 
  SUCCESS_UPDATE: { 
    name: 'SUCCESS_UPDATE', 
    //type: FeedbackTypeEnum.Success, 
    label: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    name: 'SUCCESS_DELETE', 
    //type: FeedbackTypeEnum.Success, 
    label: ["Delete successful", "Suppression réussie"], 
  } 
}

