

import { 
  ClassType, Field, ObjectType, InputType, 
  ID, Int,  
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation, NonEmptyArray 
} from "type-graphql"; 

import { getModelWithString, mongoose } from "@typegoose/typegoose"; 
import { ObjectId } from "mongodb"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 



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

function GetModel(modelName:string) { 
  return getModelWithString(modelName); 
} 

export interface IEntry extends mongoose.Model<any, {}> { 
  _id: ObjectId; 
  [key:string]:any; 
} 


@Resolver() 
export class CrudResolver { 

  // MODEL info ...........................................
  @Query(type => ObjectScalar) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return mongoose.models[modelName].schema.paths; 
  } 

  // VALIDATE .............................................
  @Query(type => [ObjectScalar]) 
  async Validate(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetModel(modelName); 
    if(!model) 
      return false; // should return error msg 
    const [item] = inputs; 
    let validations = [] as any[]; 
    for(let i=0; i<inputs.length; i++) { 
      await model.validate(item) 
      .then(res => validations.push({valid:true})) 
      .catch(err => validations.push({error:err['errors']})) 
    } 
    return validations; 
  } 

  // READ .................................................
  @Query(type => [ObjectScalar]) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetModel(modelName); 
    if(!model) 
      return []; // should return error msg 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return await model.find(selector); 
  } 

  // CREATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetModel(modelName); 
    if(!model) 
      return []; // should return error msg 
    return await model.create(inputs); 
  } 

  // UPDATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetModel(modelName); 
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
    const model = GetModel(modelName); 
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