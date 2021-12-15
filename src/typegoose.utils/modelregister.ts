import { getModelForClass } from "@typegoose/typegoose"; 
import { ParseToIField } from "./modeler.utils"; 
//import { ClassType } from 'type-graphql'; 


const dataStack = [] as { data:any[], classItem:any }[]; 
const modelStatck = [] as { imodel:IModel, classItem:any }[]; 



// get IModel from modelStack 
export function GetIModel(accessor:string):IModel|undefined { 
  return modelStatck.find( ({imodel: model}) => model.accessor === accessor )?.imodel; 
} 



export function RegisterModels() { 
  modelStatck.forEach( ({imodel, classItem} ) => { 
    const mongoModel = getModelForClass(classItem); 

    // parse ifield from mongo model and complete imodel 
    const [_mongoField] = Object.values(mongoModel.schema.paths) as any[]; 
    const mongoFields = Object.values(mongoModel.schema.paths) as any[] as IMongoField[]; 
    const ifields = mongoFields.map( field => ParseToIField(field) ) 
    imodel.ifields = ifields; 
  }) 
} 



// Registration Decorator ------------------------------------------- 
/*
  Cannot truly register models before connecting with Mongoose. 
  Once mongoose is connected and resolvers are mounted, call function RegisterModels above. 
  
  CAREFUL !! A Model need to be imported AND USED somewhere otherwise their decorator will not be read and the model will not be stacked. 
*/ 
export function Registeration( documentation?:Partial<Omit<IModel, "accessor" | "ifields">> ): ClassDecorator { 

  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const classItem = target; 
    const imodel = {accessor:target.name, ifields:[], label:[], description:[], ...documentation } as IModel; 
    modelStatck.push({imodel, classItem}); 
  } 
} 

export function DataToPopulate( classItem:any, data:any[] ) { 
  dataStack.push({classItem, data}); 
} 

export async function Populate() { 
  dataStack.forEach( async ({data, classItem}) => { 
    const model = getModelForClass(classItem); 
    // reset data before polating 
    await model.deleteMany(); 
    await model.create(data); 
  })
} 