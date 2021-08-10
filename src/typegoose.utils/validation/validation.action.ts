import { FEEDBACK_MSG } from '../feedback/feedback.utils'; 
import { GetDuplicateErrors, GetNotFoundError, GetValidationErrors } from './validations.utils'; 
import { ParseFromDoc, Item, ParseToCreate, ParseToUpdate, ParsedItem } from '../item.utils'; 

import { ErrProp } from './errprop.class'; 
//import { MongoModel } from '../model/model.util'; 



type ValidationResult = {input: object, errors?: ErrProp[] } 
/** HasErrors ------------------------------------------------------
 * 
 * @param errors 
 * @returns 
 */
export function HasErrors(errors:ValidationResult[]) { 
  return errors.some( error => (error.errors?.length ?? 0) > 0 ); 
} 



/** Validate Inputs To Create --------------------------------------
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function ValidateInputsToCreate(model:MongoModel, inputs:object[]):Promise<ValidationResult[]> { 
  const toCreate = inputs.map( input => ParseToCreate(input)); 
  return await ValidateInputs(model, toCreate); 
} 



/** Validate Ids To Find ---------------------------------------------
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function ValidateIdsToFind(model:MongoModel, ids:string[]):Promise<ValidationResult[]> { 
  const notFoundError = await GetNotFoundError(model, ids); 
  if(!ids || ids.length === 0 || (notFoundError.value as any[]).length === 0) 
    return []; 
  return [{input:ids, errors:[notFoundError]}]; 
}



/** Validate Inputs To Update -----------------------------------------
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function ValidateInputsToUpdate(model:MongoModel, inputs:object[]):Promise<ValidationResult[]> { 
  const toUpdate = inputs.map( input => ParseToUpdate(input) ) 
  const ids = toUpdate.map( item => item._id ); 
  // test if all ids exist, if not, return an error. 
  const idsFound = await ValidateIdsToFind(model, ids); 
  if(HasErrors(idsFound)) 
    return idsFound; 

  return (await ValidateInputs(model, toUpdate)) 
    .filter( result => { 
      return result.errors?.some( error => error.name != FEEDBACK_MSG.ERROR_REQUIRED.name ) 
    }); 
}



/** ValidateInputs ----------------------------------------------------
 * test for each iputs 
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
 export async function ValidateInputs(model:MongoModel, inputs:object[]):Promise<ValidationResult[]> { 
  const ids = inputs.map( input => ParsedItem(input)._id ?? ParsedItem(input).id ); 

  // all existing items excluding updates inputs 
  const collection = (await model.find()).filter( (item:Item) => !ids.includes(ParseFromDoc(item)._id)); 

  const validations = [] as {input:object, errors:ErrProp[]}[] 
  for(let i=0; i<inputs.length; i++) { 
    const input = inputs[i]; 
    const otherInputs = RemoveAt(i, inputs); 
    const toCompare = [...otherInputs, ...collection]; 
    const errors = [ 
      ...(await GetValidationErrors(model, input)), 
      ...GetDuplicateErrors(model, input, toCompare) 
    ]; 
    validations.push({input, errors}); 
  } 
  return validations; 
}

function RemoveAt(at:number, array:any[]) { 
  const copy = [...array]; 
  copy.splice(at, 1); 
  return copy; 
}

