import { mongoose } from "@typegoose/typegoose"; 



// -------------------------------------------------------- 
import { TypegooseModel } from "./typegoosemodel.class"; 
import { TypegooseValidation } from "./typegoosevalidation.class"; 



type MongoModel = mongoose.Model<any, {}, {}> 


export class TypegooseCrud { 
  public modelName:string; 
  public tgmodel:TypegooseModel; 
  public tgvalidation:TypegooseValidation; 
  private mongoModel: MongoModel; 
  private model: IModel; 

  constructor(modelName:string) { 
    this.modelName = this.modelName; 
    this.tgmodel = new TypegooseModel(modelName); 
    this.tgvalidation = new TypegooseValidation(modelName); 
    this.mongoModel = this.tgmodel.mongoModel; 
    this.model = this.tgmodel.imodel; 
  } 



  // MODEL =============================================== 
  /*public async Model({modelName}:{modelName:string}) { 
    const [model] = await TypegooseModel.GetIModels({modelsName:[modelName]}); 
    return model; 
  } 

  public async Models({modelsName}:{modelsName:string[]}) { 
    return await TypegooseModel.GetIModels({modelsName}); 
  } */



  // VALIDATE INPUT ======================================
  public async ValidateInput(inputs:any) { 
    return await this.tgvalidation.ValidateByInputs(inputs); 
  } 


  // CREATE =============================================== 
  public async Create( inputs:Partial<IEntry>[] ):Promise<IEntry[]> { 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateToCreate(inputs) ); 
    // --------------------------------------------------- 
    const results = await this.mongoModel.create(inputs); 
    return results.map( e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  } 


  // READ =============================================== 
  public async Read( ids?:string[] ):Promise<IEntry[]> { 
    const inputs = ids?.map( id => {return {_id:id}} ) ?? []; 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateInputMustExists(inputs) ); 
    // --------------------------------------------------- 
    const selector = ids ? {_id: {$in: ids}} : {}; 
    const results = await this.mongoModel.find(selector); 
    return results.map( e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  } 


  // UPDATE =============================================== 
  public async Update(inputs:IEntry[]):Promise<IEntry[]> { 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateToUpdate(inputs) ); 
    // --------------------------------------------------- 
    for(let i = 0; i < inputs.length; i++) { 
      const {_id, ...parsedItem} = inputs[i]; 
      await this.mongoModel.updateOne({_id:_id}, parsedItem); 
    } 
    // fetch modified items 
    const ids = inputs.map( item => item._id ); 
    const results = await this.mongoModel.find({_id: {$in: ids}}); 
    return results.map( e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  }

  // DELETE =============================================== 
  public async Delete(ids:string[]):Promise<IEntry[]> { 
    const inputs = ids.map( id => {return {_id:id}} ); 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateInputMustExists(inputs) ); 
    // --------------------------------------------------- 
    const results = await this.mongoModel.find({_id: {$in: ids}}); 
    await this.mongoModel.deleteMany({_id: {$in: ids}}); 
    return results.map( e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  } 
} 