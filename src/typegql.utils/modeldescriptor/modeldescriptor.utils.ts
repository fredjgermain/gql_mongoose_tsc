import { getModelForClass } from "@typegoose/typegoose"; 

// -------------------------------------------------------- 
import { ModelDescriptor } from './modeldescriptor.model'; 
import { GetMongoModel } from "../../typegoose.utils/typegoosemodel.util"; 


/// Add self Registration with Reset ... 

export const modelDescriptor = { 
  //_id: new mongoose.Types.ObjectId(), 
  accessor:'GQLModel', 
  label:['GQLModel'], 
  description: [''], 
} 



export async function SelfRegisterModelDescriptor() { 
  const model = getModelForClass(ModelDescriptor); 
  await model.deleteMany(); // reset ModelDescriptor 
  await model.create(modelDescriptor); 
} 


/** RegisterGQLModel ---------------------------------------------------- 
 * Register a model and add its model description to the GQLModel collection. 
 * 
 * @param toRegister 
 * @param modelDescriptor 
 * @returns 
 */
 export async function RegisterModel( toRegister:any, modelDescriptor:ModelDescriptor ) { 
  const gqlModel = getModelForClass(ModelDescriptor); 
  getModelForClass(toRegister); 
  const {model} = GetMongoModel(modelDescriptor.accessor); 
  if(!model) 
    return; 
  await gqlModel.create(modelDescriptor); 
} 
