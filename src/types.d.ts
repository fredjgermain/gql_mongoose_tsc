/** IOPTION
 * 
*/ 
interface IOption { 
  value:any; 
  label:string; 
}

interface IType { 
  defaultValue: any; 
  name: string; 
  //nestedType?: IType[] | {[key:string]:IType}; 
  enums?: string[]; // ?? 
  isEnum?: boolean; 
  isArray?: boolean; 
  isScalar?: boolean; 
  isObject?: boolean; 
} 

interface IModel { 
  accessor:string, 
  label:string[], 
  description:string[], 
  ifields:IField[], 
} 


interface IField {
  accessor: string; 
  type: IType; 

  label: string; 
  isRef?: boolean; 
  validators: IValidator[]; 
  options?: IFieldOption; 

  // required?: boolean; 
  // unique?: boolean; 
  // regex?: string; 

  // required?: boolean; 
  // unique?: boolean; 
  // regex: string ?? 
  // validators: any[]; 
}

interface IFieldOption {
  ref?: string; 
  isArray?: boolean; 
  label?: string; 
  sortType?: string; 
  defaultValue?: any; 
  format?: string; 
  order?: number; 
  enum?: any[]; 
  readable?: boolean; 
  editable?: boolean; 
  required?: boolean; 
  unique?: boolean; 
  regex?: string; 
  [key:string]:any; 
} 



/** IENTRY 
 * 
 */
interface IEntry { 
  _id: string; 
  [key:string]: any; 
} 




/** IMONGOFIELD 
 * 
*/
interface IMongoField {
  path:string;  // accessor 
  instance:string; 
  validators: IValidator[]; 
  options?: IFieldOption; 
  $embeddedSchemaType?:{ 
    instance:string; 
  }; 
  [key:string]:any; 
}

interface IValidator { 
  validator:Function; 
  message: string; 
  type: string; 
}



interface InputError { 
  input:object; 
  errors: ErrProp[]; 
  [key:string]: any; 
}


interface ErrProp { 
  name: string; 
  value: any; 
  path: string; 
  message?: string; 
  [key:string]: any; 
} 
