import { ClassType, Field, ID, Int, 
  Resolver, Query, Mutation, Arg, NonEmptyArray, InputType } 
  from "type-graphql"; 
import { getModelWithString } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { CrudResolver } from '../resolvers/crud.resolver'; 
export const Resolvers = [CrudResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 


//export const Resolvers = [CrudResolver, DummyResolver, PostResolver, CategoryResolver, TestEntityResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 


//import { FactoryResolver } from './resolvers.factory'; 
/*import { Dummy, CreateDummy, UpdateDummy } from '../models/Dummy'; 
import { Post, CreatePost, UpdatePost} from '../models/Post'; 
import { Category, CreateCategory, UpdateCategory } from '../models/Category'; 
import { TestEntity } from '../models/TestEntity'; */




/*@Resolver()
class TestEntityResolver { 
  @Query(type => [TestEntity]) 
  async testEntities(): Promise<TestEntity[]> { 
    const model = getModelWithString(TestEntity.name); 
    if(!model) 
      return []; 
    return await model.find(); 
  }
}

const CategoryResolver = FactoryResolver(Category, CreateCategory, UpdateCategory); 
const DummyResolver = FactoryResolver(Dummy, CreateDummy, UpdateDummy); 
const PostResolver = FactoryResolver(Post, CreatePost, UpdatePost); */