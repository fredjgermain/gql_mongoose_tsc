import mongoose, { ObjectId } from 'mongoose'; 
import { Base } from '@typegoose/typegoose/lib/defaultClasses'; 

import { Field, ObjectType, ID, Resolver, FieldResolver, Root, ClassType } 
  from "type-graphql"; 
import { getModelForClass, prop, Ref } 
  from "@typegoose/typegoose"; 


  
// --------------------------------------------------------------- 
import { ObjectIdScalar } from '../typegql.utils/customscalar/objectid.scalar'; 


function ToObjectId(value:any) { 
  if(typeof value === 'string') 
    return new mongoose.Types.ObjectId(value); 
  else if("_id" in value) 
    return value._id; 
  return value; 
}

function FromObjectId(itemClass:any,  id:any) {
  console.log(itemClass.name); 
  const model = getModelForClass(itemClass); 
  const found = model.findById(id).exec(); 
  return found; 
}

function OneToOne<T extends ClassType>(itemClass:T) {
  return {
    set: (value:any) => ToObjectId(value), 
    get: (id:any) => FromObjectId(itemClass, id) 
  }
} 

function OneToMany<T extends ClassType>(itemClass:T) { 
  return { 
    set: (values:any[]) => values.map( value => ToObjectId(value)), 
    get: (ids:any[]) => ids.map( id => FromObjectId(itemClass, id) ) 
  } 
} 



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


// @Resolver(of => C) 
// export class NestedResolver { 

//   @FieldResolver(() => A) 
//   async nested(@Root() root:any) { 
//     const model = getModelForClass(A); 
//     console.log("root:", root); 
//     const found = await model.findById(root.nested); 
//     console.log("found", found); 
//     return found; 
//   } 
// } 


// export function NestedClassType<T extends ClassType>(itemClass:T) { 
//   itemClass.
// }


/*

 */


export const dataA = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test A1'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A2'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A3'}, 
] 



export const dataB = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test B1', nested:dataA[0]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B2', nested:dataA[1]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B3', nested:dataA[2]}, 
] 

export const dataC = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test C1', nested:dataB[0], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C2', nested:dataB[1], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C3', nested:dataB[2], manyNested:dataB}, 
] 


