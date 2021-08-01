import { NonEmptyArray } 
  from "type-graphql"; 


// --------------------------------------------------------
import { CrudResolver } from './resolvers/crud.resolver'; 
//import { CrudTestResolver } from './resolvers/crudtest.resolver'; 
import { RegisterModels } from './models/modeling'; 

RegisterModels(); 
export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 
//export const Resolvers = [CrudTestResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 

