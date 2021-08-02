import { Field, ObjectType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 



// MODELOBJECTTYPE ########################################
@ObjectType() 
export class ModelObjectType { 
  @Field() 
  accessor: string; 
  
  @Field(type => [String]) 
  label: string[]; 

  @Field(type => [String]) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 
} 
