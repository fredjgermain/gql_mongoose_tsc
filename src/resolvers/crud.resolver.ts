import { Args, Resolver, Query, Mutation } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../typegql.utils/customscalar'; 
import { Model, Create, Read, Update, Delete } from '../typegoose.utils/crud.actions'; 
//import { ValidateInputs } from '../typegoose.utils/validation/validations.utils'; 
import { FEEDBACK_MSG, FetchFeedbackMsg } from '../typegoose.utils/feedback/feedback.utils'; 
import { CrudResult } from '../typegql.utils/crudresult.class'; 
import { GQLModel } from '../typegql.utils/model.class'; 
import { CreateArgs, FeedbackMsgArg, ModelIdsArgs, ModelNameArg, UpdateArgs } from '../typegql.utils/crud.argstypes'; 



// RESOLVER ###############################################
@Resolver() 
export class CrudResolver { 
// MODEL info ...........................................
  @Query(type => GQLModel) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return await Model(modelName); 
  } 
  
  // VALIDATE ..............................................
  // @Query(type =>  CrudResult) 
  // async Validate(@Args() { modelName, inputs, fields }: UpdateArgs) { 
    
  //   // replace with a real function  !!!!!!!!!!!!!! 
  //   const {model, modelNotFoundError} = {model:GetMongoModelObject(modelName), modelNotFoundError:{} } 
  //   // -------------------------------------------- 

  //   const errors = await ValidateInputs(model, inputs); 
  //   return new CrudResult(modelName, {errors}, fields); 
  // } 

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
  async Read(@Args() { modelName, ids, fields }: ModelIdsArgs) { 
    const result = await Read(modelName, ids); 
    return new CrudResult(modelName, result, fields); 
  } 

  // CREATE ...............................................
  @Mutation(type => CrudResult) 
  async Create(@Args() { modelName, inputs, fields }: CreateArgs) { 
    const result = await Create(modelName, inputs); 
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