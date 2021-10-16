export interface IType { 
  defaultValue: any; 
  name: string; 
  //nestedType?: IType[] | {[key:string]:IType}; 
  enums?: string[]; // ?? 
  isEnum?: boolean; 
  isArray?: boolean; 
  isScalar?: boolean; 
  isObject?: boolean; 
} 

export interface IModel { 
  accessor:string, 
  label:string[], 
  description:string[], 
  ifields:IField[], 
} 


export interface IField {
  accessor: string; 
  type: IType; 

  label: string; 
  isRef?: boolean; 
  options?: any; 

  // required?: boolean; 
  // unique?: boolean; 
  // regex?: string; 

  // required?: boolean; 
  // unique?: boolean; 
  // regex: string ?? 
  // validators: any[]; 
}



export interface IMongoField {
  path:string;  // accessor 
  instance:string; 
  validators: any; 
  options: IFieldOption; 
  $embeddedSchemaType?:{ 
    instance:string; 
  }; 
  [key:string]:any; 
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
}; 

