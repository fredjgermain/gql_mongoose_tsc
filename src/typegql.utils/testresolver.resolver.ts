import { Resolver, Query, Mutation, Arg } 
  from "type-graphql"; 
import { GetIModel, GetMongoModel } from "../typegoose.utils/model/modeler.utils"; 
import { ValidateByValidators } from '../typegoose.utils/validation-2/error.utils'; 



// ---------------------------------------------------------
@Resolver() 
export class TestResolver { 
  @Query(type => String) 
  async Test(): Promise<String> { 

    const mongoModel = GetMongoModel('D'); 
    const model = GetIModel('D'); 
    const ifields = model?.ifields ?? [] as IField[]; 
    const agefield = ifields.find( f => f.accessor === 'age'); 

    // const input = { age:-1 } 
    // await mongoModel.validate(input) 
    //   .then( res => console.log(res) ) 
    //   .catch( error => console.log(error) ) 
    // console.log( agefield?.validators ) 

    console.log(ValidateByValidators( agefield?.validators ?? [], {value:-2, msgValues:{PATH:agefield?.accessor}}) ) 

    // ifields.forEach( ifield => { 
    //   console.log(ifield.accessor, ifield.validators); 
    // }) 


    /*const model = GetMongoModel('Form'); 
    if(!model) 
      return []; 
    const {items, errors} = await CrudAction.Read(model, ids); 

    if(!IsEmpty(errors)) { 
      console.log(errors); 
      throw new TestError(errors); 
    }
    return items; */
    return "Test !!!"; 
  } 
  
  // async TestReadForm(@Arg("ids", type => [String], { nullable: true }) ids?:string[] ): Promise<Form[]> { 
  //   /*const model = GetMongoModel('Form'); 
  //   if(!model) 
  //     return []; 
  //   const {items, errors} = await CrudAction.Read(model, ids); 

  //   if(!IsEmpty(errors)) { 
  //     console.log(errors); 
  //     throw new TestError(errors); 
  //   }
  //   return items; */
  //   return []; 
  // } 
}