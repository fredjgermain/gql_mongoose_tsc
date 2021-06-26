import { ObjectType, InputType, Field, ID, InterfaceType } from "type-graphql"; 

@ObjectType() 
export class BaseEntity { 
  @Field(()=> ID) 
  id: string; 
} 
