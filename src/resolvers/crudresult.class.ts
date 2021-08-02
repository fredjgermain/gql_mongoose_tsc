import { Field, ObjectType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 



// CRUD RESULT ############################################
@ObjectType() 
export class CrudResult { 

  constructor (modelName:string, result:{items?:any[], errors?:any[]}) { 
    this.modelName = modelName; 
    this.items = result.items ?? []; 
    this.ids = this.items.map( (item:any) => item._id ?? item.id ) ?? []; 
    this.count = this.ids.length; 
    this.abbrevs = [] as {_id:string, abbrev:string}[]; 
    this.errors = result.errors ?? []; 
  } 

  @Field() 
  modelName: string; 
  
  @Field() 
  count: number; 

  @Field(type => [String]) 
  ids: string[]; 

  @Field(type => [ObjectScalar]) 
  items: object[]; 

  @Field(type => [ObjectScalar]) 
  abbrevs: {_id:string, abbrev:string}[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  errors: object[]; 
} 