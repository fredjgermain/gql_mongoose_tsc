import { getModelForClass } from '@typegoose/typegoose'; 

// --------------------------------------------------------
import { RegisterModel, GetMongoModel } from '../typegoose.utils/typegoosemodel/typegoosemodel.util'; 

// Feedback 
import { Feedback, FeedbackModelDescriptor } from '../typegoose.utils/feedback/feedback.model'; 
import { feedbackData } from '../typegoose.utils/feedback/feedbacks.data'; 
// MLangLabel 
import { MLangLabel, MLangLabelDescriptor } from '../typegoose.utils/mlang/mlanglabel.model'; 
// Typegoose 
import { TypegooseModel, TypegooseModelDescriptor } from '../typegoose.utils/typegoosemodel/typegoosemodel.model'; 

/*
x Gather class 
- Decorator for TypegooseModelDescriptions. 
x Method to Register model and create item of typegooseModel for each model ... 
- 

*/






export type Populator = { 
  modelName:string, 
  model:any, 
  data:any[], 
  modelDescriptor:TypegooseModel 
} 

export async function InitBaseModelDatas() { 
  /*[TypegooseModel, FeedbackMsg, MLangLabel].forEach( model => { 
    getModelForClass(model)
  })*/
  // getModelForClass(TypegooseModel); 
  // getModelForClass(FeedbackMsg); 
  // getModelForClass(MLangLabel); 

  const feedbackdatas = Object.values(feedbackData); 
  

  const modelDatas = [ 
    {modelName:'TypegooseModel', model:TypegooseModel, data:[], modelDescriptor:TypegooseModelDescriptor}, 
    {modelName:'FeedbackMsg', model:Feedback, data: feedbackdatas, modelDescriptor:MLangLabelDescriptor}, 
    {modelName:'MLangLabel', model:MLangLabel, data: [], modelDescriptor:FeedbackModelDescriptor}, 
  ] as Populator[]; 

  modelDatas.forEach( modeldata => getModelForClass(modeldata.model) ) 
  
  await MockDatas(modelDatas); 
} 


export async function RegisterModels(modeldatas:Populator[]) { 
  modeldatas.forEach( async model => { 
    await RegisterModel(model.model, model.modelDescriptor); 
  }) 
} 

export async function PopulateModels(modeldatas:Populator[]) { 
  modeldatas.forEach( async modeldata => { 
    const {modelName, data} = modeldata; 
    await PopulateModel(modelName, data); 
  }) 
}



/** MockData ----------------------------------------------
 * 
 * @param modelName 
 * @param data 
 */
 export async function PopulateModel(modelName:string, data:any, reset:boolean = true) { 
  try{ 
    const {model} = GetMongoModel(modelName); 
    if(!model) 
      throw new Error(`model ${modelName} not found`); 
    if(reset) 
      await model.deleteMany(); 
    await model.create(data); 
    const read = await model.find(); 
    console.log(modelName, read.length); 
  }catch(err){ 
    console.log(err); 
  } 
} 


// import { NonEmptyArray } from "type-graphql"; 


// // --------------------------------------------------------
// import { CrudResolver } from './typegql.utils/resolver'; 
// //import { CrudTestResolver } from './resolvers/crudtest.resolver'; 
// //import { RegisterModels } from './models/registermodels'; 

// //RegisterModels(); 
// export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 
// //export const Resolvers = [CrudTestResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 
