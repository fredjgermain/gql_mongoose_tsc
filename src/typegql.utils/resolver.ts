import { Args, Resolver, Query, Mutation, Arg, NonEmptyArray } from "type-graphql"; 
import { createUnionType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 
import { Model, GetMLangLabel, GetFeedbackMsg, Validate, Create, Read, Update, Delete, ReadSubField, Subfield } 
  from '../typegoose.utils/typegoose.actions'; 
import { CrudResult, GQLModel } from './return.class'; 
import { LabelNamesArg, ModelNameArg, ModelIdsArgs, CreateArgs, UpdateArgs, ValidateArg, TestSubFieldsArg } 
  from './argstypes.class'; 

import { DummyA, DummyB } from '../models/__dummy.model'; 

const SearchResultUnion = createUnionType({ 
  name: "SearchResult", // the name of the GraphQL union 
  types: () => [DummyA, DummyB] as const, // function that returns tuple of object types classes 
}); 

const dummiesA = new DummyA()
dummiesA._id= 'asdas'; 
dummiesA.name= 'dummy a1'; 

const dummiesB = new DummyB()
dummiesB._id= 'asdas'; 
dummiesB.description= 'dummy b1'; 



// RESOLVER ###############################################
@Resolver() 
class CrudResolver { 

  //WITH UNION ??? 
  // @Query(returns => [SearchResultUnion])
  // async WithUnion(@Args() { modelName }: ModelNameArg): Promise<Array<typeof SearchResultUnion>> { 
  //   //const dummy 
  //   if(modelName === 'dummyA') 
  //     return [dummiesA] 
  //   return [dummiesB] 
  // } 

  // //NO UNION ??? 
  // @Query(returns => [ObjectScalar]) 
  // async NoUnion(@Args() { modelName }: ModelNameArg): Promise<any[]> { 
  //   //const dummy 
  //   if(modelName === 'dummyA') 
  //     return [dummiesA] 
  //   return [dummiesB] 
  // } 



  @Query(type => CrudResult) 
  async TestSubFields(@Args() { modelName, subfields }: TestSubFieldsArg):Promise<CrudResult> { 
    const {items, errors} = await Read(modelName); 
    const [item] = items ?? []; 

    const result = await ReadSubField( modelName, subfields as Subfield, item._id ?? '' ) 
    //const readsubfields = items?.map( item => await ReadSubField(modelName, subfields, item._id) ) 
    
    return new CrudResult(modelName, {items:[result], errors}); 
  } 


  @Query(type => CrudResult) 
  async Test(@Args() { modelName }: ModelNameArg) { 
    const {items, errors} = await Read(modelName); 
    return new CrudResult(modelName, {items, errors}); 
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
  async Create(@Args() { modelName, inputs, subfields: fields }: CreateArgs) { 
    const result = await Create(modelName, inputs); 
    return new CrudResult(modelName, result, fields); 
  } 
  
  // READ .................................................
  @Query(type => CrudResult) 
  async Read(@Args() { modelName, ids, subfields: fields }: ModelIdsArgs) { 
    const result = await Read(modelName, ids); 
    return new CrudResult(modelName, result, fields); 
  } 

  // UPDATE ...............................................
  @Mutation(type => CrudResult) 
  async Update(@Args() { modelName, inputs, subfields: fields }: UpdateArgs) { 
    const result = await Update(modelName, inputs); 
    return new CrudResult(modelName, result, fields); 
  } 

  // DELETE ...............................................
  @Mutation(type => CrudResult) 
  async Delete(@Args() { modelName, ids, subfields: fields }: ModelIdsArgs) { 
    const result = await Delete(modelName, ids); 
    return new CrudResult(modelName, result, fields); 
  } 
}

export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 