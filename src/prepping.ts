import { ClassType, Field, ID, Int, 
  Resolver, Query, Mutation, Arg, NonEmptyArray, InputType } 
  from "type-graphql"; 


// --------------------------------------------------------
import { CrudResolver } from './resolvers/crudresolver.resolver'; 
import { RegisterModels } from './modeling'; 

RegisterModels(); 
export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 

