import {mongoose, getModelForClass } from '@typegoose/typegoose'; 
import { ClassType } from 'type-graphql'; 

// -------------------------------------------------------- 
import { FEEDBACK } from './feedback.utils'; 
import { IField, IType } from '../../lib/ifield.interface'; 
import { GetDefaultValue } from '../../lib/utils/type.utils'; 
//import { TypegooseModel } from "./typegoosemodel/typegoosemodel.model"; 
import { ErrProp } from './validation/errprop.class'; 


/** ToObjectId 
 * Extract an id from an input. 
 * 
 * @param value 
 * @returns 
 */
export function ToObjectId(value:any) { 
  if(typeof value === 'string') 
    return new mongoose.Types.ObjectId(value); 
  else if("_id" in value) 
    return value._id; 
  return value; 
}


/** FromObjectId 
 * Finds and returns a document from a model type and an id. 
 * 
 * @param itemClass 
 * @param id 
 * @returns 
 */
export function FindObjectByClassAndId(itemClass:any,  id:any) {
  //console.log(itemClass.name); 
  const model = getModelForClass(itemClass); 
  const found = model.findById(id).exec(); 
  return found; 
}


/** OneToOne 
 * 
 * @param itemClass 
 * @returns 
 */
export function OneToOne<T extends ClassType>(itemClass:T) {
  return {
    //type: itemClass, 
    ref: () => itemClass, 
    set: (value:any) => ToObjectId(value), 
    get: (id:any) => FindObjectByClassAndId(itemClass, id) 
  }
} 

export function OneToMany<T extends ClassType>(itemClass:T) { 
  return { 
    //type: [itemClass], 
    ref: () => itemClass, 
    set: (values:any[]) => values.map( value => ToObjectId(value)), 
    get: (ids:any[]) => ids.map( id => FindObjectByClassAndId(itemClass, id) ),  
    isArray: true, 
  } 
} 





export type MongoModel = mongoose.Model<any, {}, {}> 

interface MongoField {
  path:string;  // accessor 
  instance:string; 
  validators: any; 
  options: { 
    ref?: string; 
    isArray?: boolean; 
    label?: string; 
    sortType?: string; 
    defaultValue?: any; 
    format?: string; 
    order?: number; 
    enum?: any[]; 
    abbrev?: boolean; 
    readable?: boolean; 
    editable?: boolean; 
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
  const readableEditable = IsEditableOrReadable(mongoField); 

  return { 
    accessor: path ?? '', 
    label: label ?? '', 
    isRef: !!options?.ref, 
    options:{ ...options, ...readableEditable}, 
    type, abbrev, format, order, 
  } 
} 

function IsEditableOrReadable(mongoField:MongoField) { 
  const readable = mongoField.options.readable ?? !['__v'].includes(mongoField.path); 
  const editable = mongoField.options.editable ?? !['_id', '__v'].includes(mongoField.path); 
  return {readable, editable}; 
} 

function ParseToIType(mongoField:MongoField): IType { 
  const {instance, options, $embeddedSchemaType} = mongoField; 
  const type = {} as IType; 

  type.name = (options?.ref ?? $embeddedSchemaType?.instance ?? mongoField.instance ?? '').toLowerCase(), 
  type.enums = options?.enum; 
  type.isEnum = !!type.enums; 
  type.isArray = instance.toLowerCase() === 'array' || !!options?.isArray; 
  type.isObject = !!options?.ref; 
  type.isScalar = !type.isArray && !type.isObject; 
  type.defaultValue = options['defaultValue'] ?? options['default'] ?? GetDefaultValue(type.name); 
  return type; 
} 

// function GetDefaultValue(type:string, options:any):any { 
//   if(options['defaultValue']) 
//     return options['defaultValue']; 
//   if(options['default']) 
//     return options['default']; 
//   return GetDefaultValueByTypeName(type); 
// } 


// // TEMPORARY function ... move to a proper lib
// function GetDefaultValueByTypeName(typeName:string) { 
//   if(typeName==='boolean') 
//     return false; 
//   if(typeName==='string') 
//     return ''; 
//   if(typeName==='number') 
//     return 0; 
//   if(typeName==='array') 
//     return []; 
//   /*if(typeName==='date') 
//     return new YMD().StringYMD(); */ 
//   if(typeName==='object') 
//     return {}; 
//   return null; 
// } 

