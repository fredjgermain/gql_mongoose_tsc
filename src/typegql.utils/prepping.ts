import { getModelForClass } from '@typegoose/typegoose'; 

// --------------------------------------------------------
// Feedback 
import { FEEDBACK } from '../typegoose.utils/feedback.utils'; 
// MLabel 
import { MLabel, MLabelDescriptor, MLabelResolver } from './mlabel.resolver'; 
// GQLModel  
import { GQLModel, GQLModelDescriptor, ExtendFactoredModelResolver, RegisterGQLModel } from './gqlmodel.resolver'; 

// Resolvers 
// import { ModelResolver } from './model.resolver'; 


/* 
 x Gather class 
 - Decorator for TypegooseModelDescriptions. 
 x Method to Register model and create item of typegooseModel for each model ... 
 - Gather and export Resolvers. 
*/ 


export type Populator = { 
  model:any, 
  modelDescriptor:GQLModel, 
  data:any[], 
} 

const feedbackdatas = Object.values(FEEDBACK); 
const minimalPopulators = [ 
  { 
    model: GQLModel, 
    modelDescriptor: GQLModelDescriptor, 
    data:[] 
  }, 
  { 
    model:MLabel, 
    modelDescriptor:MLabelDescriptor, 
    data: feedbackdatas 
  }, 
] as Populator[]; 


export async function InitBaseModelDatas() { 
  const gqlModel = getModelForClass(GQLModel); 
  // Reset TypegooseModelData 
  await gqlModel.deleteMany(); 
  await RegisterModels(minimalPopulators); 
} 


export async function RegisterModels(modeldatas:Populator[]) { 
  modeldatas.forEach( async model => { 
    await RegisterGQLModel(model.model, model.modelDescriptor); 
  }) 
} 


export async function PopulateModels(modeldatas:Populator[]) { 
  modeldatas.forEach( async populator => { 
    const model = getModelForClass(populator.model); 
    // reset data before polating 
    await model.deleteMany(); 
    await model.create(populator.data); 
    const read = await model.find(); 
    console.log(`${populator.modelDescriptor.accessor}: ${read.length}`); 
  }) 
} 



// import { NonEmptyArray } from "type-graphql"; 


// // --------------------------------------------------------
// import { CrudResolver } from './typegql.utils/resolver'; 
// //import { CrudTestResolver } from './resolvers/crudtest.resolver'; 
// //import { RegisterModels } from './models/registermodels'; 

// //RegisterModels(); 
// export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 
// //export const Resolvers = [CrudTestResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 
