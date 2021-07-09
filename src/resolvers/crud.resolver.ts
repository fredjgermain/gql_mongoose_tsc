import { 
  Field, ObjectType, 
  ID, Int, 
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation, 
} from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { MongoModel, GetMongoModelObject, FetchMetaModel } from '../typegoose.utils/getmodel.util'; 
import { ValidateInputs, Create, Read, Update, Delete } from './crudvalidation'; 
import { FEEDBACK_MSG } from './feedback'; 

@ObjectType() 
export class BaseEntity { 
  @Field(()=> ID) 
  id: string; 
} 

@ArgsType() 
class FeedbackMsgArg { 
  @Field(type => [String]) 
  feedbackNames: string[]; 
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


@Resolver() 
export class CrudResolver { 

  // MODEL info ...........................................
  @Query(type => ObjectScalar) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return FetchMetaModel(modelName); 
  } 
  
  // VALIDATEINPUTS .......................................
  @Query(type => [ObjectScalar]) 
  async Validate(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await ValidateInputs(model, inputs); 
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

  // COUNT ................................................
  /*@Query(type => [ObjectScalar]) 
  async Count(@Args() { modelName }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return (await model.find()).length; 
  } */

  // READ .................................................
  @Query(type => [ObjectScalar]) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await Read(model, ids); 
  } 

  // TEST MUTATION ........................................
  @Mutation(type => [String]) 
  async TestMutationName(@Args() { modelName }: ModelNameArg) { 
    //console.log(modelName); 
    return [modelName]; 
  } 

  // TEST MUTATION ........................................
  @Mutation(type => [String]) 
  async TestMutationArgs(@Args() { modelName, ids }: ModelIdsArgs) { 
    //console.log(modelName, ids); 
    return ids; 
  } 

  // CREATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetMongoModelObject(modelName); 
    //console.log(modelName, inputs); 
    return await Create(model, inputs); 
  } 

  // UPDATE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await Update(model, inputs); 
  } 

  // DELETE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return Delete(model, ids); 
  } 
}
