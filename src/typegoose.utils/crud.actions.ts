import { ErrProp, ErrorParsing } from "./getfeedback.util"; 
import { MongoModel, GetIFields } from './getmodel.util'; 
import { FEEDBACK_MSG } from './feedback'; 
import { 
  ParsedItem, ParseFromDoc, ParseToCreate, ParseToUpdate, 
  GetDuplicateErrors, GetNotFoundError, GetValidationErrors } 
  from './validations.utils'; 





/** ValidateInputs
 * test for each iputs 
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function ValidateInputs(model:MongoModel, inputs:object[]) { 
  const ids = inputs.map( input => ParsedItem(input)._id ?? ParsedItem(input).id ); 
  const collection = (await model.find()).filter( item => !ids.includes(ParseFromDoc(item)._id)); 

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


type Result = {items?:any[], errors?:any[]}; 
// Create -----------------------------------------------
/**
 * Returns either 
  - an array of the newly created items. 
   OR
  - an array of 1 element for each input 
    'input': an input to create. 
    'errors' an array of ErrProp containing the validation or duplicate errors if there's any.  
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function Create(model:MongoModel, inputs:object[]):Promise<Result> { 
  const toCreate = inputs.map( input => ParseToCreate(input)); 
  const createErrors = await ValidateInputs(model, toCreate); 
  // test for each {input, errors} if any errors has been found. 
  for(let i=0; i<createErrors.length; i++) { 
    if((createErrors[i]).errors.length > 0) 
      return {errors:createErrors}; 
  } 
  try { 
    return {items:await model.create(inputs)}; 
  }catch(err) { 
    return {errors:createErrors}; 
  } 
} 


// Read ---------------------------------------------------
/** 
 * Returns either 
    - an array of all the items it could find for 'model'
  OR
    - an array of 1 element with 
      'input': all passed as inputs. 
      'errors' a single ERROR_ITEMNOTFOUND with a value of all the ids it could not find. 
 * @param model 
 * @param ids 
 * @returns 
 */
export async function Read(model:MongoModel, ids:string[]):Promise<Result> { 
  try{ 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return {items:await model.find(selector)}; 
  }catch(err) { 
    return {errors:[(await GetNotFoundError(model, ids))]}; 
  } 
} 


// Update -----------------------------------------------
/** Update
 * Returns either 
 *  - an array of updated items. 
 * OR
 *  - an array of 1 element with 
      'input': all passed as inputs. 
      'errors' a single ERROR_ITEMNOTFOUND with a value of all the ids it could not find. 
   OR
   - an array of 1 element for each input 
      'input': an input to update. 
      'errors' an array of ErrProp containing the validation or duplicate errors if there's any.  
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function Update(model:MongoModel, inputs:object[]): Promise<Result> { 
  // parse inputs to garanty "_id or id" 
  const toUpdate = inputs.map( input => ParseToUpdate(input) ) 
  const ids = toUpdate.map( item => item._id ); 
  // test if all ids exist, if not, return an error. 
  const notFoundError = await GetNotFoundError(model, ids); 
  if((notFoundError.value as any[]).length > 0) 
    return {errors:[{input:ids, errors:[notFoundError]}]} 
  
  const updateErrors = (await ValidateInputs(model, toUpdate)) 
    .map( validation => { 
      const input = validation.input; 
      // TO IGNORE 'ERROR_REQUIRED' 
      const errors = validation.errors.filter( error => error.name != FEEDBACK_MSG.ERROR_REQUIRED.name ) 
      return {input, errors} 
    }); 
  for(let i=0; i<updateErrors.length; i++) { 
    if(updateErrors[i].errors.length >0) 
      return {errors:updateErrors} 
  } 
  try { 
    for(let i=0; i<toUpdate.length; i++) { 
      const {id, ...parsedItem} = toUpdate[i]; 
      await model.updateOne({_id:id}, parsedItem); 
    } 
    // fetch item after updates 
    return {items:await model.find({_id:{$in:ids}})} 
  }catch(err) { 
    return {errors:err} 
  } 
} 


// Delete -------------------------------------------------
/** Delete 
 * Returns either 
    - an array of all the items it could find and delete 
  OR
    - an array of 1 element with 
      'input': all passed as inputs. 
      'errors' a single ERROR_ITEMNOTFOUND with a value of all the ids it could not find. 
 * @param model 
 * @param ids 
 * @returns 
 */
export async function Delete(model:MongoModel, ids:string[]):Promise<Result> { 
  if(!ids || ids.length === 0) 
    return {items:[]} 
  // test if all ids exist, if not return an error. 
  const notFoundError = await GetNotFoundError(model, ids); 
  if((notFoundError.value as any[]).length > 0) 
    return {errors:[{input:ids, errors:[notFoundError]}]}; 

  // delete items. 
  try{ 
    // stores items before deleting them. 
    const deleted = await model.find({_id: {$in: ids}}); 
    for(let i=0; i<ids.length; i++) 
      await model.deleteOne({_id: ids[i] }) 
    return {items:deleted}; 
  }catch(err) { 
    return {errors:err} 
  }
} 