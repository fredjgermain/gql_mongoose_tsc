import { FEEDBACK } from "../feedback.utils"; 
import { InterpolateString, IsEmpty } from '../../lib/utils'; 
import { FindEntries } from "./modeler.utils"; 
import { TypegooseModel } from "./typegoosemodel.class"; 



class CrudError extends Error { 
  public inputErrors: InputError[]; 

  constructor({message, inputErrors}:{message?:string, inputErrors?:InputError[]}) { 
    super('CrudError') 
    this.inputErrors = inputErrors ?? []; 
  } 
} 



type MsgValues = {VALUE?:string, PATH?:string, [key:string]:any}; 
type ErrMsgOptions = {messageTemplate:string, msgValue?:MsgValues}; 
type ValidationArgs = {path:string, value:any, errMsgOptions?:ErrMsgOptions}; 

export class TypegooseValidation { 
  public tgmodel:TypegooseModel; 
  public modelName:string; 
  private model: IModel; 

  constructor(modelName:string) { 
    this.tgmodel = new TypegooseModel(modelName); 
    this.modelName = this.tgmodel.modelName; 
    this.model = this.tgmodel.model; 
  } 

  public ThrowIfHasError(inputErrors:InputError[]) { 
    if(!this.IsErrorFree(inputErrors)) 
      throw new CrudError({inputErrors}); 
  } 

  public IsErrorFree(inputErrors:InputError[]):boolean { 
    return inputErrors.every( i => IsEmpty(i.errors) ); 
  } 

  public async ValidateToCreate(inputs:any[]) { 
    return await this.ValidateByInputs(inputs); 
  } 

  public async ValidateToUpdate(inputs:IEntry[]) { 
    // Complete partial updates ?? by fetching their complete corresponding already entry 
    const [toUpdate, notFound] = await this.ToUpdate(inputs); 
    const inputNotFoundErrors = await this.ValidateInputMustExists(notFound); 
    const inputValidationErrors = await this.ValidateByInputs(toUpdate); 
    return [...inputNotFoundErrors, ...inputValidationErrors]; 
  } 



  /** ValidateInputMustExists ---------------------------------------------
   * 
   * @param model 
   * @param inputs 
   * @returns 
   */
  public async ValidateInputMustExists(inputs:IEntry[]):Promise<InputError[]> { 
    const collection = await FindEntries({modelName:this.model.accessor}); 
    const predicate = (t:IEntry) => collection.some(e => e._id === t._id); 
    
    return inputs.map( input => { 
      if( !predicate(input) ) { 
        const {value, path} = {value:input._id, path:"_id"}; 
        const errors = [{name:FEEDBACK.ERROR_ITEM_NOT_FOUND.name, path, value}] as ErrProp[]; 
        return { input, errors } as InputError; 
      } 
      return {input, errors:[]} as InputError; 
    }); 
  } 


  // By Inputs --------------------------------------------
  public async ValidateByInputs(inputs:Partial<IEntry>[]):Promise<InputError[]> { 
    const ids = inputs.map( i => i?._id); 
    const collection = (await FindEntries({modelName:this.model.accessor})) 
      .filter( entry => !ids.includes(entry._id) ) 
    
    return inputs.map( (input, i, a) => { 
      // exclude itself to not compare itself with itself and avoid false duplication error. 
      const otherInputs = a.filter( (e,j) => j != j ); 
      return this.ValidateByInput(input, [...otherInputs, ...collection]); 
    }) 
  } 

  private ValidateByInput(input:Partial<IEntry>, otherEntries:Partial<IEntry>[]):InputError { 
    let errors = [] as ErrProp[]; 
    (this.model.ifields ?? []).map( ({validators, accessor}) => { 
      const {value, path} = {value:input[accessor], path:accessor}; 
      const toCompare = otherEntries.map( entry => entry[accessor] ); 
      errors = [...errors,  ...this.ValidateByValidators(validators, toCompare, {value, path} )] 
    }) 
    return {input, errors} as InputError; 
  } 


  // By Validators --------------------------------------------
  private ValidateByValidators( validators:IValidator[], toCompare:any[], validationOption:ValidationArgs ):ErrProp[] { 
    return validators.map( validator => this.ValidateByValidator(validator, toCompare, validationOption) ) 
      .filter( err => err ) as ErrProp[]; 
  } 

  private ValidateByValidator( validator:IValidator, toCompare:any[], {path, value, errMsgOptions}:ValidationArgs ) { 
    const message = this.InterpolateErrorMsg(validator.message, {path, value, errMsgOptions}); 
    if(validator.type === "unique" && toCompare?.includes(value)) 
      return { name:FEEDBACK.ERROR_DUPLICATE.name, value, path, message } as ErrProp; 
    if(!validator.validator(value)) 
      return { name:FEEDBACK.ERROR_VALIDATION.name, value, path, message } as ErrProp; 
    return; 
  } 
  
  private async ToUpdate(inputs:IEntry[]):Promise<[IEntry[], IEntry[]]> { 
    const collection = await FindEntries({modelName:this.model.accessor}); 

    const toUpdate = [] as IEntry[]; 
    const notFound = [] as IEntry[]; 
    inputs.forEach( input => { 
      const found = collection.find( e => e._id === input._id ) 
      found ? 
        toUpdate.push({...found, ...input}): 
        notFound.push(input); 
    }) 
    return [toUpdate, notFound]; 
  } 

  private InterpolateErrorMsg( message:string, {path, value, errMsgOptions}:ValidationArgs ) { 
    const values = {...(errMsgOptions?.msgValue ?? {}), PATH:path, VALUE:value}; 
    const template = errMsgOptions?.messageTemplate ?? message; 
    return InterpolateString(values, template); // interpolated error message 
  }
}