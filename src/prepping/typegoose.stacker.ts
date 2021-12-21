import { getModelForClass } from "@typegoose/typegoose"; 
import { TypegooseModel, ModelDoc  } from "../typegoose.utils/typegoosemodel.class"; 


// -------------------------------------------------------- 
/* These stacks contains the data and model for registration once connected to MongoDb */


const dataStack = [] as { data:any[], classItem:any }[]; 
const modelStatck = [] as ModelDoc[]; 



// Registration Decorator #################################
/*
  Cannot truly register models before connecting with Mongoose. 
  Once mongoose is connected and resolvers are mounted, call function RegisterModels above. 
  
  CAREFUL !! A Model need to be imported AND USED somewhere otherwise their decorator will not be read and the model will not be stacked. 
*/ 
export function ModelStack( documentation?:Partial<Omit<ModelDoc, "modelClass"|"accessor" >> ): ClassDecorator { 
  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const modelClass = target; 
    const modeldoc = { accessor:target.name, modelClass, description:"", label:"", ...documentation } as ModelDoc; 
    modelStatck.push(modeldoc); 
  } 
} 



/** RegisterModels ------------------------------------------------------------
 * 
 */
export function RegisterModels() { 
  modelStatck.forEach( m => TypegooseModel.RegisterModel(m) ) 
} 



/** DataToPopulate ----------------------------------------
 * Use this function after the dataset definition. 
 * The dataset will be stacked while the server connects to MongoDb. 
 * Once connected, the function "Populate" should be called
 * 
 * @param classItem // The Business model corresponding to the dataset  
 * @param data // the dataset itself 
 */
export function DataToPopulate( classItem:any, data:any[] ) { 
  dataStack.push({classItem, data}); 
} 



/** Populate ----------------------------------------------
 * Once connected to MongoDb, the stacked datasets will populate their corresponding collections.  
 */
export async function Populate() { 
  dataStack.forEach( async ({data, classItem}) => { 
    const model = getModelForClass(classItem); 
    // empty collection before populating with new dataset 
    await model.deleteMany(); 
    await model.create(data); 
  })
} 