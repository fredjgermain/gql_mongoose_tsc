import { 
  Field, ObjectType, 
  ID, Int, 
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation, 
} from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { MongoModel, GetMongoModelObject, FetchMetaModel } from '../typegoose.utils/getmodel.util'; 
import { ValidateInputs, GetCreateErrors, GetUpdateErrors, GetFindItemErrors, ParsedItem } from './crudvalidation'; 
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
  async ValidateInputs(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await ValidateInputs(model, inputs);  
  } 

  // FEEDBACKMSG ..........................................
  @Query(type => [ObjectScalar]) 
  async FeedbackMsg(@Args() { feedbackNames }: FeedbackMsgArg) { 
    return Object.entries(FEEDBACK_MSG) 
      .filter( f => { 
        const [name] = f; 
        console.log(feedbackNames, name); 
        return feedbackNames.includes(name); 
      }) 
  } 

  // COUNT ................................................
  @Query(type => [ObjectScalar]) 
  async Count(@Args() { modelName }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await model.find(); 
  } 

  // READ .................................................
  @Query(type => [ObjectScalar]) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return await Read(model, ids); 
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
  } 

  // DELETE ...............................................
  @Mutation(type => [ObjectScalar]) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    return Delete(model, ids); 
  } 
}

// Read ---------------------------------------------------
async function Read(model:MongoModel, ids:string[]) { 
  try{ 
    const selector = ids && ids.length > 0 ? {_id: {$in: ids} }: {}; 
    return await model.find(selector); 
  }catch(err) { 
    return await GetFindItemErrors(model, ids); 
  } 
}

// Delete -------------------------------------------------
async function Delete(model:MongoModel, ids:string[]) { 
  if(!ids || ids.length === 0) 
    return [] 
  const [found, notFound] = await GetFindItemErrors(model, ids); 
  if((notFound.value as any[]).length > 0) 
    return [found, notFound]; 

  try{ 
    const deleted = await model.find({_id: {$in: ids}}); 
    for(let i=0; i<ids.length; i++) 
      await model.deleteOne({_id: ids[i] }) 
    return deleted; 
  }catch(err) { 
    return err; 
  }
} 

// Create -----------------------------------------------
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

