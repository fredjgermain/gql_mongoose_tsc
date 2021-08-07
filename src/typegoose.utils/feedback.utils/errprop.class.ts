import { FEEDBACK_MSG } from '../../mockdata/feedbacks.mockdata'; 


export interface ErrProp { 
  name: string; 
  path: string; 
  value: any; 
  [key:string]: any; 
} 


export function ErrorParsing(error:any):ErrProp[] { 
  // Mongo Error duplication 
  if('name' in error && 'keyPattern' in error && 'keyValue' in error && error.name === 'MongoError') { 
    const [path] = Object.keys(error['keyPattern']); 
    const [value] = Object.values(error['keyValue']); 
    return [{name:FEEDBACK_MSG.ERROR_DUPLICATE.name, path, value}] 
  } 

  // Validation Error 
  else if('name' in error && error.name === 'ValidationError') { 
    return Object.values(error['errors']) 
      .map( (e:any) => { 
        // error type 'required'
        if(e.kind === 'required') 
          return {name:FEEDBACK_MSG.ERROR_REQUIRED.name, path:e.path, value:null} 
        // other validation errors 
        return e.properties; 
      }) as ErrProp[]; 
  } 
  return [error]; 
} 