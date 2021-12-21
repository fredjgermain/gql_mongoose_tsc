import { mongoose, getModelForClass } from "@typegoose/typegoose"; 


// -------------------------------------------------------- 
import { GetDefaultValue } from "../../lib/utils"; 



export type ModelDoc = { modelClass:any, accessor:string, label:string, description:string } 
type MongoModel = mongoose.Model<any, {}, {}> 
type PredicateDoc = {modelName:string, predicate?:(e:any, i:number, a:any[]) => boolean}; 



export class TypegooseModel { 
  private static _registeredIModels = [] as IModel[]; 

  public modelName:string; 
  public mongoModel: MongoModel; 
  public imodel: IModel; 

  constructor(modelName:string) { 
    this.modelName = modelName; 
    this.mongoModel = mongoose.models[modelName]; 
    this.imodel = TypegooseModel.GetRegisteredIModel(modelName); 
  } 


  /** RegisterModel ---------------------------------------------
   * Takes in a set of model documentation to register Business models as both mongoModel and IModel 
   * 
   * @param modelDoc // model documentation to build IModel 
   */
  public static RegisterModel(modelDoc:ModelDoc) { 
    // Get/Register MongoModel 
    const mongoModel = getModelForClass(modelDoc.modelClass); 

    // parse ifield from mongo model to add them to IModel 
    const [_mongoField] = Object.values(mongoModel.schema.paths) as any[]; 
    const mongoFields = Object.values(mongoModel.schema.paths) as any[] as IMongoField[]; 
    const ifields = mongoFields.map( field => TypegooseModel.ParseToIField(field) ) 

    // build and register IModel 
    const {accessor, label, description} = modelDoc; 
    const imodel = {accessor, label, description, ifields} as IModel; 
    TypegooseModel._registeredIModels.push(imodel); 
  } 

  // Find Entries --------------------------------------------
  public static async FindEntries({modelName, predicate = () => true }:PredicateDoc) { 
    const mongoModel = mongoose.models[modelName]; 
    return (await mongoModel.find()).filter(predicate).map(e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  } 

  public static ParseDocsTo<T>(doc:any):T { 
    return JSON.parse(JSON.stringify(doc)) 
  } 

  // GetIModels ============================================== 
  public static GetRegisteredIModels(modelNames?:string[]):IModel[] { 
    if(!modelNames) 
      return TypegooseModel._registeredIModels 
    return TypegooseModel._registeredIModels.filter( m => modelNames.includes(m.accessor) ) 
  } 

  public static GetRegisteredIModel(modelName:string):IModel { 
    return TypegooseModel._registeredIModels.find( m => m.accessor === modelName ) ?? {} as IModel; 
  } 



  // Parsing methods 
  private static ParseToIField(mongoField:IMongoField):IField { 
    const {path, instance, options, $embeddedSchemaType, validators} = mongoField; 
    const type = TypegooseModel.ParseToIType(mongoField); 
    const readableEditable = TypegooseModel.AddEditableOrReadableOptions(mongoField); 

    return { 
      accessor: path ?? '', 
      label: options?.label ?? '', 
      isRef: !!options?.ref, 
      validators, 
      options:{ ...options, ...readableEditable}, 
      type, 
    } 
  } 

  private static ParseToIType(mongoField:IMongoField): IType { 
    const {instance, options, $embeddedSchemaType} = mongoField; 
    const type = {} as IType; 

    type.name = (options?.ref ?? $embeddedSchemaType?.instance ?? mongoField.instance ?? '').toLowerCase(), 
    type.enums = options?.enum; 
    type.isEnum = !!type.enums; 
    type.isArray = instance.toLowerCase() === 'array' || !!options?.isArray; 
    type.isObject = !!options?.ref; 
    type.isScalar = !type.isArray && !type.isObject; 
    type.defaultValue = options?.defaultValue ?? options?.default ?? GetDefaultValue(type.name); 
    return type; 
  } 

  private static AddEditableOrReadableOptions(mongoField:IMongoField) { 
    const readable = mongoField.options?.readable ?? !['__v'].includes(mongoField.path); 
    const editable = mongoField.options?.editable ?? !['_id', '__v'].includes(mongoField.path); 
    return {readable, editable}; 
  }   
} 

