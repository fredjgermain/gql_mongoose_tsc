import { NonEmptyArray } from "type-graphql"; 

// -------------------------------------------------------- 
import { A, B, C, 
  descriptorA, descriptorB, descriptorC, 
  dataA, dataB, dataC 
  //NestedResolver
} 
  from './dummies.model'; 
import { InitPrepping, RegisterModels, Populate, basicResolvers } 
  from '../typegql.utils/basic.prepping'; 
import { Extend_Crud_FactoryResolver } from '../typegql.utils/crud/crud.factoryresolver'; 
import { Extend_ModelDescriptor_FactoryResolver, GQLModel } 
  from '../typegql.utils/modeldescriptor/modeldescriptor.factoryresolver'; 



const populateDummies = [ 
  {model:A, modelDescriptor:descriptorA as GQLModel, data:dataA}, 
  {model:B, modelDescriptor:descriptorB as GQLModel, data:dataB}, 
  {model:C, modelDescriptor:descriptorC as GQLModel, data:dataC} 
] 



export function PreppingWithDummies() { 
  InitPrepping(); 
  RegisterModels(populateDummies); 
  Populate(populateDummies); 
} 
const AResolver = Extend_Crud_FactoryResolver(A); 
const BResolver = Extend_Crud_FactoryResolver(B); 
const CResolver = Extend_Crud_FactoryResolver(C); 
const AModelResolver = Extend_ModelDescriptor_FactoryResolver(A); 
const BModelResolver = Extend_ModelDescriptor_FactoryResolver(B); 
const CModelResolver = Extend_ModelDescriptor_FactoryResolver(C); 



export const dummiesResolvers = [
  AResolver, AModelResolver, 
  BResolver, BModelResolver, 
  CResolver, CModelResolver, 
  ...basicResolvers
] as NonEmptyArray<Function> | NonEmptyArray<string>; 

