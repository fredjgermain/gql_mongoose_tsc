import { mongoose } from "@typegoose/typegoose";

import { ErrProp, ErrorParsing } from "./errprop.class"; 
import { GetIFields } from '../mongomodel.parsing'; 
import { FEEDBACK } from '../feedback.utils'; 
import { IdsExist, Input, Item, ParseFromDoc } from '../item.utils'; 


type MongoModel = mongoose.Model<any, {}, {}> 

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
  return await model.validate(input) 
    .then( () => [] ) 
    .catch( (error:any) => ErrorParsing(error) ) 
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


export async function GetDocsToUpdate(model:MongoModel, inputs:any[]) { 
  const ids = GetIdsFromInputs(inputs); 
  return (
    await model.find({_id:{$in:ids}})) 
    .map( (doc:any) => { 
      const item = ParseFromDoc(doc); 
      const input = inputs.find( input => input._id === item._id) 
      return {...item, ...input} as Item; 
    }); 
}

export function GetIdsFromInputs(inputs:Input[]) { 
  return inputs.map( input => input._id) 
    .filter( id => typeof id === 'string' ) as string[]; 
} 
