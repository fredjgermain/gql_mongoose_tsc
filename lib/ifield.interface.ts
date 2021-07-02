interface IType { 
  name: string; 
  nestedType?: IType[] | {[key:string]:IType}; 
  isArray: boolean; 
  isScalar: boolean; 
  isObject: boolean; 
} 

interface IField {
  name: string; 
  type: IType; 

  label: string; 
  required: boolean; 
  unique: boolean; 
  // regex: string ?? 
  // format: string ?? 
  // validators: any[];
  // abbrev: 

  isArray: boolean; 
  isRef: boolean; 
  isScalar: boolean; 
}
