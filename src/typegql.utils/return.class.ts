import { Field, ObjectType, createUnionType } from "type-graphql"; 
import { IModel } from "../../lib/ifield.interface";
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 


@ObjectType() 
export class GQLError implements ErrProp{ 

  @Field() 
  name: string; 

  @Field() 
  path: string; 

  @Field(type => ObjectScalar) 
  value: any; 

  //[key:string]: any;   
}


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

  @Field(type => [ObjectScalar], { nullable: true }) // replace with IField type ?? 
  errors?: object[]; 
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
  constructor(model?:IModel, errors?:ErrProp[]) { 
    this.accessor = model?.accessor ?? ''; 
    this.label = model?.label ?? []; 
    this.description = model?.description ?? []; 
    this.ifields = model?.ifields ?? []; 
    this.errors = errors; 
  }

  @Field() 
  accessor: string; 
  
  @Field(type => [String]) 
  label: string[]; 

  @Field(type => [String]) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 

  @Field(type => [ObjectScalar], { nullable: true }) // replace with IField type ?? 
  errors?: object[]; 
} 


export const GQLModelError = createUnionType({ 
  name: "GQLModelError", // the name of the GraphQL union
  types: () => [GQLModel, GQLError] as const, // function that returns tuple of object types classes
});





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