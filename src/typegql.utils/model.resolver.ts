import { Resolver, Query, ObjectType, Field, Arg } 
  from "type-graphql"; 

// --------------------------------------------------------- 
import { ObjectScalar } from "./object.scalar"; 
import { TypegooseModel } from '../typegoose.utils/typegoose.utils'; 



// MODELDESCRIPTOR ===============================================
@ObjectType() 
export class Model { 
  @Field( type => String ) 
  accessor: string; 
  
  @Field(type => String) 
  label: string; 

  @Field(type => String) 
  description: string; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 
} 



/** ModelDescriptorsResolver ======================================
 * A single purpose resolver to query Models. 
 */
@Resolver() 
export class ModelResolver{ 
 
  /** Models =========================================== 
  * Returns an IModel object using Model Objectype above 
  * @param modelsname [String] string of model name 
  * @returns 
  */ 
  @Query(type => [Model]) 
  async Models( @Arg("modelsName", type => [String], { nullable: true }) modelsName?:string[] ): Promise<Model[]> { 
    return TypegooseModel.GetRegisteredIModels(modelsName); 
  } 
}