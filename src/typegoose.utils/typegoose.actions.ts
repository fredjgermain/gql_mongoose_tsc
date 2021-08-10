// ----------------------------------------------------------------
import { FetchIModel, GetMongoModel } from './model/model.util'; 
import { ValidateInputsToCreate, ValidateInputsToUpdate, HasErrors, ValidateIdsToFind, ValidateInputs } 
  from './validation/validation.action'; 
import { Input, Item } from './item.utils'; 
import { IModel } from '../../lib/ifield.interface'; 

type ReturnModel = {model?:IModel, errors?:any[]}; 
type ReturnItems = {items?:Item[]|Input[], errors?:any[]}; 


/** Model -----------------------------------------------
 * 
 * @param modelName 
 * @returns 
 */
export async function Model(modelName:string):Promise<ReturnModel> { 
  const {model, error} = await FetchIModel(modelName); 
  return !error ? {model} : {errors:[error]}; 
} 


export async function Validate(modelName:string, inputs:Input[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!model) 
    return {errors:[error]}; 
  const validations = await ValidateInputs(model, inputs); 
  if(HasErrors(validations)) 
    return {errors:validations}; 
  return {items:inputs}; 
}

// Create -----------------------------------------------
/**
 * Returns either 
  - an array of the newly created items. 
   OR
  - an array of 1 element for each input 
    'input': an input to create. 
    'errors' an array of ErrProp containing the validation or duplicate errors if there's any.  
 * @param model 
 * @param toCreate 
 * @returns 
 */
export async function Create(modelName:string, toCreate:Input[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!!error) 
    return {errors:[error]}; 

  const createErrors = await ValidateInputsToCreate(model, toCreate); 
  if(HasErrors(createErrors)) 
    return {errors:createErrors}; 

  try { 
    return {items:await model.create(toCreate)}; 
  }catch(err) { 
    return {errors:err}; 
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
export async function Read(modelName:string, ids:string[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!!error) 
    return {errors:[error]}; 

  const notFoundError = await ValidateIdsToFind(model, ids); 
  if(HasErrors(notFoundError)) 
    return {errors:notFoundError}; 

  try{ 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return {items:await model.find(selector)}; 
  }catch(err) { 
    return {errors:err}; 
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
 * @param toUpdate 
 * @returns 
 */
export async function Update(modelName:string, toUpdate:Item[]): Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!!error) 
    return {errors:[error]}; 

  const ids = toUpdate.map( item => item._id ); 
  const updateErrors = await ValidateInputsToUpdate(model, toUpdate); 
  if(HasErrors(updateErrors)) 
    return {errors:updateErrors}; 

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
export async function Delete(modelName:string, ids:string[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!!error) 
    return {errors:[error]}; 

  if(!ids || ids.length === 0) 
    return {items:[]} 
  // test if all ids exist, if not return an error. 
  const notFoundError = await ValidateIdsToFind(model, ids); 
  if(HasErrors(notFoundError)) 
    return {errors:notFoundError}; 

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