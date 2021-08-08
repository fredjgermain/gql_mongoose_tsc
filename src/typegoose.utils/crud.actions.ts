import { mongoose } from "@typegoose/typegoose"; 


// ----------------------------------------------------------------
import { MongoModel, GetMongoModelObject, GetIFields } from './model/model.util'; 
import { MetaCollection } from './model/metacollections.class'; 
//import { FetchFeedbackMsg, FEEDBACK_MSG } from './feedback/feedback.utils'; 
import { ValidateInputsToCreate, ValidateInputsToUpdate, HasErrors, ValidateIdsToFind } from './validation/validation.action'; 
import { Input, Item } from './item.utils'; 
import { IModel } from '../../lib/ifield.interface'; 


type Result = {items?:any[], model?:IModel, errors?:any[]}; 


export async function Model(modelName:string):Promise<Result> { 
  const MetaCollectionModel = mongoose.models['MetaCollection']; 
  const metaCollection = (await MetaCollectionModel.findOne({accessor:modelName}) as MetaCollection); 

  const {model, error} = GetMongoModelObject(modelName); 
  if(!model) 
    return {errors:[error]}; 

  const ifields = GetIFields(model); 
  return {model:{...metaCollection, ifields}}; 
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
export async function Create(model:MongoModel, toCreate:Input[]):Promise<Result> { 
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
export async function Read(model:MongoModel, ids:string[]):Promise<Result> { 
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
export async function Update(model:MongoModel, toUpdate:Item[]): Promise<Result> { 
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
export async function Delete(model:MongoModel, ids:string[]):Promise<Result> { 
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