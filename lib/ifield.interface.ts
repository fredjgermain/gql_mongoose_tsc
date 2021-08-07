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

export interface IField {
  accessor: string; 
  type: IType; 

  label: string; 
  isRef?: boolean; 
  options?: any; 
  abbrev?: boolean; 
  format?: string; 
  order?: number; 

  // required?: boolean; 
  // unique?: boolean; 
  // regex: string ?? 
  // format: string ?? 
  // validators: any[];
  // abbrev: 
  
}

export interface IMongoField {
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
