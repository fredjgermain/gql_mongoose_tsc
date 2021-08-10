import { Args, Resolver, Query, Mutation } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../typegql.utils/customscalar'; 
import { Model, Validate, Create, Read, Update, Delete } from '../typegoose.utils/typegoose.actions'; 
//import { ValidateInputs } from '../typegoose.utils/validation/validations.utils'; 
import { FEEDBACK_MSG, FetchFeedbackMsg } from '../typegoose.utils/feedback/feedback.utils'; 
import { CrudResult, GQLModel } from '../typegql.utils/return.class'; 
import { FeedbackMsgArg, ModelNameArg, ModelIdsArgs, CreateArgs, UpdateArgs, ValidateArg } from '../typegql.utils/argstypes'; 



// RESOLVER ###############################################
@Resolver() 
export class CrudResolver { 
// MODEL info ...........................................
  @Query(type => GQLModel) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return await Model(modelName); 
  } 
  
  // VALIDATE ..............................................
  @Query(type => CrudResult) 
  async Validate(@Args() { modelName, inputs }:ValidateArg ) { 
    return await Validate(modelName, inputs); 
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