import { Field, ObjectType, ClassType } from "type-graphql"; 
import { ErrProp } from "../../typegoose.utils/validation/errprop.class"; 
import { ObjectScalar } from "../customscalar/object.scalar"; 



/** GglResultFactory ====================================== 
 * Factors a GqlResult class of type T 
 * items : the results of a successful Query or Mutation. 
 * errors : the errors of a unsuccessful Query or Mutation. 
 * @param itemClass 
 * @returns 
 */
 export function CrudResult_FactoryModel<T extends ClassType>(itemClass: T) { 
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true }) 
  abstract class CrudResult { 
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
  return CrudResult; 
}

