import { getModelForClass } from '@typegoose/typegoose'; 
import { ClassType, NonEmptyArray } from "type-graphql"; 

// --------------------------------------------------------
// Feedback 
import { FEEDBACK } from '../typegoose.utils/feedback.utils'; 
// MLabel 
import { MLabel, MLabelDescriptor } from './mlabel/mlabel.model'; 
import { MLabelResolver } from './mlabel/mlabel.resolver'; 
// ModelDescription 
import { Extend_ModelDescriptor_FactoryResolver, ModelDescriptorsResolver } 
  from './modeldescriptor/modeldescriptor.factoryresolver'; 
import { ModelDescriptor } 
  from './modeldescriptor/modeldescriptor.model'; 
import { RegisterModel, SelfRegisterModelDescriptor } 
  from './modeldescriptor/modeldescriptor.utils'; 
// Crud Resolver 
import { Extend_Crud_FactoryResolver } 
  from './crud/crud.factory.resolver'; 



const feedbackdatas = Object.values(FEEDBACK); 
const MLabelPopulator = { 
  model:MLabel, 
  modelDescriptor:MLabelDescriptor as ModelDescriptor, 
  data: feedbackdatas 
} 



/** INITBASEMODELDATAS ------------------------------------
 * 
 */
export async function InitPrepping() { 
  const model = getModelForClass(ModelDescriptor); 
  
  // Reset ModelDescriptor, then register ModelDescriptor
  await model.deleteMany(); 
  await SelfRegisterModelDescriptor(); 

  await RegisterModels([MLabelPopulator]); 
  await Populate([MLabelPopulator]); 
} 



/** REGISTERMODELS ---------------------------------------- 
 * Takes a series of model class and modelDescriptor object and register them. 
 * 
 * @param modeldatas 
 */
export async function RegisterModels(modeldatas:{model:ClassType, modelDescriptor:ModelDescriptor}[]) { 
  for(let i = 0; i < modeldatas.length; i++) { 
    const model = modeldatas[i]; 
    await RegisterModel(model.model, model.modelDescriptor); 
  } 
} 



/** POPULATE ----------------------------------------------
 * 
 * @param modeldatas 
 */
export async function Populate(modeldatas:{model:ClassType, data:any[] } []) { 
  modeldatas.forEach( async populator => { 
    const model = getModelForClass(populator.model); 
    // reset data before polating 
    await model.deleteMany(); 
    await model.create(populator.data); 
    //const read = await model.find(); 
    //console.log(`${populator.model.name}: ${read.length}`); 
  }) 
} 


export function Extend_Crud_ModelDescriptor_FactoryResolvers(models:any[]) { 
  const resolvers = models.map( model => { 
    const crudresolver = Extend_Crud_FactoryResolver(model); 
    const modelresolver = Extend_ModelDescriptor_FactoryResolver(model); 
    return [crudresolver, modelresolver]; 
  }).flat() 
  return resolvers as unknown as NonEmptyArray<Function> | NonEmptyArray<string>; 
}


/** Prepping resolvers 
 * 
 */
const MLabelModelResolver = Extend_ModelDescriptor_FactoryResolver(MLabel); 
export const basicResolvers = [ 
  MLabelResolver, MLabelModelResolver, ModelDescriptorsResolver, 
] as NonEmptyArray<Function> | NonEmptyArray<string>; 