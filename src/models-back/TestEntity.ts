import { ObjectType, InputType, Field, ID, Int, Float, InterfaceType } from "type-graphql"; 
import { prop as Property, getModelForClass } from "@typegoose/typegoose"; 

// ---------------------------------------------- 
import { BaseEntity } from './BaseEntity'; 

@ObjectType() 
export class TestEntity {
  @Field(()=> ID) 
  id: string; 

  @Field(type => [Int]) 
  ratings: number[]; 

  @Field(type => Float, { nullable: true }) 
  get averageRating() { 
    const sum = this.ratings.reduce((a, b) => a + b, 0); 
    return sum / this.ratings.length; 
  } 
}
getModelForClass(TestEntity); // Necessary to find datas in DB 
