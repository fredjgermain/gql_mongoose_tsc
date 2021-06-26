import { ObjectType, InputType, Field, ID, InterfaceType } from "type-graphql"; 
import { prop as Property, getModelForClass } from "@typegoose/typegoose"; 

// ---------------------------------------------- 
import { BaseEntity } from './BaseEntity'; 


@ObjectType() 
export class Category extends BaseEntity{
  @Field(()=> ID) 
  id: string; 

  @Field() 
  @Property({minlength:10}) 
  name: String; 

  @Field() 
  @Property() 
  description: String; 
}
getModelForClass(Category); // Necessary to find datas in DB 


@ObjectType()
class Create extends Category implements Omit<Category, 'id'>{} 

@InputType() 
export class CreateCategory implements Partial<Create> {
  @Field() 
  @Property() 
  name: String; 

  @Field() 
  @Property() 
  description: String; 
} 


@InputType() 
export class UpdateCategory extends BaseEntity { 
  @Field() 
  @Property() 
  name: String; 

  @Field() 
  @Property() 
  description: String; 
} 
