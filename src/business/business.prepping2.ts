// Business import ------------------------------------------------------ 
import './models/dummies.model'; 

import { GetResolverStack } from "../typegql.utils/resolverstack"; 
import { RegisterModels, Populate } from "../typegoose.utils/modelregister"; 

export function Prepping() { 
  const resolvers = GetResolverStack(); 
  console.log(resolvers); 

  
  RegisterModels(); 
  Populate(); 
  
  return resolvers; 
}