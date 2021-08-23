import { Field, ObjectType, ClassType } from "type-graphql"; 
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 
import { ObjectScalar } from "./customscalar/object.scalar"; 




/** GglResultFactory ====================================== 
 * Factors a GqlResult class of type T 
 * items : the results of a successful Query or Mutation. 
 * errors : the errors of a unsuccessful Query or Mutation. 
 * @param itemClass 
 * @returns 
 */
 export function GqlResultFactory<T extends ClassType>(itemClass: T) { 
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true }) 
  abstract class GqlResultClass { 
    /*constructor(items:T[], errors?:ErrProp[]) { 
      this.items = items; 
      this.errors = errors; 
    } */
    // here we use the runtime argument 
    @Field(type => [itemClass]) 
    items: T[]; 

    @Field(() => [ObjectScalar], {nullable:true}) 
    errors?: ErrProp[]; 
  } 
  return GqlResultClass; 
}



// GQLModel ===============================================
@ObjectType() 
export class GQLModel { 
  /*constructor(model?:IModel, errors?:ErrProp[]) { 
    this.accessor = model?.accessor ?? ''; 
    this.label = model?.label ?? []; 
    this.description = model?.description ?? []; 
    this.ifields = model?.ifields ?? []; 
  }*/

  @Field() 
  accessor: string; 
  
  @Field(type => [String]) 
  label: string[]; 

  @Field(type => [String]) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  ifields: object[]; 
} 




// CrudResultModel ==============================================
@ObjectType() 
export class CrudResultModel{ 
  @Field(type => [GQLModel]) 
  items: GQLModel[]; 

  @Field(() => [ObjectScalar], {nullable:true}) 
  errors?: ErrProp[]; 
}


// // --------------------------------------------------------
// @ObjectType() 
// export class GQLError implements ErrProp{ 

//   @Field() 
//   name: string; 

//   @Field() 
//   path: string; 

//   @Field(type => ObjectScalar) 
//   value: any; 

//   @Field(type => [GQLError], {nullable:true}) 
//   errors?: GQLError[]; 

//   //[key:string]: any; 
// }
