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
