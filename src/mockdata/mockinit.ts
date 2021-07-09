import { GetMongoModelObject } from '../typegoose.utils/getmodel.util'; 
import { mockDatas } from './mockdata'; 


export async function RegisterModel() { 

} 

export async function MockDatas() { 
  const {MetaCollectionDatas, ...otherCollections} = mockDatas; 
  await MockCollection('MetaCollection'); 
  
  MetaCollectionDatas.forEach( async collection => 
    await MockCollection(collection.accessor) 
  )
} 

export async function MockCollection(modelName:string) { 
  const data = (mockDatas as any)[modelName+'Datas']; 
  console.log(data); 
  const model = GetMongoModelObject(modelName); 
  //await model.deleteMany(); 
  try{ 
    await model.deleteMany(); 
    await model.create(data); 
    const read = await model.find(); 
    console.log(read.length); 
  }catch(err){ 
    console.log(err); 
  }

  
  
}