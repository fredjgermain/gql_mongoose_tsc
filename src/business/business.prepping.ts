// Business import ------------------------------------------------------ 
import './models/dummies.model'; 

import { GetResolverStack } from "../typegql.utils/resolverstack"; 
import { RegisterModels, Populate } from "../typegoose.utils/modelregister"; 


/** Prepping ----------------------------------------------
 * Gets ResolverStack 
 * Gets Stack Models and registers them with RegisterModels. 
 * Gets Stacked Data and populated them with Populate. 
 * Returns the ResolverStack. 
 */
export function Prepping() { 
  const resolvers = GetResolverStack(); 
  
  RegisterModels(); 
  Populate(); 
  
  return resolvers; 
}