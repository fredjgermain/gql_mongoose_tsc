import { modelNames } from 'mongoose'; 

// --------------------------------------------------------
import { ErrMsgModel } from '../metamodels/errmsg.model'; 
import { MongoModel, GetMongoModelObject } from '../typegoose.utils/getmodel.util'; 

interface ErrProp { 
  name: string; 
  path: string; 
  message: string; 
  value: any; 
  [key:string]: any; 
} 
export async function GetErrMsg(modelName:string, errProp:ErrProp) { 
  const selector = {name: errProp.name} 
  const errMsg = await ErrMsgModel.find(selector); 
  console.log(errMsg); 
} 

export async function Validate(model:MongoModel, item:any) { 
  await model.validate(item) 
    .then(res => { 
      // replace with feedback messages ... 
      return {valid:true} 
    }) 
    .catch(err => { 
      const errProps = Object.values(err['errors']).map( (e:any) => e['properties']); 
      return errProps.map( errProp => GetErrMsg(model.baseModelName??'', errProp) ) 
    }); 
}