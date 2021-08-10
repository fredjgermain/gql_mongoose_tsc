import { GetMongoModel } from '../typegoose.utils/model/model.util'; 
import { mockDatas } from './mockdata'; 


export async function RegisterModel() { 

} 

export async function MockDatas() { 
  const {TypegooseModelDatas, ...otherCollections} = mockDatas; 
  await MockCollection('TypegooseModel'); 
  
  TypegooseModelDatas.forEach( async collection => {
    //console.log(collection.accessor) 
    await MockCollection(collection.accessor) 
  })
} 


export async function MockCollection(modelName:string) { 
  try{ 
    const data = (mockDatas as any)[modelName+'Datas']; 
    const {model} = GetMongoModel(modelName); 
    if(!model) 
      throw new Error(`model ${modelName} not found`); 
    await model.deleteMany(); 
    await model.create(data); 
    const read = await model.find(); 
    console.log(modelName, read.length); 
  }catch(err){ 
    console.log(err); 
  } 
}