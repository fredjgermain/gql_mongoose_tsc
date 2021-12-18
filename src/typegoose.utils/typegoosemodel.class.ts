import { mongoose } from "@typegoose/typegoose"; 


// -------------------------------------------------------- 
// import { GetIModel, GetMongoModel, ParseDocsTo } from "./modeler.utils"; 
import { GetDefaultValue } from "../../lib/utils";


type MongoModel = mongoose.Model<any, {}, {}> 
type PredicateDoc = {modelName:string, predicate?:(e:any, i:number, a:any[]) => boolean}; 


export class TypegooseModel { 
  public modelName:string; 
  public mongoModel: MongoModel; 
  public model: IModel; 

  constructor(modelName:string) { 
    this.modelName = modelName; 
    this.mongoModel = TypegooseModel.GetMongoModel(modelName); 
    this.model = TypegooseModel.GetIModel(modelName); 
  } 

  // GetMongoModel ===========================================
  public static GetMongoModel(modelName:string):MongoModel { 
    return mongoose.models[modelName]; 
  } 

  // Find Entries --------------------------------------------
  public async FindEntries({modelName, predicate = () => true }:PredicateDoc) { 
    const mongoModel = TypegooseModel.GetMongoModel(modelName); 
    return (await mongoModel.find()).filter(predicate).map(e => TypegooseModel.ParseDocsTo<IEntry>(e)); 
  } 

  public static ParseDocsTo<T>(doc:any):T { 
    return JSON.parse(JSON.stringify(doc)) 
  } 

  // GetIModels ============================================== 
  public static GetIModel(accessor:string) { 
    const mongoModel = mongoose.models[accessor]; 
    if(!mongoModel) return {} as IModel; 
    const [_mongoField] = Object.values(mongoModel.schema.paths) as any[]; 
    const mongoFields = Object.values(mongoModel.schema.paths) as any[] as IMongoField[]; 
    const ifields = mongoFields.map( field => TypegooseModel.ParseToIField(field) ) 
    const label = [] as string[]; 
    const description = [] as string[]; 
    return { accessor, label, description, ifields} as IModel; 
  } 

  public static async GetIModels({modelsName}:{modelsName:string[]}):Promise<IModel[]> { 
    return modelsName.map( accessor => TypegooseModel.GetIModel(accessor) ); 
  } 

  public static ParseToIField(mongoField:IMongoField):IField { 
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

