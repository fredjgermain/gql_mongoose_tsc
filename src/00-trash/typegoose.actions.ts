
// ----------------------------------------------------------------
import { FetchIModel, GetMongoModel, GetIFields } from './model/model.util'; 
import { ValidateInputsToCreate, ValidateInputsToUpdate, HasErrors, ValidateIdsToFind, ValidateInputs } 
  from './validation/validation.action'; 
import { Input, Item } from './item.utils'; 
import { IModel } from '../../lib/ifield.interface'; 
import { MLangLabel } from './mlang/mlanglabel.model'; 
import { FeedbackMsg } from './feedback/feedback.model';

type ReturnModel = {model?:IModel, errors?:any[]}; 
type ReturnItems = {items?:Item[]|Input[], errors?:any[]}; 




export type Subfield = {[key:string]:boolean|Subfield} 
export async function ReadSubField(modelName:string, subfields:Subfield, id:string) { 
  let subObject = {} as any; 
  const {model} = GetMongoModel(modelName); 
  if(!model) 
    return {}; 
  const ifields = GetIFields(model); 
  const [src] = await model.find({_id:id}); 

  const entries = Object.entries(subfields); 
  for(let i=0; i<entries.length; i++) { 
    const [key, subfield] = entries[i]; 
    const ifield = ifields.find( ifield => ifield.accessor===key ); 

    if(typeof subfield === "boolean" && subfield) { 
      subObject[key] = src[key]; 
    } else if(ifield?.options?.ref && typeof subfield === "object") { 
      subObject[key] = await ReadSubField(ifield.options.ref, subfield, src[key]); 
    } 
  } 
  return subObject; 
} 



/** Model ------------------------------------------------- 
 * 
 * @param modelName 
 * @returns 
 */
export async function Model(modelName:string):Promise<ReturnModel> { 
  const {model, error} = await FetchIModel(modelName); 
  
  return !error ? {model} : {model, errors:[error]}; 
} 


// MLANGLABEL 
export async function GetMLangLabel(names:string[]):Promise<ReturnItems> { 
  const {items, errors} = await Read('MLangLabel'); 
  if(!items) 
    return {errors} 
  const filteredItems = items.filter( item => names.includes( (item as any as MLangLabel).name )) 
  return {items:filteredItems}; 
} 

// Feedback
export async function GetFeedbackMsg(names:string[]):Promise<ReturnItems> { 
  const {items, errors} = await Read('FeedbackMsg'); 
  if(!items) 
    return {errors} 
  const filteredItems = items.filter( item => names.includes( (item as any as FeedbackMsg).name )) 
  return {items:filteredItems}; 
} 



/** Validate 
 * 
 * @param modelName 
 * @param inputs 
 * @returns 
 */
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
  if(!model) 
    return {errors:[error]}; 

  const createErrors = await ValidateInputsToCreate(model, toCreate); 
  if(HasErrors(createErrors)) 
    return {errors:createErrors}; 

  // createErrors does not detect duplication ?? 
  console.log('create', createErrors); 

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
export async function Read(modelName:string, ids?:string[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!model) 
    return {errors:[error]}; 
  
  if(!ids) 
    return {items:await model.find()} 
  
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
  if(!model) 
    return {errors:[error]}; 

  const ids = toUpdate.map( item => item._id ); 
  const updateErrors = await ValidateInputsToUpdate(model, toUpdate); 
  if(HasErrors(updateErrors)) 
    return {errors:updateErrors}; 

  try { 
    for(let i=0; i<toUpdate.length; i++) { 
      const {_id, ...parsedItem} = toUpdate[i]; 
      await model.updateOne({_id:_id}, parsedItem); 
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
export async function Delete(modelName:string, ids?:string[]):Promise<ReturnItems> { 
  const {model, error} = GetMongoModel(modelName); 
  if(!model) 
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