import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 
  
// --------------------------------------------------------------- 
import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 



export const descriptorA = { 
  accessor: 'A', 
  label: ['label A'], 
  description: ['dummy A'] 
} 
@ObjectType({ description: "The DummyA model" })
export class A { 
  @Field(type => ID) 
  _id: string; 
  /*@Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; */

  @Field(type => String) 
  @prop({ type:String, required:true }) 
  name: string; 
}




export const descriptorB = { 
  accessor: 'B', 
  label: ['label B'], 
  description: ['dummy B'] 
} 
@ObjectType({ description: "The DummyA model" })
export class B { 
  @Field(type => ID) 
  _id: string; 
  /*@Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; */

  @Field(type => String) 
  @prop({type:String}) 
  name: string; 

  @Field(() => A) 
  @prop({ref: () => A, ...OneToOne(A)}) 
  nested: Ref<A> 
} 



export const descriptorC = { 
  accessor: 'C', 
  label: ['model C'], 
  description: ['dummy C'] 
} 
@ObjectType({ description: "The DummyA model" })
export class C { 
  @Field(type => ID) 
  _id: string; 

  @Field() 
  @prop({type:String}) 
  name: string; 

  @Field(() => B, {nullable:true}) 
  @prop({ref: () => B, ...OneToOne(B)}) 
  nested?: Ref<B> 

  @Field(() => [B], {nullable:true}) 
  @prop({ref: () => B, ...OneToMany(B)}) 
  manyNested?: Ref<B[]> 
} 
