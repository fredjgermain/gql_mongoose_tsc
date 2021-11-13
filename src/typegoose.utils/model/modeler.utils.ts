import { mongoose } from "@typegoose/typegoose";

// -------------------------------------------------------- 
import { GetDefaultValue } from '../../../lib/utils/type.utils'; 



type MongoModel = mongoose.Model<any, {}, {}> 

export function GetMongoModel(modelName:string):MongoModel { 
  return mongoose.models[modelName]; 
} 

type TFindDoc = {modelName:string, predicate?:(e:any, i:number, a:any[]) => boolean}; 
export async function FindEntries({modelName, predicate = () => true }:TFindDoc) { 
  const mongoModel = GetMongoModel(modelName); 
  return (await mongoModel.find()).filter(predicate).map(e => ParseFromDoc(e)); 
} 

function ParseFromDoc(docs:any):IEntry { 
  return JSON.parse(JSON.stringify(docs)); 
} 

export function GetIModel(accessor:string):IModel|undefined { 
  const mongoModel = mongoose.models[accessor]; 
  if(!mongoModel) return; 
  const [_mongoField] = Object.values(mongoModel.schema.paths) as any[];   
  const mongoFields = Object.values(mongoModel.schema.paths) as any[] as IMongoField[]; 
  const ifields = mongoFields.map( field => ParseToIField(field) ) 
  const label = [] as string[]; 
  const description = [] as string[]; 
  return { accessor, label, description, ifields} as IModel; 
} 


function ParseToIField(mongoField:IMongoField):IField { 
  const {path, instance, options, $embeddedSchemaType, validators} = mongoField; 
  const type = ParseToIType(mongoField); 
  const readableEditable = AddEditableOrReadableOptions(mongoField); 

  //console.log(mongoField.validators); 

  return { 
    accessor: path ?? '', 
    label: options?.label ?? '', 
    isRef: !!options?.ref, 
    validators, 
    options:{ ...options, ...readableEditable}, 
    type, 
  } 
} 

function ParseToIType(mongoField:IMongoField): IType { 
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


function AddEditableOrReadableOptions(mongoField:IMongoField) { 
  const readable = mongoField.options?.readable ?? !['__v'].includes(mongoField.path); 
  const editable = mongoField.options?.editable ?? !['_id', '__v'].includes(mongoField.path); 
  return {readable, editable}; 
} 
