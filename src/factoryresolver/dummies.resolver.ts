import { NonEmptyArray } from "type-graphql"; 

// -------------------------------------------------------- 
import { A, B, C, 
  descriptorA, descriptorB, descriptorC, 
  dataA, dataB, dataC 
  //NestedResolver
} 
  from './dummies.model'; 
import { InitBaseModelDatas, RegisterModels, PopulateModels, basicResolvers } 
  from '../typegql.utils/prepping'; 
import { ExtendFactoredResolver } from '../typegql.utils/crud.resolver'; 
import { ExtendFactoredModelResolver, GQLModel } 
  from '../typegql.utils/gqlmodel.resolver'; 



const populateDummies = [ 
  {model:A, modelDescriptor:descriptorA as GQLModel, data:dataA}, 
  {model:B, modelDescriptor:descriptorB as GQLModel, data:dataB}, 
  {model:C, modelDescriptor:descriptorC as GQLModel, data:dataC} 
] 



export function PreppingWithDummies() { 
  InitBaseModelDatas(); 
  RegisterModels(populateDummies); 
  PopulateModels(populateDummies); 
} 
const AResolver = ExtendFactoredResolver(A); 
const BResolver = ExtendFactoredResolver(B); 
const CResolver = ExtendFactoredResolver(C); 
const AModelResolver = ExtendFactoredModelResolver(A); 
const BModelResolver = ExtendFactoredModelResolver(B); 
const CModelResolver = ExtendFactoredModelResolver(C); 



export const dummiesResolvers = [
  AResolver, AModelResolver, 
  BResolver, BModelResolver, 
  CResolver, CModelResolver, 
  ...basicResolvers
] as NonEmptyArray<Function> | NonEmptyArray<string>; 

