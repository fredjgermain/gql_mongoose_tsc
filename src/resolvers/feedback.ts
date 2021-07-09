import { ErrProp } from '../typegoose.utils/getfeedback.util'; 


enum FBType { 
  Success, 
  Warning, 
  Notif, 
  Error 
} 

interface FeedbackMsg { 
  name: string, 
  type: FBType, 
  msg: string[], 
} 

/*interface FeedbackMsgS { 
  [key:string]: FeedbackMsg; 
} */

function EvalStringInterpolation(errorArgs:ErrProp, templateStr:string) { 
  const keys = Object.keys(errorArgs); 
  templateStr = templateStr.replace(/`/g, '\\`'); 
  const fn = new Function(...keys, 'return `' + templateStr + '`'); 
  return fn(...keys.map(key => errorArgs[key])); 
} 

const error = {name:'ERROR', path:'myfield', value:'wrong value'}; 
console.log(EvalStringInterpolation(error, "this is field: ${path} ... ${value} ")) 


export const FEEDBACK_MSG = { 
  // Errors ...............................................
  ERROR_ITEMNOTFOUND: { 
    name: 'ERROR_ITEMNOTFOUND', 
    type: FBType.Error, 
    msg: ["Item not found", "Item est introuvable"], 
  }, 
  ERROR_DUPLICATE: { 
    name: 'ERROR_DUPLICATE', 
    type: FBType.Error, 
    msg: ["This field must have a unique value", "Ce champ doit avoir une valeur unique"], 
  }, 
  ERROR_REQUIRED: { 
    name: 'ERROR_REQUIRED', 
    type: FBType.Error, 
    msg: ["This field is required and cannot be left empty", "Ce champ est requis et ne peut etre laissé vide"], 
  }, 
  ERROR_REGEX: { 
    name: 'ERROR_REGEX', 
    type: FBType.Error, 
    msg: ["Must follow take the format ex: ...", "Doit avoir le format ex:..."], 
  }, 
  // Crud failure 
  ERROR_CREATE: { 
    name: 'ERROR_CREATE', 
    type: FBType.Error, 
    msg: ["Creation failed", "Création échouée"], 
  }, 
  ERROR_UPDATE: { 
    name: 'ERROR_UPDATE', 
    type: FBType.Error, 
    msg: ["Update failed", "Mise-a-jour échouée"], 
  }, 
  ERROR_DELETE: { 
    name: 'ERROR_DELETE', 
    type: FBType.Error, 
    msg: ["Delete failed", "Suppression échouée"], 
  }, 

  // Success ..............................................
  SUCCESS_ITEMFOUND: { 
    name: 'SUCCESS_ITEMFOUND', 
    type: FBType.Success, 
    msg: ["Item found", "Item introuvé"], 
  }, 
  // Crud success 
  SUCCESS_CREATE: { 
    name: 'SUCCESS_CREATE', 
    type: FBType.Success, 
    msg: ["Creation successful", "Création réussie"], 
  }, 
  SUCCESS_UPDATE: { 
    name: 'SUCCESS_UPDATE', 
    type: FBType.Success, 
    msg: ["Update successful", "Mise-a-jour réussie"], 
  }, 
  SUCCESS_DELETE: { 
    name: 'SUCCESS_DELETE', 
    type: FBType.Success, 
    msg: ["Delete successful", "Suppression réussie"], 
  } 
}


