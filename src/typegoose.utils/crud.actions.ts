import { MongoModel, GetMongoModelObject } from './getmodel.util'; 
//import { FetchFeedbackMsg, FEEDBACK_MSG } from './feedback/feedback.utils'; 
import { ValidateInputsToCreate, ValidateInputsToUpdate } from './validation/validations.utils'; 
import { ParseToCreate, ParseToUpdate, GetNotFoundError } 
  from './validation/validations.utils'; 



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
export async function Create(modelName:string, inputs:object[]):Promise<Result> { 
  const model = GetMongoModelObject(modelName); 

  const createErrors = await ValidateInputsToCreate(model, inputs); 
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
  const updateErrors = await ValidateInputsToUpdate(model, inputs); 
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