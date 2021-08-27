import { ObjectType, InputType, Field, ID } from "type-graphql"; 
import { prop as Property, getModelForClass } from "@typegoose/typegoose";


@ObjectType({ description: "The DummyA model" })
export class DummyA {
    @Field(()=> ID) 
    _id: string; 

    @Field() 
    @Property()
    name: String;
}
getModelForClass(DummyA); // Necessary to find datas in DB



@ObjectType({ description: "The DummyB model" })
export class DummyB {
    @Field(()=> ID) 
    _id: string; 

    @Field() 
    @Property() 
    description: String; 
}
getModelForClass(DummyB); // Necessary to find datas in DB