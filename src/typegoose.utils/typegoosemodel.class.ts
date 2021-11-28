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
  public static async Models({modelsName}:{modelsName:string[]}):Promise<IModel[]> { 
    return await TypegooseModel.GetAsyncIModels({modelsName}); 
  } 
  
  // TEMPORARY ??
  private static async GetAsyncIModels({modelsName}:{modelsName:string[]}):Promise<IModel[]> { 
    const model = GetMongoModel('ModelDescriptor'); 
    if(!model) 
      return [] as IModel[]; 
    const imodels = (await model.find()) 
      .map( e => ParseDocsTo<IModel>(e) ) 
      .filter( model => modelsName.includes(model.accessor) ); 
    return imodels; 
  } 

  private static GetIModels({modelsName}:{modelsName:string[]}):IModel[] { 
    return modelsName.map(modelName => GetIModel(modelName) ) 
  } 
} 

