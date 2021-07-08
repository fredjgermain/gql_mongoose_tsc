import { ErrProp, ErrorParsing } from "../typegoose.utils/getfeedback.util"; 
import { MongoModel, GetIFields } from '../typegoose.utils/getmodel.util'; 
import { FEEDBACK_MSG } from './feedback'; 


/* 
Creation 
- Parse input to remove id. (ignore if id already exists) 

Update 
- Parse input to REQUIRE id. 

ParseToCreateInput() 
ParseToUpdateInput() 
ParseFromDoc() 


ValidateInputs(model, inputs) 
  const collection = model.find( excluding inputs ) 
  const validations = [] as {input, errors}[] 
  for(let i=0; i<inputs.length; i++) { 
    const input = inputs[i] 
    const otherInputs = Remove(i, inputs) 
    inputErrors += IsInputValid(model, input) 
    duplicateErrors += IsInputDuplicate(model, input, [...otherInputs, ...collection]) 
    const errors = [...inputErrors, ...duplicateErros] 
    validations.push({input, errors}) 
  } 


Create(model, inputs) 
    

*/ 

function ParseToCreate(input:object) { 
  const {id, _id, ..._input} = (input as any); // ignore id and _id if they were 
  return _input; 
}

function ParseToUpdate(input:any): {_id:string, id:string, [key:string]:any} { 
  //let parsedInputs = JSON.parse(JSON.stringify(input)); 
  let parseToUpdate = {...input}; 
  parseToUpdate._id = parseToUpdate._id ?? parseToUpdate.id ?? ''; 
  parseToUpdate.id = parseToUpdate._id; 
  return parseToUpdate; 
} 

function ParseFromDoc(docs:any): {_id:string, id:string, [key:string]:any} { 
  return JSON.parse(JSON.stringify(docs)); 
} 

export async function ValidateInputs(model:MongoModel, inputs:object[]) { 
  const ids = inputs.map( input => ParsedItem(input)._id ?? ParsedItem(input).id ); 
  const collection = (await model.find()).filter( item => !ids.includes(ParseFromDoc(item)._id)); 

  const validations = [] as {input:object, errors:ErrProp[]}[] 
  for(let i=0; i<inputs.length; i++) { 
    const input = inputs[i]; 
    const otherInputs = RemoveAt(i, inputs); 
    const toCompare = [...otherInputs, ...collection]; 
    const errors = [ 
      ...(await IsInputValid(model, input)), 
      ...IsInputDuplicate(model, input, toCompare) 
    ]; 
    validations.push({input, errors}); 
  } 
  return validations; 
}








function RemoveAt(at:number, array:any[]) { 
  const copy = [...array]; 
  copy.splice(at, 1); 
  return copy; 
}

export function IsIdUnic(input:any, toCompares:any[]) { 
  // find ids duplicates between inputs
  const id = (input as any).id ?? (input as any)._id; 
  const ids = toCompares.map( (input:any) => input.id ?? input._id).filter(id => !!id) 
  if(ids.filter( i => !!id && id == i ).length > 0) 
    return [{name:'', path:"_id", value:id}] as ErrProp[]; 
  return []; 
} 

export function IsInputDuplicate(model:MongoModel, input:any, toCompare:any[]) { 
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

export async function IsInputValid(model:MongoModel, input:object):Promise<ErrProp[]> { 
  try{ 
    await model.validate(input) 
    return []; 
  } catch(err) { 
    return ErrorParsing(err); 
  } 
} 

export function ParsedItem(item:any): {_id:string, id:string, [key:string]:any} { 
  let parsedItem = JSON.parse(JSON.stringify(item)); 
  parsedItem._id = parsedItem._id ?? parsedItem.id ?? ''; 
  parsedItem.id = parsedItem._id; 
  return parsedItem; 
} 

export async function ItemsExist(model:MongoModel, items:object[]) { 
  return items.map( async (item:object) => { 
    const parsedItem = ParsedItem(item); 
    const value = parsedItem._id; 
    let exist = false; 
    try{ 
      exist = await model.exists({_id:parsedItem._id}); 
    }catch(err) { 
      exist = false; 
    } 
    return {value, exist}; 
  }) 
} 

/*
function FindIds(itemIds:string[], ids:string[]) { 
  const found = ids.filter( id => itemIds.includes(id)); 
  const notFound = ids.filter( id => !itemIds.includes(id)); 
  return [{name:"ItemFound", path:"_id", value:found}, 
    {name:"ItemNotFound", path:"_id", value:notFound}] 
} 
*/

export async function GetInputsErrors(model:MongoModel, inputs:object[]) { 
  const ids = inputs.map( input => ParsedItem(input)._id ?? ParsedItem(input).id ); 
  // collection excludes the inputs themselves if they exists. 
  const allItems = await model.find() 
  const collection = allItems 
    .map( item => ParsedItem(item)) 
    .filter( item => !ids.includes(item._id)); 
  /*console.log(allItems.length, collection.length) 
  console.log(collection); */

  return inputs.map( async (input:any, i:number) => { 
    const toCompare = RemoveAt(i, inputs); 
    const isValidErrors = await IsInputValid(model, input); 
    const inputDuplicateErrors = IsInputDuplicate(model, input, toCompare) 
      inputDuplicateErrors.forEach( error => error.name = "Duplicates values Between inputs" ) 
    const existingDuplicateErrors = IsInputDuplicate(model, input, collection) 
      existingDuplicateErrors.forEach( error => error.name = "Duplicates with existing items" ) 
    const isIdUnic = IsIdUnic(input, toCompare) 
      isIdUnic.forEach(error => error.name = "Duplicates ids between inputs") 
    return [...isValidErrors, ...inputDuplicateErrors, ...existingDuplicateErrors, ...isIdUnic] as ErrProp[] 
  }) 
} 


// FIND -------------------------------------------------
export async function GetFindItemErrors(model:MongoModel, ids:string[]) { 
  const items = ids.map( id => {return {_id:id}} ) 
  const itemsExist = await ItemsExist(model, items) 

  const found = {name:"Item found", path:'_id', value:[]} as ErrProp; 
  const notFound = {name:"Item not found", path:'_id', value:[]} as ErrProp; 
  for(let i=0; i<itemsExist.length; i++) { 
    const {value, exist} = await itemsExist[i]; 
    exist ? 
      (found.value as any[]).push(value): 
      (notFound.value as any[]).push(value); 
  }
  return [found, notFound]; 
}

// Create -------------------------------------------------
export async function GetCreateErrors(model:MongoModel, inputs:object[]) { 
  const itemFoundErrors = (await ItemsExist(model, inputs)) 
    .map( async (e) => { 
      return (await e).exist ? 
        [{name:"Item already exists", path:'_id', value:(await e).value}] as ErrProp[]: []; 
    }) 
  const inputErrors = await GetInputsErrors(model, inputs); 

  return inputs.map( async (input, i) => { 
    return {input, errors: [...(await itemFoundErrors[i]), ...(await inputErrors[i])]} 
  }) 
} 

// Update -------------------------------------------------
export async function GetUpdateErrors(model:MongoModel, inputs:object[]) { 
  const itemNotFoundErrors = (await ItemsExist(model, inputs)) 
    .map( async (e) => { 
      return !(await e).exist ? 
        [{name:"Item not found", path:'_id', value:(await e).value}] as ErrProp[]: []; 
    }) 
  const inputErrors = await GetInputsErrors(model, inputs) 
  // ignore required fields and errors. 
  const ignoreRequired = inputErrors.map( async input => 
    (await input).filter( errors => errors?.type != 'required') ); 

  return inputs.map( async (input, i) => { 
    return {input, errors: [...(await itemNotFoundErrors[i]), ...(await ignoreRequired[i])]} 
  }) 
} 