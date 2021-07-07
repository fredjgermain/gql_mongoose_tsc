
enum FBType { 
  Success, 
  Warning, 
  Notif, 
  Error 
} 

interface FeedbackMsg { 
  //name: string, 
  type: FBType, 
  msg: string[], 
} 

interface FeedbackMsgS { 
  [key:string]: FeedbackMsg; 
} 

export const FEEDBACK_MSG:FeedbackMsgS = {
  // Errors ...............................................
  ERROR_ITEMNOTFOUND: { 
    type: FBType.Error, 
    msg: ["Item not found", "Item est introuvable"], 
  }, 
  ERROR_REQUIRED: { 
    type: FBType.Error, 
    msg: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    type: FBType.Error, 
    msg: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    type: FBType.Error, 
    msg: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    type: FBType.Error, 
    msg: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    type: FBType.Error, 
    msg: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_ITEMFOUND: { 
    type: FBType.Success, 
    msg: ["Item found", "Item introuvé"], 
  }, 
  // Crud success 
  SUCCESS_CREATE: { 
    type: FBType.Success, 
    msg: ["Creation successful", "Création réussie"], 
  }, 
  SUCCESS_UPDATE: { 
    type: FBType.Success, 
    msg: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    type: FBType.Success, 
    msg: ["Delete successful", "Suppression réussie"], 
  } 
}


