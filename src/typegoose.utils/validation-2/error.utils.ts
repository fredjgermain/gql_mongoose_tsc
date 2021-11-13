// import { Group, Predicate } from "../../../lib/utils"; 
import { mongoose } from "@typegoose/typegoose"; 
import { FEEDBACK } from "../feedback.utils"; 
import { InterpolateString } from '../../../lib/string.utils'; 

type MongoModel = mongoose.Model<any, {}, {}> 



type ValidationOption = {value:any, toCompare?:any[], msgValues?:any}; 
export function ValidateByValidators( validators:IValidator[], options:ValidationOption ):ErrProp[] { 
  return validators.map( validator => ValidateByValidator(validator, options) ) 
    .filter( err => err ) as ErrProp[]; 
} 

function ValidateByValidator( validator:IValidator, {value, toCompare, msgValues = {}}:ValidationOption ) { 
  const message = InterpolateString({...msgValues, VALUE:value}, validator.message); // interpolated error message 
  // interpolate string on "validator.message" ?? 
  if(validator.type === "unique" && toCompare?.includes(value)) 
    return { name:FEEDBACK.ERROR_DUPLICATE.name, message } as ErrProp; 
  if(!validator.validator(value)) 
    return { name:FEEDBACK.ERROR_VALIDATION.name, message } as ErrProp; 
  return; 
} 


/** GetValidationErrors ----------------------------------- 
 * Validates 1 input, 
 * If it catches an err it parses the errors and returns the parsed error object. 
 * 
 * @param model 
 * @param input 
 * @returns 
 */ 
export async function GetValidationErrors(model:MongoModel, input:IEntry):Promise<ErrProp[]> { 
  const errors = await model.validate(input)
    .then( () => [] ) 
    .catch( (error:any) => ParseValidationError(error) ?? [] ) 
  return errors; 
} 



/** GetDuplicateErrors ------------------------------------ 
 * Get the fields with the "unique" attributes 
 * Test if that input has no duplicate values when compared with 'toCompare' 
 * For each non-unique field it return a 'ERROR_DUPLICATE'. 
 * 
 * @param model 
 * @param input 
 * @param toCompare 
 * @returns 
 */
export function GetDuplicateErrors(model:IModel, input:IEntry, toCompare:IEntry[]):ErrProp[] { 
  const indexedFields = model.ifields 
    .filter( field => field?.options?.unique === true ) 
    .map( field => field.accessor ); 

  return indexedFields.filter( path => { 
    const value = input[path]; 
    const values = toCompare.map( i => i[path]) 
    return values.filter( v => !!v && !!value && v === value ).length > 0; 
  }) 
  .map( path => { 
    return {name:FEEDBACK.ERROR_DUPLICATE.name, path, value:input[path]} as ErrProp 
  }) 
} 



/** ParseFieldErrors -------------------------------------- 
 * 
 * @param error 
 * @returns 
 */ 
export function ParseFieldErrors(error:any):ErrProp[] { 
  return ParseDuplicationError(error) ?? 
    ParseValidationError(error) ?? 
    [error]; 
} 

// ....................................................... 
function ParseDuplicationError(error:any):ErrProp[]|undefined { 
  if( !('keyPattern' in error && 'keyValue' in error && error?.name === 'MongoError') ) 
    return; 
  const [name] = Object.keys(error['keyPattern']); 
  const [value] = Object.values(error['keyValue']); 
  return [{name, value, errors:[{name:FEEDBACK.ERROR_DUPLICATE.name}] }] 
}

// ....................................................... 
function ParseValidationError(error:any):ErrProp[]|undefined { 
  if( !('name' in error && error.name === 'ValidationError') ) 
    return ; 
  const {errors} = error as {errors?:any[]}; 
  return errors?.map( e => { 
    if(e.kind === 'required') // error type 'required' 
      return {name:FEEDBACK.ERROR_REQUIRED.name, path:e.path, value:null} 
    return e.properties; // other validation errors 
  }) as ErrProp[]; 
} 
