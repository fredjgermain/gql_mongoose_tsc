import { InitPrepping, MockDatas, RegisterModels,  } from '../typegql.utils/basic.prepping'; 
import { modelDatas } from './mockdata'; 


export async function InitMockDatas() { 
  console.log('InitMock'); 
  InitPrepping(); 

  RegisterModels(modelDatas); 
  MockDatas(modelDatas); 
  console.log('InitMock done ...');
} 
