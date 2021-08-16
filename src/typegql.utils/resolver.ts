import { Args, Resolver, Query, Mutation, Arg } from "type-graphql"; 
import { NonEmptyArray } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 
import { Model, GetMLangLabel, GetFeedbackMsg, Validate, Create, Read, Update, Delete } from '../typegoose.utils/typegoose.actions'; 
import { CrudResult, GQLModel } from './return.class'; 
import { LabelNamesArg, ModelNameArg, ModelIdsArgs, CreateArgs, UpdateArgs, ValidateArg } from './argstypes.class'; 



// RESOLVER ###############################################
@Resolver() 
class CrudResolver { 

  @Query(type => ObjectScalar) 
  async Test(@Args() { modelName }: ModelNameArg) { 
    return {test:modelName}; 
  } 
  
  @Query(type => GQLModel) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    const {model, errors} = await Model(modelName); 
    return new GQLModel(model, errors); 
  } 
  
  // VALIDATE ..............................................
  @Query(type => CrudResult) 
  async Validate(@Args() { modelName, inputs }:ValidateArg ) { 
    const result = await Validate(modelName, inputs); 
    return new CrudResult(modelName, result); 
  } 

  // FEEDBACKMSG ..........................................
  @Query(type => [ObjectScalar]) 
  async MLangLabel(@Args() { names }: LabelNamesArg) { 
    const result = await GetMLangLabel(names); 
    return new CrudResult('MLangLabel', result); 
  } 

  // FEEDBACKMSG ..........................................
  @Query(type => [ObjectScalar]) 
  async FeedbackMsg(@Args() { names }: LabelNamesArg) { 
    const result = await GetFeedbackMsg(names); 
    return new CrudResult('FeedbackMsg', result); 
  } 

  // CREATE ...............................................
  @Mutation(type => CrudResult) 
  async Create(@Args() { modelName, inputs, fields }: CreateArgs) { 
    const result = await Create(modelName, inputs); 
    return new CrudResult(modelName, result, fields); 
  } 
  
  // READ .................................................
  @Query(type => CrudResult) 
  async Read(@Args() { modelName, ids, fields }: ModelIdsArgs) { 
    const result = await Read(modelName, ids); 
    return new CrudResult(modelName, result, fields); 
  } 

  // UPDATE ...............................................
  @Mutation(type => CrudResult) 
  async Update(@Args() { modelName, inputs, fields }: UpdateArgs) { 
    const result = await Update(modelName, inputs); 
    return new CrudResult(modelName, result, fields); 
  } 

  // DELETE ...............................................
  @Mutation(type => CrudResult) 
  async Delete(@Args() { modelName, ids, fields }: ModelIdsArgs) { 
    const result = await Delete(modelName, ids); 
    return new CrudResult(modelName, result, fields); 
  } 
}

export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 