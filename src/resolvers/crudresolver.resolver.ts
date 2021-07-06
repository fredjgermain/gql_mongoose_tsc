import { json } from "body-parser";
import { ObjectId } from "mongoose";
import { 
  Field, ObjectType, 
  ID, Int, 
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation, 
} from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { ErrProp, InputError, ErrorParsing } from "../typegoose.utils/getfeedback.util";
import { MongoModel, GetMongoModelObject, FetchMetaModel, GetMongoFields, GetIFields } from '../typegoose.utils/getmodel.util'; 


@ObjectType() 
export class BaseEntity { 
  @Field(()=> ID) 
  id: string; 
} 

@ArgsType()
class ModelNameArg { 
  @Field(type => String) 
  modelName: string; 
}

@ArgsType() 
class ModelIdsArgs extends ModelNameArg { 
  @Field(type => [ID], {nullable:true} ) 
  ids: string[]; 
}

@ArgsType() 
class CreateArgs extends ModelNameArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: object[]; 
} 

@ArgsType() 
class UpdateArgs extends ModelNameArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: object[]; 
} 

/*const test = [1,2,3,4,5,6]; 
console.log(test.splice(2,1), test); */

function RemoveAt(at:number, array:any[]) { 
  const copy = [...array]; 
  copy.splice(at, 1); 
  return copy; 
}

function IsIdUnic(input:any, toCompares:any[]) { 
  // find ids duplicates between inputs
  const id = (input as any).id ?? (input as any)._id; 
  const ids = toCompares.map( (input:any) => input.id ?? input._id).filter(id => !!id) 
  if(ids.filter( i => !!id && id == i ).length > 0) 
    return [{name:'', path:"_id", value:id}] as ErrProp[]; 
  return []; 
}

function IsInputDuplicate(model:MongoModel, input:any, toCompare:any[]) { 
  const indexedFields = GetIFields(model) 
    .filter( field => field?.options?.unique === true ) 
    .map( field => field.name ); 

  return indexedFields.filter( path => { 
    const value = input[path]; 
    const values = toCompare.map( i => i[path]) 
    return values.filter( v => !!v && !!value && v === value ).length > 0; 
  }).map( path => { 
    return {name:'', path, value:input[path]} as ErrProp
  }) 
} 

async function IsInputValid(model:MongoModel, input:object):Promise<ErrProp[]> { 
  try{ 
    await model.validate(input) 
    return []; 
  } catch(err) { 
    return ErrorParsing(err); 
  } 
} 

function ParsedItem(item:any): {_id:string, id:string, [key:string]:any} { 
  let parsedItem = JSON.parse(JSON.stringify(item)); 
  parsedItem._id = parsedItem._id ?? parsedItem.id ?? ''; 
  parsedItem.id = parsedItem._id; 
  return parsedItem; 
} 

async function ItemsExist(model:MongoModel, items:object[]) { 
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

function FindIds(itemIds:string[], ids:string[]) { 
  const found = ids.filter( id => itemIds.includes(id)); 
  const notFound = ids.filter( id => !itemIds.includes(id)); 
  return [{name:"ItemFound", path:"_id", value:found}, 
    {name:"ItemNotFound", path:"_id", value:notFound}] 
} 

async function GetInputsErrors(model:MongoModel, inputs:object[]) { 
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
async function GetFindItemErrors(model:MongoModel, ids:string[]) { 
  const items = ids.map( id => {return {_id:id}} ) 
  return (await ItemsExist(model, items)) 
    .map( async (e) => { 
      return !(await e).exist ? 
        [{name:"Item not found", path:'_id', value:(await e).value}] as ErrProp[]: []; 
    }) 
}

// Create -----------------------------------------------
async function GetCreateErrors(model:MongoModel, inputs:object[]) { 
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

async function Create(model:MongoModel, inputs:object[]) { 
  const createErrors = await GetCreateErrors(model, inputs); 
  for(let i=0; i<createErrors.length; i++) { 
    if((await createErrors[i]).errors.length >0) 
      return createErrors; 
  } 
  
  try { 
    return await model.create(inputs); 
  }catch(err) { 
    return err; 
  } 
} 


// Update -----------------------------------------------
async function GetUpdateErrors(model:MongoModel, inputs:object[]) { 
  const itemNotFoundErrors = (await ItemsExist(model, inputs)) 
    .map( async (e) => { 
      return !(await e).exist ? 
        [{name:"Item not found", path:'_id', value:(await e).value}] as ErrProp[]: []; 
    }) 
  const inputErrors = await GetInputsErrors(model, inputs) 

  // ignore remove required errors 

  return inputs.map( async (input, i) => { 
    return {input, errors: [...(await itemNotFoundErrors[i]), ...(await inputErrors[i])]} 
  }) 
} 
async function Update(model:MongoModel, inputs:object[]) { 
  const updateErrors = await GetUpdateErrors(model, inputs); 
  for(let i=0; i<updateErrors.length; i++) { 
    if((await updateErrors[i]).errors.length >0) 
      return updateErrors; 
  } 
  
  try { 
    const items = inputs.map( item => { 
      const {id, _id, ...parsedItem} = ParsedItem(item) 
      return {id, parsedItem}}) 
    for(let i=0; i<items.length; i++) { 
      const {id, parsedItem} = items[i]; 
      await model.updateOne({_id:id}, parsedItem); 
    } 
    const ids = items.map(i=>i.id); 
    return await model.find({_id:{$in:ids}}); 
  }catch(err) { 
    return err; 
  } 
} 



async function _Read(model:MongoModel, ids:string[]) { 
  try{ 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return await model.find(selector); 
  }catch(err) { 
    const existingIds = ((await model.find()) as {_id:ObjectId}[]) 
      .map( item => ParsedItem(item).id) 
    return FindIds(existingIds, ids); 
  } 
}

@Resolver() 
export class CrudResolver { 

  // MODEL info ...........................................
  @Query(type => ObjectScalar) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return FetchMetaModel(modelName); 
  } 
  // VALIDATE .............................................
  /*@Query(type => [Boolean]) 
  async IdsExist(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    const allItems = ((await model.find()) as {_id:ObjectId}[]) 
    return await IdsExist(allItems, ids); 
  } */

  @Query(type => [ObjectScalar]) 
  async ValidateInputs(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await GetInputsErrors(model, inputs) 
  } 

  // READ .................................................
  @Query(type => [ObjectScalar]) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await _Read(model, ids); 
  } 

  // CREATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await Create(model, inputs); 
  } 

  // UPDATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await Update(model, inputs); 
    /*const model = GetMongoModelObject(modelName); 
    if(!model) 
      return []; // should return error msg 
    const items = inputs as object as {id:string, [key:string]:any}[]; 
    for(let i=0; i<items.length; i++) { 
      await model.updateOne({_id: items[i].id}, items[i]) 
    } 
    const selector = {_id: {$in: items.map( i => i.id)} }; 
    return await model.find(selector); */
  } 

  // DELETE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    if(!model) 
      return []; // should return error msg 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    const deleted = await model.find(selector); 
    for(let i=0; i<ids.length; i++) { 
      await model.deleteOne({_id: ids[i] }) 
    } 
    return deleted; 
  } 
}




/*
async function InputsAreValid(model:MongoModel, inputs:object[]) { 
  // get inded fields 
  const indexedFields = GetIFields(model) 
    .filter( field => field?.options?.unique === true ) 
    .map( field => field.name ); 
  // test for uniqueness between inputs. 
  const validations = [] as {input:object, errors:ErrProp[]}[]; 

  for(let i=0; i<inputs.length; i++) { 
    const input = inputs[i]; 
    const errors = InputIsDuplicate(['id', '_id', ...indexedFields], input, inputs); 
    const valid = await InputIsValid(model, input); 
    if(valid?.length > 0) 
      errors.push(...valid); 
    validations.push({input, errors}); 
  } 
  return validations; 
} */
