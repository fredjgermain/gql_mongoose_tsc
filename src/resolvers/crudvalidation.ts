import { ErrProp, ErrorParsing } from "../typegoose.utils/getfeedback.util"; 
import { MongoModel, GetIFields } from '../typegoose.utils/getmodel.util'; 
import { FEEDBACK_MSG } from './feedback'; 


function ParseToCreate(input:object) { 
  const {id, _id, ..._input} = (input as any); // ignore id and _id if they were 
  return _input; 
}

function ParseToUpdate(input:any): {_id:string, id:string, [key:string]:any} { 
  let parseToUpdate = {...input}; 
  parseToUpdate._id = parseToUpdate._id ?? parseToUpdate.id ?? ''; 
  parseToUpdate.id = parseToUpdate._id; 
  return parseToUpdate; 
} 

function ParseFromDoc(docs:any): {_id:string, [key:string]:any} { 
  return JSON.parse(JSON.stringify(docs)); 
} 


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


/** ItemsExist 
 * Receive an array of items 
    parsed out their ids 
    For each id test If a matching item exists in a given collection. 
    Return an array of boolean, 1 element for each id. 
 * @param model 
 * @param items 
 * @returns Promise<boolean[]> 
 */
export async function ItemsExist(model:MongoModel, items:object[]):Promise<boolean[]> { 
  const ids = items.map( item => ParsedItem(item)._id ?? ParsedItem(item).id ); 
  return await IdsExist(model, ids); 
} 


/** IdsExists 
 * For each id test If a matching item exists in a given collection. 
    Return an array of boolean, 1 element for each id. 
 * 
 * @param model 
 * @param ids 
 * @returns Promise<boolean[]> 
 */
export async function IdsExist(model:MongoModel, ids:string[]):Promise<boolean[]> { 
  const collectionIds = (await model.find()).map( item => ParseFromDoc(item)._id ); 
  return ids.map( id => collectionIds.includes(id) ); 
} 


/** GetDuplicateErrors 
 * Get the fields with the "unique" attributes 
 * Test if that input has not duplicate values when compared 'toCompare' 
 * For each non-unique field it return an ERROR_DUPLICATE error. 
 * 
 * @param model 
 * @param input 
 * @param toCompare 
 * @returns 
 */
export function GetDuplicateErrors(model:MongoModel, input:any, toCompare:any[]) { 
  const indexedFields = GetIFields(model) 
    .filter( field => field?.options?.unique === true ) 
    .map( field => field.name ); 

  return indexedFields.filter( path => { 
    const value = input[path]; 
    const values = toCompare.map( i => i[path]) 
    return values.filter( v => !!v && !!value && v === value ).length > 0; 
  }).map( path => { 
    return {name:FEEDBACK_MSG.ERROR_DUPLICATE.name, path, value:input[path]} as ErrProp 
  }) 
} 


/** GetValidationErrors 
 * Validates 1 input, 
 * If it catches an err it parses the errors and returns the parsed error object. 
 * 
 * @param model 
 * @param input 
 * @returns 
 */
export async function GetValidationErrors(model:MongoModel, input:object):Promise<ErrProp[]> { 
  try{ 
    await model.validate(input) 
    return []; 
  } catch(err) { 
    return ErrorParsing(err); 
  } 
} 


/** GetNotFoundErrors 
 * Return a single element in a ErrProp
 * 
 * @param model 
 * @param ids 
 */
export async function GetNotFoundError(model:MongoModel, ids:string[]): Promise<ErrProp> { 
  const exist = await IdsExist(model, ids); 
  const {name, path} = {name:FEEDBACK_MSG.ERROR_ITEMNOTFOUND.name, path:'_id'}; 
  const notFound = ids.filter( (id, i) => !exist[i] ); 
  return {name, path, value:notFound} 
}


export function ParsedItem(item:any): {_id:string, id:string, [key:string]:any} { 
  let parsedItem = JSON.parse(JSON.stringify(item)); 
  parsedItem._id = parsedItem._id ?? parsedItem.id ?? ''; 
  parsedItem.id = parsedItem._id; 
  return parsedItem; 
} 

function RemoveAt(at:number, array:any[]) { 
  const copy = [...array]; 
  copy.splice(at, 1); 
  return copy; 
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
 * @param inputs 
 * @returns 
 */
export async function Create(model:MongoModel, inputs:object[]) { 
  // parses inputs to ignore '_id', 'id' 
  const toCreate = inputs.map( input => ParseToCreate(input)); 
  const createErrors = await ValidateInputs(model, toCreate); 
  // test for each {input, errors} if any errors has been found. 
  for(let i=0; i<createErrors.length; i++) { 
    if((createErrors[i]).errors.length > 0) 
      return createErrors; 
  } 
  
  try { 
    return await model.create(inputs); 
  }catch(err) { 
    return err; 
  } 
} 


// Read ---------------------------------------------------
/** Read 
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
export async function Read(model:MongoModel, ids:string[]) { 
  try{ 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return await model.find(selector); 
  }catch(err) { 
    return [{input:ids, errors:[(await GetNotFoundError(model, ids))]}]; 
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
export async function Update(model:MongoModel, inputs:object[]) { 
  // parse inputs to garanty "_id or id" 
  const toUpdate = inputs.map( input => ParseToUpdate(input) ) 
  const ids = toUpdate.map( item => item._id ); 
  // test if all ids exist, if not return an error. 
  const notFoundError = await GetNotFoundError(model, ids); 
  if((notFoundError.value as any[]).length > 0) 
    return [{input:ids, errors:[notFoundError]}]; 
  
  const updateErrors = (await ValidateInputs(model, toUpdate)) 
    .map( validation => { 
      const input = validation.input; 
      // TO IGNORE 'ERROR_REQUIRED' 
      const errors = validation.errors.filter( error => error.name != FEEDBACK_MSG.ERROR_REQUIRED.name ) 
      return {input, errors} 
    }); 

  for(let i=0; i<updateErrors.length; i++) { 
    if(updateErrors[i].errors.length >0) 
      return updateErrors; 
  } 

  try { 
    for(let i=0; i<toUpdate.length; i++) { 
      const {id, ...parsedItem} = toUpdate[i]; 
      console.log( parsedItem ); 
      await model.updateOne({_id:id}, parsedItem); 
    } 
    // fetch item after updates 
    return await model.find({_id:{$in:ids}}); 
  }catch(err) { 
    return err; 
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
export async function Delete(model:MongoModel, ids:string[]) { 
  if(!ids || ids.length === 0) 
    return [] 
  // test if all ids exist, if not return an error. 
  const notFoundError = await GetNotFoundError(model, ids); 
  if((notFoundError.value as any[]).length > 0) 
    return [{input:ids, errors:[notFoundError]}]; 

  // delete items. 
  try{ 
    // stores items before deleting them. 
    const deleted = await model.find({_id: {$in: ids}}); 
    for(let i=0; i<ids.length; i++) 
      await model.deleteOne({_id: ids[i] }) 
    return deleted; 
  }catch(err) { 
    return err; 
  }
} 