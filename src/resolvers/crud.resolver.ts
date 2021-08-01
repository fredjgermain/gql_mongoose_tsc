import { 
  Field, ObjectType, 
  ID, Int, 
  ArgsType, Arg, Args, 
  Resolver, Query, Mutation, 
} from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 
import { MongoModel, GetMongoModelObject, FetchMetaModel } from '../typegoose.utils/getmodel.util'; 
import { ValidateInputs, Create, Read, Update, Delete } from './crud.actions'; 
import { FEEDBACK_MSG } from './feedback'; 


// ARGSTYPES ############################################## 
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



@ObjectType() 
export class CrudResult { 
  @Field() 
  modelName: string; 
  
  @Field() 
  count: number; 

  @Field(type => [String]) 
  ids: string[]; 

  @Field(type => [ObjectScalar]) 
  items: object[]; 

  @Field(type => [ObjectScalar]) 
  abbrevs: {_id:string, abbrev:string}[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  errors: object[]; 
} 


@ObjectType() 
export class Model { 
  @Field() 
  accessor: string; 
  
  @Field(type => [String]) 
  label: string[]; 

  @Field(type => [String]) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 
} 



/** NewCrudResult
 * 
 * @param model 
 * @param inputs 
 * @returns 
 */
function NewCrudResult(modelName:string, result:{items?:any[], errors?:any[]}): CrudResult { 
  const {items, errors} = result; 
  const ids = items?.map( item => item._id ?? item.id ) ?? []; 
  const count = ids.length; 
  const abbrevs = [] as {_id:string, abbrev:string}[]; 
  return { modelName, count, ids, items:(items??[]), abbrevs, errors:(errors??[])}; 
} 


// RESOLVER ###############################################
@Resolver() 
export class CrudResolver { 
// MODEL info ...........................................
  @Query(type => Model) 
  async Model(@Args() { modelName }: ModelNameArg) { 
    return await FetchMetaModel(modelName); 
  } 
  
  // VALIDATEINPUTS .......................................
  @Query(type =>  CrudResult) 
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

  // READ .................................................
  @Query(type => CrudResult) 
  async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Read(model, ids); 
    return NewCrudResult(model.name, result); 
  } 

  // CREATE ...............................................
  @Mutation(type => CrudResult) 
  async Create(@Args() { modelName, inputs }: CreateArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Create(model, inputs); 
    return NewCrudResult(model.name, result); 
  } 

  // UPDATE ...............................................
  @Mutation(type => CrudResult) 
  async Update(@Args() { modelName, inputs }: UpdateArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Update(model, inputs); 
    return NewCrudResult(model.name, result); 
  } 

  // DELETE ...............................................
  @Mutation(type => CrudResult) 
  async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
    const model = GetMongoModelObject(modelName); 
    const result = await Delete(model, ids); 
    return NewCrudResult(model.name, result); 
  } 
}


// @Resolver() 
// export class CrudResolver { 

//   @Query(type => CrudResult) 
//   async Test(@Args() { modelName, ids }: ModelIdsArgs) { 
//     const result = { 
//       count: 1, 
//       modelName: 'test', 
//       ids:['test'], 
//       items: [{_id:'stes', firstname:'some first name', lastname:'some last name'}], 
//       abbrevs: [{_id:'thisid', abbrev:'first last name'}], 
//     } as CrudResult; 
//     return result; 
//   }


//   // MODEL info ...........................................
//   @Query(type => ObjectScalar) 
//   async Model(@Args() { modelName }: ModelNameArg) { 
//     return await FetchMetaModel(modelName); 
//   } 
  
//   // VALIDATEINPUTS .......................................
//   @Query(type => [ObjectScalar]) 
//   async Validate(@Args() { modelName, inputs }: UpdateArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     return await ValidateInputs(model, inputs); 
//   } 

//   // FEEDBACKMSG ..........................................
//   @Query(type => [ObjectScalar]) 
//   async FeedbackMsg(@Args() { feedbackNames }: FeedbackMsgArg) { 
//     return Object.entries(FEEDBACK_MSG) 
//       .filter( f => { 
//         const [name] = f; 
//         return feedbackNames.includes(name); 
//       }) 
//   } 

//   // COUNT ................................................
//   /*@Query(type => [ObjectScalar]) 
//   async Count(@Args() { modelName }: ModelIdsArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     return (await model.find()).length; 
//   } */

//   // READ .................................................
//   @Query(type => [ObjectScalar]) 
//   async Read(@Args() { modelName, ids }: ModelIdsArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     return await Read(model, ids); 
//   } 

//   // TEST MUTATION ........................................
//   @Mutation(type => [String]) 
//   async TestMutationName(@Args() { modelName }: ModelNameArg) { 
//     //console.log(modelName); 
//     return [modelName]; 
//   } 

//   // TEST MUTATION ........................................
//   @Mutation(type => [String]) 
//   async TestMutationArgs(@Args() { modelName, ids }: ModelIdsArgs) { 
//     //console.log(modelName, ids); 
//     return ids; 
//   } 

//   // CREATE ...............................................
//   @Mutation(type => [ObjectScalar]) 
//   async Create(@Args() { modelName, inputs }: CreateArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     //console.log(modelName, inputs); 
//     return await Create(model, inputs); 
//   } 

//   // UPDATE ...............................................
//   @Mutation(type => [ObjectScalar]) 
//   async Update(@Args() { modelName, inputs }: UpdateArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     return await Update(model, inputs); 
//   } 

//   // DELETE ...............................................
//   @Mutation(type => [ObjectScalar]) 
//   async Delete(@Args() { modelName, ids }: ModelIdsArgs) { 
//     const model = GetMongoModelObject(modelName); 
//     return Delete(model, ids); 
//   } 
// }
