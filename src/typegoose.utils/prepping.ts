import { getModelForClass } from '@typegoose/typegoose'; 

// --------------------------------------------------------
import { MockData, RegisterModel } from './model/model.util'; 
import { FeedbackMsg } from './feedback/feedback.model'; 
import { FEEDBACK_MSG_MOCK } from './feedback/feedbacks.mockdata'; 
import { MLangLabel } from './mlang/mlanglabel.model'; 
import { TypegooseModel, TypegooseModelDatas } from './model/typegoosemodel.model'; 


export type ModelData = { 
  modelName:string, 
  model:any, 
  data:any[], 
  modelItem:TypegooseModel 
} 

export async function InitBaseModelDatas() { 
  /*[TypegooseModel, FeedbackMsg, MLangLabel].forEach( model => {
    getModelForClass(model)
  })*/
  // getModelForClass(TypegooseModel); 
  // getModelForClass(FeedbackMsg); 
  // getModelForClass(MLangLabel); 

  const feedbackdatas = Object.values(FEEDBACK_MSG_MOCK); 
  

  const modelDatas = [ 
    {modelName:'TypegooseModel', model:TypegooseModel, data: TypegooseModelDatas}, 
    {modelName:'FeedbackMsg', model:FeedbackMsg, data: feedbackdatas}, 
    {modelName:'MLangLabel', model:MLangLabel, data: []}, 
  ] as ModelData[]; 

  modelDatas.forEach( modeldata => getModelForClass(modeldata.model) ) 
  
  await MockDatas(modelDatas); 
} 


export async function RegisterModels(modeldatas:ModelData[]) { 
  modeldatas.forEach( async model => { 
    await RegisterModel(model.model, model.modelItem); 
  }) 
} 

export async function MockDatas(modeldatas:ModelData[]) { 
  modeldatas.forEach( async modeldata => { 
    const {modelName, data} = modeldata; 
    await MockData(modelName, data); 
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
