import { ObjectType, InputType, Field, ID } from "type-graphql"; 
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

// ------------------------------------------------------
import { BaseEntity } from './BaseEntity'; 



@ObjectType({ description: "The Dummy model" })
export class Dummy extends BaseEntity{
    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}
getModelForClass(Dummy); // Necessary to find datas in DB


@InputType()
export class CreateDummy { 
    
    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}

@InputType()
export class UpdateDummy { 
    @Field(()=> ID)
    id: string;

    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}