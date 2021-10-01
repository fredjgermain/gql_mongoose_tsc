import { Resolver, Query, Mutation, Arg } 
  from "type-graphql"; 

// ---------------------------------------------------------
import { IsEmpty } from '../../lib/utils'
//import { ObjectScalar } from "./customscalar/object.scalar"; 
import { Form } from "../business/models/form.model";
import { GetMongoModel } from "../typegoose.utils/mongomodel.parsing";
import * as CrudAction from '../typegoose.utils/crud.actions'; 
import { ErrProp } from "../typegoose.utils/validation/errprop.class";

class TestError extends Error { 
  public errprops: ErrProp[]; 

  constructor(errprops?:ErrProp[]) { 
    super('test') 
    this.errprops = errprops ?? []; 
  } 
}

@Resolver() 
export class TestResolver{ 
  @Query(type => [Form]) 
  async TestReadForm(@Arg("ids", type => [String], { nullable: true }) ids?:string[] ): Promise<Form[]> { 
    /*const model = GetMongoModel('Form'); 
    if(!model) 
      return []; 
    const {items, errors} = await CrudAction.Read(model, ids); 

    if(!IsEmpty(errors)) { 
      console.log(errors); 
      throw new TestError(errors); 
    }
    return items; */
    return []; 
  } 
}