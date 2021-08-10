import { Args, Resolver, Query, Mutation } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 
import { Model, Validate, Create, Read, Update, Delete } from '../typegoose.utils/typegoose.actions'; 
//import { ValidateInputs } from '../typegoose.utils/validation/validations.utils'; 
import { FEEDBACK_MSG, FetchFeedbackMsg } from '../typegoose.utils/feedback/feedback.utils'; 
import { CrudResult, GQLError, GQLModel, GQLModelError } from './return.class'; 
import { FeedbackMsgArg, ModelNameArg, ModelIdsArgs, CreateArgs, UpdateArgs, ValidateArg } from './argstypes'; 
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 


class TestError extends Error { 
  errors:ErrProp[]; 
}

// RESOLVER ###############################################
@Resolver() 
export class CrudResolver { 
  
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