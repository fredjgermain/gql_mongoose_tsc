import { Args, Resolver, Query, Mutation } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { MongoModel, GetMongoModelObject, FetchMetaModel } from '../typegoose.utils/getmodel.util'; 
import { ValidateInputs, Create, Read, Update, Delete } from '../typegoose.utils/crud.actions'; 
import { FEEDBACK_MSG } from '../typegoose.utils/feedback'; 
import { CrudResult } from '../typegql.utils/crudresult.class'; 
import { ModelObjectType } from '../typegql.utils/model.class'; 
import { CreateArgs, FeedbackMsgArg, ModelIdsArgs, ModelNameArg, UpdateArgs } from '../typegql.utils/crud.argstypes'; 



// RESOLVER ###############################################
@Resolver() 
export class CrudResolver { 
// MODEL info ...........................................
  @Query(type => ModelObjectType) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return await FetchMetaModel(modelName); 
  } 
  
  // VALIDATEINPUTS .......................................
  @Query(type =>  CrudResult) 
  async Validate(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    const errors = await ValidateInputs(model, inputs); 
    return new CrudResult(modelName, {errors}); 
  } 

  // FEEDBACKMSG ..........................................
  @Query(type => [ObjectScalar]) 
  async FeedbackMsg(@Args() { feedbackNames }: FeedbackMsgArg) { 
    return Object.entries(FEEDBACK_MSG) 
      .filter( f => { 
        const [name] = f; 
        return feedbackNames.includes(name); 
      }) 
  } 

  // READ .................................................
  @Query(type => CrudResult) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Read(model, ids); 
    return new CrudResult(modelName, result); 
  } 

  // CREATE ...............................................
  @Mutation(type => CrudResult) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Create(model, inputs); 
    return new CrudResult(modelName, result); 
  } 

  // UPDATE ...............................................
  @Mutation(type => CrudResult) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Update(model, inputs); 
    return new CrudResult(modelName, result); 
  } 

  // DELETE ...............................................
  @Mutation(type => CrudResult) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Delete(model, ids); 
    return new CrudResult(modelName, result); 
  } 
}