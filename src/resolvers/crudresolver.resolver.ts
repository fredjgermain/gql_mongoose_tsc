import { 
  Field, ObjectType, 
  ID, Int, 
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation,  
} from "type-graphql"; 

//import { getModelWithString, mongoose } from "@typegoose/typegoose"; 
//import { ObjectId } from "mongodb"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { MongoModel, GetModelObject, GetModelFields } from './typegoose.util'; 


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


/*
export interface IEntry extends mongoose.Model<any, {}> { 
  _id: ObjectId; 
  [key:string]:any; 
} 
*/


interface ErrProp { 
  name: string; 
  path: string; 
  message: string; 
  value: any; 
  [key:string]: any; 
} 

interface IValidInput { 
  input: object; 
  valid:boolean | {errors:ErrProp[]}; 
} 

async function _ValidateInput(model:MongoModel, input: object) { 
  const validation = {input} as IValidInput; 
  await model.validate(input) 
  .then(res => validation.valid = true) 
  .catch(err => { 
    const errprops = Object.values(err['errors']) 
      .map( (e:any) => e['properties']) as ErrProp[]; 
    validation.valid = {errors:errprops}; 
  }) 
  return validation; 
} 


async function _Find(model:MongoModel, ids: string[]) { 
  const found = [] as any[]; 
  //const notFound = 
}


async function _Read(model:MongoModel, ids: string[]) { 
  const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
  try { 
    const result = await model.find(selector); 
    console.log(result); 
  } catch(err) { 
    // return error message ids not found. 
  } 
  //console.log(result); 
  //return result; 
} 


@Resolver() 
export class CrudResolver { 

  // MODEL info ...........................................
  @Query(type => ObjectScalar) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return GetModelFields(modelName); 
  } 

  // VALIDATE .............................................
  @Query(type => [ObjectScalar]) 
  async ValidateInputs(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetModelObject(modelName); 
    if(!model) 
      return false; // should return error msg 
    //const [item] = inputs; 
    let validations = [] as any[]; 
    for(let i=0; i<inputs.length; i++) { 
      await _ValidateInput(model, inputs[i]) 
      .then( validation => validations.push(validation)); 
    }
    return validations; 
  } 

  // READ .................................................
  @Query(type => [ObjectScalar]) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetModelObject(modelName); 
    if(!model) 
      return []; // should return error msg 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    const result = await model.find(selector); 
    console.log(result); 
    return result; 
  } 

  // CREATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetModelObject(modelName); 
    //console.log('Create', inputs) 
    if(!model) 
      return []; // should return error msg 
    const result = await model.create(inputs); 
    console.log(result); 
    return result; 
  } 

  // UPDATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetModelObject(modelName); 
    if(!model) 
      return []; // should return error msg 
    const items = inputs as object as {id:string, [key:string]:any}[]; 
    for(let i=0; i<items.length; i++) { 
      await model.updateOne({_id: items[i].id}, items[i]) 
    } 
    const selector = {_id: {$in: items.map( i => i.id)} }; 
    return await model.find(selector); 
  } 

  // DELETE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetModelObject(modelName); 
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