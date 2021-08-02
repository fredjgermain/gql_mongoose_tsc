import { mongoose } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { MetaCollection } from '../metamodels/metacollections.model'; 
import { IField, IType, IMongoField } from '../../lib/ifield.interface'; 


export type MongoModel = mongoose.Model<any, {}, {}>; 

export function GetMongoModelObject(modelName:string) { 
  return mongoose.models[modelName]; 
} 

export function GetMongoFields(model:MongoModel) { 
  return Object.values(model.schema.paths) as any[] as IMongoField[]; 
} 

export function GetIFields(model:MongoModel) { 
  const mongofields = GetMongoFields(model); 
  return mongofields.map( f => ParseToIField(f)) // parse fields to convert to IFields ?? 
}

export async function FetchMetaModel(modelName:string) { 
  const MetaCollectionModel = GetMongoModelObject('MetaCollection'); 

  const metaCollection = (await MetaCollectionModel.findOne({accessor:modelName}) as MetaCollection); 
  const {accessor, label, description} = metaCollection; 

  const model = GetMongoModelObject(modelName); 
  // get Mlang metaCollection ... 
  const ifields = GetIFields(model); 
  return {accessor, label, description, ifields}; 
}

function ParseToIField(mongoField:IMongoField) { 
  const {path, instance, options, $embeddedSchemaType} = mongoField; 
  const ifield:IField = {} as IField; 
  const type = ParseToIType(mongoField); 

  ifield.name = path ?? ''; 
  ifield.label = options.label ?? ''; 
  ifield.type = type; 
  ifield.isRef = !!options?.ref; 
  ifield.options = options; 
  return ifield; 
} 

function ParseToIType(mongoField:IMongoField) { 
  const {instance, options, $embeddedSchemaType} = mongoField; 
  const type = {} as IType; 

  type.name = (options?.ref ?? $embeddedSchemaType?.instance ?? mongoField.instance ?? '').toLowerCase(); 
  type.enums = options?.enum; 
  type.isEnum = !!type.enums; 
  type.isArray = instance.toLowerCase() === 'array'; 
  type.isObject = instance.toLowerCase() === 'mixed'; 
  type.isScalar = !type.isArray && !type.isObject; 
  type.defaultValue = GetDefaultValue(type.name, options); 
  return type; 
}

function GetDefaultValue(type:string, options:any):any { 
  if(options['defaultValue']) 
    return options['defaultValue']; 
  if(options['default']) 
    return options['default']; 
  return GetDefaultValueByTypeName(type); 
} 


// TEMPORARY function ... move to a proper lib
function GetDefaultValueByTypeName(typeName:string) { 
  if(typeName==='boolean') 
    return false; 
  if(typeName==='string') 
    return ''; 
  if(typeName==='number') 
    return 0; 
  if(typeName==='array') 
    return []; 
  /*if(typeName==='date') 
    return new YMD().StringYMD(); */ 
  if(typeName==='object') 
    return {}; 
  return null; 
} 

