// import { FEEDBACK } from "../feedback.utils"; 
// import { InterpolateString, IsEmpty } from '../../lib/utils'; 
// import { FindEntries } from "./model/modeler.utils"; 
// import { TypegooseCrud } from "./typegoosecrud.class";
// import { TypegooseModel } from "./typegoosemodel.class";



// export class CrudError extends Error { 
//   public inputErrors: InputError[]; 

//   constructor(inputErrors?:InputError[]) { 
//     super('CrudError') 
//     this.inputErrors = inputErrors ?? []; 
//   } 
// } 





// export function IsErrorFree(inputErrors:InputError[]):boolean { 
//   return inputErrors.every( i => IsEmpty(i.errors) ); 
// } 

// export async function ValidateToCreate(model:IModel, inputs:any[]) { 
//   return await ValidateByInputs(model, inputs); 
// } 

// export async function ValidateToUpdate(model:IModel, inputs:IEntry[]) { 
//   // Complete partial updates ?? by fetching their complete corresponding already entry 
//   const [toUpdate, notFound] = await ToUpdate(model, inputs); 
//   const inputNotFoundErrors = await ValidateInputMustExists(model, notFound); 
//   const inputValidationErrors = await ValidateByInputs(model, toUpdate); 
//   return [...inputNotFoundErrors, ...inputValidationErrors]; 
// } 



// /** ValidateInputMustExists ---------------------------------------------
//  * 
//  * @param model 
//  * @param inputs 
//  * @returns 
//  */
// export async function ValidateInputMustExists(model:IModel, inputs:IEntry[]):Promise<InputError[]> { 
//   const collection = await FindEntries({modelName:model.accessor}); 
//   const predicate = (t:IEntry) => collection.some(e => e._id === t._id); 
  
//   return inputs.map( input => { 
//     if( !predicate(input) ) { 
//       const {value, path} = {value:input._id, path:"_id"}; 
//       const errors = [{name:FEEDBACK.ERROR_ITEM_NOT_FOUND.name, path, value}] as ErrProp[]; 
//       return { input, errors } as InputError; 
//     } 
//     return {input, errors:[]} as InputError; 
//   }); 
// } 


// async function ToUpdate(model:IModel, inputs:IEntry[]):Promise<[IEntry[], IEntry[]]> { 
//   const collection = await FindEntries({modelName:model.accessor}); 

//   const toUpdate = [] as IEntry[]; 
//   const notFound = [] as IEntry[]; 
//   inputs.forEach( input => { 
//     const found = collection.find( e => e._id === input._id ) 
//     found ? 
//       toUpdate.push({...found, ...input}): 
//       notFound.push(input); 
//   }) 
//   return [toUpdate, notFound]; 
// } 


// export async function ValidateByInputs(model:IModel, inputs:Partial<IEntry>[]):Promise<InputError[]> { 
//   const ids = inputs.map( i => i?._id); 
//   const collection = (await FindEntries({modelName:model.accessor})) 
//     .filter( entry => !ids.includes(entry._id) ) 
  
//   return inputs.map( (input, i, a) => { 
//     // exclude itself to not compare itself with itself and avoid false duplication error. 
//     const otherInputs = a.filter( (e,j) => j != j ); 
//     return ValidateByInput(model, input, [...otherInputs, ...collection]); 
//   }) 
// } 

// function ValidateByInput(model:IModel, input:Partial<IEntry>, otherEntries:Partial<IEntry>[]):InputError { 
//   let errors = [] as ErrProp[]; 
//   (model.ifields ?? []).map( ({validators, accessor}) => { 
//     const {value, path} = {value:input[accessor], path:accessor}; 
//     const toCompare = otherEntries.map( entry => entry[accessor] ); 
//     errors = [...errors,  ...ValidateByValidators(validators, toCompare, {value, path} )] 
//   }) 
//   return {input, errors} as InputError; 
// } 


// type MsgValues = {VALUE?:string, PATH?:string, [key:string]:any}; 
// type ErrMsgOptions = {messageTemplate:string, msgValue?:MsgValues}; 
// type ValidationArgs = {path:string, value:any, errMsgOptions?:ErrMsgOptions}; 
// export function ValidateByValidators( validators:IValidator[], toCompare:any[], validationOption:ValidationArgs ):ErrProp[] { 
//   return validators.map( validator => ValidateByValidator(validator, toCompare, validationOption) ) 
//     .filter( err => err ) as ErrProp[]; 
// } 

// function ValidateByValidator( validator:IValidator, toCompare:any[], {path, value, errMsgOptions}:ValidationArgs ) { 
//   const message = InterpolateErrorMsg(validator.message, {path, value, errMsgOptions}); 
//   if(validator.type === "unique" && toCompare?.includes(value)) 
//     return { name:FEEDBACK.ERROR_DUPLICATE.name, value, path, message } as ErrProp; 
//   if(!validator.validator(value)) 
//     return { name:FEEDBACK.ERROR_VALIDATION.name, value, path, message } as ErrProp; 
//   return; 
// } 

// function InterpolateErrorMsg( message:string, {path, value, errMsgOptions}:ValidationArgs ) { 
//   const values = {...(errMsgOptions?.msgValue ?? {}), PATH:path, VALUE:value}; 
//   const template = errMsgOptions?.messageTemplate ?? message; 
//   return InterpolateString(values, template); // interpolated error message 
// }
