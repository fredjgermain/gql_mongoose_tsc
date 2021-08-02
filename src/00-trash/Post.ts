import { ObjectType, InputType, Field, ID } from "type-graphql"; 
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

// ------------------------------------------------------
import { BaseEntity } from './BaseEntity'; 



@ObjectType({ description: "The Post model" })
export class Post extends BaseEntity{
    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}
getModelForClass(Post); // Necessary to find datas in DB


@InputType()
export class CreatePost { 
    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}

@InputType()
export class UpdatePost { 
    @Field(()=> ID)
    id: string;

    @Field() 
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}