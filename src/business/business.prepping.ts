// Business import ------------------------------------------------------ 
import './models/dummies.model'; 
import './models/answer.model';
import './models/form.model';
import './models/instruction.model';
import './models/patient.model';
import './models/question.model';
import './models/responsegroup.model';

import { GetResolverStack } from "../prepping/typegql.stacker"; 
import { RegisterModels, Populate } from "../prepping/typegoose.stacker"; 



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