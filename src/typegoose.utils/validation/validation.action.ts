import { ErrorParsing, ErrProp } from './errprop.class'; 
import { GetDuplicateErrors, GetNotFoundError, GetValidationErrors } from './validations.utils'; 
import { MongoModel } from '../typegoosemodel.util'; 
import { Input, Item, ParseFromDoc } from '../item.utils'; 
import { FEEDBACK } from '../feedback.utils'; 



export async function ValidateToCreate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
  const validationErrors = await ValidateInputs(model, inputs); 
  validationErrors.map( errors => { 
    return {...errors, name:FEEDBACK.ERROR_CREATE.name} 
  }); 
  return validationErrors; 
} 

export async function ValidateToUpdate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
  // getError not found
  const toUpdate = await GetDocsToUpdate(model, inputs); 
  const ids = toUpdate.map( item => item._id ); 
  // test if all ids exist, if not, return an error. 
  const notFoundError = await ValidateIdsToFind(model, ids); 
  if(notFoundError.length > 0)
    return notFoundError; 

  const validationErrors = await ValidateInputs(model, toUpdate); 
  validationErrors.map( error => { 
    return {...error, name:FEEDBACK.ERROR_UPDATE.name} 
  }) 
  return validationErrors; 
}


/** Validate Ids To Find ---------------------------------------------
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
 export async function ValidateIdsToFind(model:MongoModel, ids:string[]):Promise<ErrProp[]> { 
  const notFoundError = await GetNotFoundError(model, ids); 
  if(!ids || ids.length === 0 || (notFoundError.value as any[]).length === 0) 
    return []; 
  return [notFoundError]; 
}



export async function ValidateInputs(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
  const ids = GetIdsFromInputs(inputs); 

  const existingItems = (await model.find()) 
    .filter( item => !ids.includes(ParseFromDoc(item)._id) ); 

  const errors = [] as ErrProp[]; 
  for(let i =0; i < inputs.length; i++) { 
    const input = inputs[i]; 
    const _inputs = inputs.filter( (e, idx) => idx != i ); 
    const toCompare = [..._inputs, ...existingItems]; 
    const duplicationErrors = await GetDuplicateErrors(model, input, toCompare); 
    const validationErrors = await GetValidationErrors(model, input); 
    const error = { name:'', path:'', value:input, 
      errors:[...duplicationErrors, ...validationErrors] 
    } as ErrProp; 
    if((error.errors?.length ?? 0) > 0) 
      errors.push(error); 
  } 
  return errors; 
} 


async function GetDocsToUpdate(model:MongoModel, inputs:any[]) { 
  const ids = GetIdsFromInputs(inputs); 
  return (await model.find({_id:{$in:ids}})) 
    .map( doc => { 
      const item = ParseFromDoc(doc); 
      const input = inputs.find( input => input._id === item._id) 
      return {...item, ...input} as Item; 
    }); 
}

function GetIdsFromInputs(inputs:Input[]) { 
  return inputs.map( input => input._id) 
    .filter( id => typeof id === 'string' ) as string[]; 
} 
