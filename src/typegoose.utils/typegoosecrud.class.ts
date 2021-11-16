import { mongoose } from "@typegoose/typegoose"; 



// -------------------------------------------------------- 
import { GetIModel, GetMongoModel, ParseDocsTo } from "./modeler.utils"; 
import { TypegooseModel } from "./typegoosemodel.class"; 
import { TypegooseValidation } from "./typegoosevalidation.class"; 



type MongoModel = mongoose.Model<any, {}, {}> 



// D for the type of documents to accept/return from Crud methods. 
export class TypegooseCrud<D extends IEntry> { 
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
    this.model = this.tgmodel.model; 
  } 



  // MODEL =============================================== 
  public async Model({modelName}:{modelName:string}) { 
    const [model] = await TypegooseModel.Models({modelNames:[modelName]}); 
    return model; 
  } 

  public async Models({modelNames}:{modelNames:string[]}) { 
    return await TypegooseModel.Models({modelNames}); 
  } 



  // VALIDATE INPUT ======================================
  public async ValidateInput(inputs:any) { 
    return await this.tgvalidation.ValidateByInputs(inputs); 
  } 


  // CREATE =============================================== 
  public async Create( inputs:Partial<D>[] ):Promise<D[]> { 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateToCreate(inputs) ); 
    // --------------------------------------------------- 
    const results = await this.mongoModel.create(inputs); 
    return results.map( e => ParseDocsTo<D>(e)); 
  } 


  // READ =============================================== 
  public async Read( ids?:string[] ):Promise<D[]> { 
    const inputs = ids?.map( id => {return {_id:id}} ) ?? []; 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateInputMustExists(inputs) ); 
    // --------------------------------------------------- 
    const selector = ids ? {_id: {$in: ids}} : {}; 
    const results = await this.mongoModel.find(selector); 
    return results.map( e => ParseDocsTo<D>(e)); 
  } 


  // UPDATE =============================================== 
  public async Update(inputs:D[]):Promise<D[]> { 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateToUpdate(inputs) ); 
    // --------------------------------------------------- 
    for(let i = 0; i < inputs.length; i++) { 
      const {_id, ...parsedItem} = inputs[i]; 
      await this.mongoModel.updateOne({_id:_id}, parsedItem); 
    } 
    // fetch modified items 
    const ids = inputs.map( item => item._id ); 
    const results = await this.mongoModel.find({_id: {$in: ids}}); 
    return results.map( e => ParseDocsTo<D>(e)); 
  }

  // DELETE =============================================== 
  public async Delete(ids:string[]):Promise<D[]> { 
    const inputs = ids.map( id => {return {_id:id}} ); 
    this.tgvalidation.ThrowIfHasError( await this.tgvalidation.ValidateInputMustExists(inputs) ); 
    // --------------------------------------------------- 
    const results = await this.mongoModel.find({_id: {$in: ids}}); 
    await this.mongoModel.deleteMany({_id: {$in: ids}}); 
    return results.map( e => ParseDocsTo<D>(e)); 
  } 
} 