import { ErrProp, ErrorParsing } from "./errprop.class"; 
import { MongoModel, GetIFields } from '../mongomodel.parsing'; 
import { FEEDBACK } from '../feedback.utils'; 
import { IdsExist } from '../item.utils'; 



/** GetDuplicateErrors 
 * Get the fields with the "unique" attributes 
 * Test if that input has no duplicate values when compared with 'toCompare' 
 * For each non-unique field it return a 'ERROR_DUPLICATE'. 
 * 
 * @param model 
 * @param input 
 * @param toCompare 
 * @returns 
 */
export function GetDuplicateErrors(model:MongoModel, input:any, toCompare:any[]):ErrProp[] { 
  const indexedFields = GetIFields(model) 
    .filter( field => field?.options?.unique === true ) 
    .map( field => field.accessor ); 
  
  // console.log("GetDuplicate", GetIFields(model) ); 

  return indexedFields.filter( path => { 
    const value = input[path]; 
    const values = toCompare.map( i => i[path]) 
    return values.filter( v => !!v && !!value && v === value ).length > 0; 
  }).map( path => { 
    return {name:FEEDBACK.ERROR_DUPLICATE.name, path, value:input[path]} as ErrProp 
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
  const notFound = ids.filter( (id, i) => !exist[i] ); 
  return {name:FEEDBACK.ERROR_ITEM_NOT_FOUND.name, 
    path:'_id', 
    value:notFound 
  } 
}


