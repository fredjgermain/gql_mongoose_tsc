

/** IMONGOFIELD 
 * 
*/
interface IMongoField {
  path:string;  // accessor 
  instance:string; 
  validators: any; 
  options?: IFieldOption; 
  $embeddedSchemaType?:{ 
    instance:string; 
  }; 
  [key:string]:any; 
} 

interface InputError { 
  input:object;
  fieldErrors: FieldError[]; 
  [key:string]: any; 
}

interface FieldError { 
  name: string, 
  value: any, 
  errors: ErrProp[], 
  [key:string]: any 
}

interface ErrProp { 
  name: string, 
  message?: string, 
  [key:string]: any 
} 

