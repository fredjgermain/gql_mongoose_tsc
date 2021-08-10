import { Field, ObjectType } from "type-graphql"; 
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 
//import {} from '../typegql.utils/'

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 



// CRUD RESULT ############################################
@ObjectType() 
export class CrudResult { 
  constructor (modelName:string, result:{items?:any[], errors?:ErrProp[]}, fields?:string[]) { 
    this.modelName = modelName; 
    this.items = result.items?.map( item => SubItem(item, fields)) ?? []; 
    this.count = this.items.length; 
    this.errors = result.errors ?? []; 
  } 

  @Field() 
  modelName: string; 
  
  @Field() 
  count: number; 

  @Field(type => [ObjectScalar]) 
  items: object[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  errors: object[]; 
} 



function SubItem(item:any, fields?:string[]) { 
  if(!fields || fields.length == 0) 
    return item; 
  let subItem = {} as any; 
  fields.forEach( field => subItem[field] = item[field]) 
  return subItem; 
}



// MODELOBJECTTYPE ########################################
@ObjectType() 
export class GQLModel { 
  @Field() 
  accessor: string; 
  
  @Field(type => [String]) 
  label: string[]; 

  @Field(type => [String]) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 
} 








/**
 * 
  //private GetAbbrevsTemplate()

  private Abbrevs(modelName:string, items:any[]):{_id:string, abbrev:string}[] { 
    const abbrevIfields = GetIFields(GetMongoModelObject(modelName)) 
      .filter( ifield => ifield.abbrev ) // finds abbrevsIfields 
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) ); // sort them by order 

    return items.map( item => { 
      const _id = item._id ?? ''; 
      const abbrev = ''; 
      abbrevIfields.map( ifield => { 
        const value = item[ifield.name]; 
        
      }); 
      return {_id, abbrev} 
    }) 
  }


 */