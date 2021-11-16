import { mongoose } from "@typegoose/typegoose"; 



// -------------------------------------------------------- 
import { GetIModel, GetMongoModel, ParseDocsTo } from "./modeler.utils"; 



type MongoModel = mongoose.Model<any, {}, {}> 



export class TypegooseModel { 
  public modelName:string; 
  public mongoModel: MongoModel; 
  public model: IModel; 

  constructor(modelName:string) { 
    this.modelName = modelName; 
    this.mongoModel = GetMongoModel(modelName); 
    this.model = GetIModel(modelName); 
  } 


  // MODELS ============================================== 
  public static async Models({modelNames}:{modelNames:string[]}):Promise<IModel[]> { 
    return await TypegooseModel.GetAsyncIModels({modelNames}); 
  } 
  
  // TEMPORARY ??
  private static async GetAsyncIModels({modelNames}:{modelNames:string[]}):Promise<IModel[]> { 
    const model = GetMongoModel('ModelDescriptor'); 
    if(!model) 
      return [] as IModel[]; 
    const imodels = (await model.find()) 
      .map( e => ParseDocsTo<IModel>(e) ) 
      .filter( model => modelNames.includes(model.accessor) ); 
    return imodels; 
  } 

  private static GetIModels({modelNames}:{modelNames:string[]}):IModel[] { 
    return modelNames.map(modelName => GetIModel(modelName) ) 
  } 
} 

