import { Field, ObjectType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 



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
