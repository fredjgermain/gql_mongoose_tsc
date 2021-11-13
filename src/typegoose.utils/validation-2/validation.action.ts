import { FEEDBACK } from "../feedback.utils"; 
import { InterpolateString } from '../../../lib/string.utils'; 
import { FindEntries } from "../model/modeler.utils"; 



export async function ValidateToCreate(model:IModel, inputs:IEntry[]) { 
  const collection = await FindEntries({modelName:model.accessor}) 
  return ValidateByInputs(model, inputs, collection); 
} 

export async function ValidateToUpdate(model:IModel, inputs:IEntry[]) { 
  // Complete partial updates ?? by fetching their complete previous corresponding entry
  const toUpdate = inputs 

  // Validate existance First 
  const collection = await FindEntries({modelName:model.accessor}) 
  return ValidateByInputs(model, inputs, collection); 
} 


/** Validate Ids To Find ---------------------------------------------
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
export async function ValidateIdsToFind(model:IModel, inputs:IEntry[]):Promise<InputError[]> { 

  const collectionIds = (await FindEntries({modelName:model.accessor})).map( e => e._id ); 
  const inputExists = (input:IEntry) => collectionIds.includes(input._id); 
  
  return inputs.map( input => { 
    if( inputExists(input) ) { 
      const errors = [{name:FEEDBACK.ERROR_ITEM_NOT_FOUND.name}] as ErrProp[]; 
      const fieldErrors = [{name:'_id', value:input._id, errors}] as FieldError[]; 
      return { input, fieldErrors } as InputError; 
    } 
    return {input, fieldErrors:[]} as InputError; 
  }); 
}


async function InputExists(model:IModel, inputs:IEntry[]) { 
  const collectionIds = (await FindEntries({modelName:model.accessor})).map( e => e._id ); 
  const inputExists = (input:IEntry) => collectionIds.includes(input._id); 
  return inputs.map( input => inputExists(input)); 
} 


export function ValidateByInputs(model:IModel, inputs:IEntry[], collection:IEntry[]):InputError[] { 
  const ids = inputs.map( i => i._id); 
  const _collection = collection.filter( entry => ids.includes(entry._id) ); 
  
  return inputs.map( (input, i, a) => { 
    // exclude the element itself to not compare itself with itself and so avoid false duplication error. 
    const otherInputs = a.filter( (e,j) => j != j ); 
    return ValidateByInput(model, input, [...otherInputs, ..._collection]); 
  }) 
} 



export function ValidateByInput(model:IModel, input:IEntry, otherEntries:IEntry[]):InputError { 
  const fieldErrors = (model.ifields ?? []).map( ({validators, accessor}) => { 
    const value = input[accessor]; 
    const toCompare = otherEntries.map( entry => entry[accessor] ); 
    const msgValues = {PATH:accessor}; 
    const errors = ValidateByValidators(validators, {value, toCompare, msgValues}); 
    return {name:accessor, value, errors} as FieldError; 
  }); 
  return {input, fieldErrors}; 
} 



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


// import { GetDuplicateErrors, GetNotFoundError, GetValidationErrors, 
//   GetDocsToUpdate, GetIdsFromInputs } 
// from './validations.utils'; 
// //import { MongoModel } from '../mongomodel.parsing'; 
// import { Input, Item, ParseFromDoc } from '../item.utils'; 
// import { FEEDBACK } from '../feedback.utils'; 



// export async function ValidateToCreate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
//   const validationErrors = await ValidateInputs(model, inputs); 
//   validationErrors.map( errors => { 
//     return {...errors, name:FEEDBACK.ERROR_CREATE.name} 
//   }); 
//   return validationErrors; 
// } 

// export async function ValidateToUpdate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
//   // getError not found
//   const toUpdate = await GetDocsToUpdate(model, inputs); 
//   const ids = toUpdate.map( item => item._id ); 
//   // test if all ids exist, if not, return an error. 
//   const notFoundError = await ValidateIdsToFind(model, ids); 
//   if(notFoundError.length > 0)
//     return notFoundError; 

//   const validationErrors = await ValidateInputs(model, toUpdate); 
//   validationErrors.map( error => { 
//     return {...error, name:FEEDBACK.ERROR_UPDATE.name} 
//   }) 
//   return validationErrors; 
// }


// /** Validate Ids To Find ---------------------------------------------
//  * 
//  * @param model 
//  * @param inputs 
//  * @returns 
//  */
// export async function ValidateIdsToFind(model:MongoModel, ids:string[]):Promise<ErrProp[]> { 
//   const notFoundError = await GetNotFoundError(model, ids); 
//   if(!ids || ids.length === 0 || (notFoundError.value as any[]).length === 0) 
//     return []; 
//   return [notFoundError]; 
// }



// export async function ValidateInputs(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
//   const ids = GetIdsFromInputs(inputs); 

//   const existingItems = (await model.find()) 
//     .filter( item => !ids.includes(ParseFromDoc(item)._id) ); 

//   const errors = [] as ErrProp[]; 
//   for(let i =0; i < inputs.length; i++) { 
//     const input = inputs[i]; 
//     const _inputs = inputs.filter( (e, idx) => idx != i ); 
//     const toCompare = [..._inputs, ...existingItems]; 
//     const duplicationErrors = await GetDuplicateErrors(model, input, toCompare); 
//     const validationErrors = await GetValidationErrors(model, input); 
//     const error = { name:'', path:'', value:input, 
//       errors:[...duplicationErrors, ...validationErrors] 
//     } as ErrProp; 
//     if((error.errors?.length ?? 0) > 0) 
//       errors.push(error); 
//   } 
//   return errors; 
// } 

