import { Resolver, Query, Mutation, Arg } 
  from "type-graphql"; 
import { FindEntries, GetIModel, GetMongoModel } from "../typegoose.utils/modeler.utils"; 
import { ValidateByInputs, ValidateToCreate, ValidateToUpdate, IsErrorFree } 
  from "../typegoose.utils/validation"; 



// ---------------------------------------------------------
@Resolver() 
export class TestResolver { 
  @Query(type => String) 
  async Test(): Promise<String> { 

    const mongoModel = GetMongoModel('D'); 
    const model = GetIModel('D'); 
    const inputs = [ 
      {_id:'', name:'asd', age:5}, 
      {_id:'', name:'fred', age:10}, 
    ]; 

    let [first] = await FindEntries({modelName:'D'}); 
    first.age = -6; 
  
    const inputerrors = await ValidateToUpdate(model, [first]); 
    console.log(inputerrors.map(i => i.errors))
    console.log(IsErrorFree(inputerrors)); 

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