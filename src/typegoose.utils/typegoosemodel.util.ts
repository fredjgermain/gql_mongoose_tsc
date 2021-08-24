import {mongoose, getModelForClass } from '@typegoose/typegoose'; 
// -------------------------------------------------------- 
import { FEEDBACK } from './feedback.utils'; 
import { IField, IType, IModel } from '../../lib/ifield.interface'; 
//import { TypegooseModel } from "./typegoosemodel/typegoosemodel.model"; 
import { ErrProp } from './validation/errprop.class'; 



export type MongoModel = mongoose.Model<any, {}, {}> 

interface MongoField {
  path:string;  // accessor 
  instance:string; 
  validators: any; 
  options: { 
    ref?: string; 
    label?: string; 
    sortType?: string; 
    defaultValue?: any; 
    format?: string; 
    order?: number; 
    enum?: any[]; 
    abbrev?: boolean; 
    [key:string]:any; 
  }; 
  $embeddedSchemaType?:{ 
    instance:string; 
  }; 
  [key:string]:any; 
} 



type ReturnMongoModel = {model?:MongoModel, error?:ErrProp}; 
export function GetMongoModel(modelName:string):ReturnMongoModel { 
  const model = mongoose.models[modelName]; 
  const error = { 
    name:FEEDBACK.ERROR_MODEL_NOT_FOUND.name, 
    path:'modelName', 
    value:modelName 
  } 
  return !model ? {error} : {model} 
} 

export function GetMongoFields(model:MongoModel) { 
  return Object.values(model.schema.paths) as any[] as MongoField[]; 
} 

export function GetIFields(model:MongoModel):IField[] { 
  const mongofields = GetMongoFields(model); 
  return mongofields.map( field => ParseToIField(field) ) // parse fields to convert to IFields ?? 
}

function ParseToIField(mongoField:MongoField):IField { 
  const {path, instance, options, $embeddedSchemaType} = mongoField; 
  const type = ParseToIType(mongoField); 
  const {label, abbrev, format, order} = options; 

  return { 
    accessor: path ?? '', 
    label: label ?? '', 
    isRef: !!options?.ref, 
    options, 
    type, abbrev, format, order, 
  } 
} 

function ParseToIType(mongoField:MongoField): IType { 
  const {instance, options, $embeddedSchemaType} = mongoField; 
  const type = {} as IType; 
  
  type.name = (options?.ref ?? $embeddedSchemaType?.instance ?? mongoField.instance ?? '').toLowerCase(), 
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

