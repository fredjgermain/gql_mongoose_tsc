import { InitBaseModelDatas, MockDatas, RegisterModels,  } from '../typegql.utils/prepping'; 
import { modelDatas } from './mockdata'; 


export async function InitMockDatas() { 
  console.log('InitMock'); 
  InitBaseModelDatas(); 

  RegisterModels(modelDatas); 
  MockDatas(modelDatas); 
  console.log('InitMock done ...');
} 
