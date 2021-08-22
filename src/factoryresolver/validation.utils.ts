import { ErrorParsing, ErrProp } from '../typegoose.utils/validation/errprop.class'; 
import { GetDuplicateErrors, GetNotFoundError, GetValidationErrors } from '../typegoose.utils/validation/validations.utils'; 
import { MongoModel } from '../typegoose.utils/model/model.util'; 
import { Input, Item, ParseFromDoc } from '../typegoose.utils/item.utils'; 
import { FEEDBACK_MSG } from '../typegoose.utils/feedback/feedback.utils'; 



export async function ValidateToCreate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
  const validationErrors = await ValidateInputs(model, inputs); 
  validationErrors.map( errors => { 
    return {...errors, name:FEEDBACK_MSG.ERROR_CREATE.name} 
  }); 
  return validationErrors; 
} 

export async function ValidateUpdate(model:MongoModel, inputs:Input[]):Promise<ErrProp[]> { 
  // getError not found
  const toUpdate = await GetDocsToUpdate(model, inputs); 
  const ids = toUpdate.map( item => item._id ); 

  // test if all ids exist, if not, return an error. 
  const notFoundError = await ValidateIdsToFind(model, ids); 
  if(notFoundError.length > 0)
    return notFoundError; 

  const validationErrors = await ValidateInputs(model, toUpdate); 
  validationErrors.map( error => { 
    return {...error, name:FEEDBACK_MSG.ERROR_UPDATE.name} 
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
    const _toCreate = inputs.filter( (e, idx) => idx != i ); 
    const toCompare = [..._toCreate, ...existingItems]; 
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
