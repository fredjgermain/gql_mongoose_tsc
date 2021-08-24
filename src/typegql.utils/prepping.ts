import { getModelForClass } from '@typegoose/typegoose'; 
import { NonEmptyArray } from "type-graphql"; 

// --------------------------------------------------------
// Feedback 
import { FEEDBACK } from '../typegoose.utils/feedback.utils'; 
// MLabel 
import { MLabel, MLabelDescriptor, MLabelResolver } from './mlabel.resolver'; 
// GQLModel 
import { ExtendFactoredModelResolver, GQLModel, GQLModelDescriptor, GQLModelResolver, RegisterGQLModel } from './gqlmodel.resolver'; 


const feedbackdatas = Object.values(FEEDBACK); 
const GQLModelPopulator = { 
  model: GQLModel, 
  modelDescriptor: GQLModelDescriptor as GQLModel, 
  data:[] 
}
const MLabelPopulator = { 
  model:MLabel, 
  modelDescriptor:MLabelDescriptor as GQLModel, 
  data: feedbackdatas 
}


export async function InitBaseModelDatas() { 
  const gqlModel = getModelForClass(GQLModel); 
  // Reset TypegooseModelData 
  await gqlModel.deleteMany(); 
  await RegisterModels([GQLModelPopulator, MLabelPopulator]); 
  await PopulateModels([MLabelPopulator]); 
} 


export async function RegisterModels(modeldatas:{model:any, modelDescriptor:GQLModel}[]) { 
  modeldatas.forEach( async model => { 
    await RegisterGQLModel(model.model, model.modelDescriptor); 
  }) 
} 


export async function PopulateModels(modeldatas:{model:any, modelDescriptor:GQLModel, data:any[] } []) { 
  modeldatas.forEach( async populator => { 
    const model = getModelForClass(populator.model); 
    // reset data before polating 
    await model.deleteMany(); 
    await model.create(populator.data); 
    const read = await model.find(); 
    console.log(`${populator.modelDescriptor.accessor}: ${read.length}`); 
  }) 
} 


const MLabelModelResolver = ExtendFactoredModelResolver(MLabel); 

export const basicResolvers = [ 
  MLabelResolver, MLabelModelResolver, GQLModelResolver, 
] as NonEmptyArray<Function> | NonEmptyArray<string>; 