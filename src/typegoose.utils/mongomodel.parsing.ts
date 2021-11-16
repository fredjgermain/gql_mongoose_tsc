// import { mongoose } from '@typegoose/typegoose'; 



// // -------------------------------------------------------- 
// import { IField, IType, IMongoField } from '../../lib/ifield.interface'; 
// import { GetDefaultValue } from '../../lib/utils/type.utils'; 
// import { FEEDBACK } from './feedback.utils';


// type MongoModel = mongoose.Model<any, {}, {}> 

// export function GetMongoModel(modelName:string):MongoModel { 
//   const model = mongoose.models[modelName]; 
//   if(!model) 
//     throw new Error( `${modelName} ${FEEDBACK.ERROR_MODEL_NOT_FOUND.name}` ); 
//   return model; 
// } 

// export function GetMongoFields(model:MongoModel) { 
//   return Object.values(model.schema.paths) as any[] as IMongoField[]; 
// } 

// export function GetIFields(model:MongoModel):IField[] { 
//   const mongofields = GetMongoFields(model); 
//   return mongofields.map( field => ParseToIField(field) ) // parse fields to convert to IFields ?? 
// }

// function ParseToIField(mongoField:IMongoField):IField { 
//   const {path, instance, options, $embeddedSchemaType} = mongoField; 
//   const type = ParseToIType(mongoField); 
//   const readableEditable = AddEditableOrReadableOptions(mongoField); 

//   return { 
//     accessor: path ?? '', 
//     label: options.label ?? '', 
//     isRef: !!options?.ref, 
//     options:{ ...options, ...readableEditable}, 
//     type, 
//   } 
// } 

// function ParseToIType(mongoField:IMongoField): IType { 
//   const {instance, options, $embeddedSchemaType} = mongoField; 
//   const type = {} as IType; 

//   type.name = (options?.ref ?? $embeddedSchemaType?.instance ?? mongoField.instance ?? '').toLowerCase(), 
//   type.enums = options?.enum; 
//   type.isEnum = !!type.enums; 
//   type.isArray = instance.toLowerCase() === 'array' || !!options?.isArray; 
//   type.isObject = !!options?.ref; 
//   type.isScalar = !type.isArray && !type.isObject; 
//   type.defaultValue = options['defaultValue'] ?? options['default'] ?? GetDefaultValue(type.name); 
//   return type; 
// } 


// function AddEditableOrReadableOptions(mongoField:IMongoField) { 
//   const readable = mongoField.options.readable ?? !['__v'].includes(mongoField.path); 
//   const editable = mongoField.options.editable ?? !['_id', '__v'].includes(mongoField.path); 
//   return {readable, editable}; 
// } 