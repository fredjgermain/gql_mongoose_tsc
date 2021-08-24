import mongoose, { ObjectId } from 'mongoose'; 
import { Field, ID, Int, ObjectType, InputType } 
  from "type-graphql"; 
import { prop, getModelForClass, Ref } 
  from "@typegoose/typegoose"; 


  
// --------------------------------------------------------------- 
import { ObjectIdScalar } from '../typegql.utils/customscalar/objectid.scalar'; 



export const descriptorA = { 
  accessor: 'A', 
  label: ['label A'], 
  description: ['dummy A'] 
} 
@ObjectType({ description: "The DummyA model" })
export class A { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 

  @Field(type => String) 
  @prop({type:String, required:true }) 
  name: string; 

  @Field(type => String) 
  @prop({type:String}) 
  otherName: string; 
}



export const descriptorB = { 
  accessor: 'B', 
  label: ['label B'], 
  description: ['dummy B'] 
} 
@ObjectType({ description: "The DummyA model" })
export class B { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 

  @Field(type => String) 
  @prop({type:String}) 
  name: string; 

  @Field(() => A) 
  @prop({ref: () => A, set: (val:A) => val, get: (val:any) => val}) 
  nested: Ref<A> 
} 



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



// export async function RegisterModel() { 

//   // A and B
//   const modelA = getModelForClass(A); // Necessary to find datas in DB 
//   const modelB = getModelForClass(B); // Necessary to find datas in DB 

//   const mockA = [ 
//     {
//       _id: new mongoose.Types.ObjectId(), 
//       name: 'test A'} 
//   ] 
//   const mockB = [ 
//     { 
//       _id: new mongoose.Types.ObjectId(), 
//       name: 'test of B', 
//       nested: mockA[0]
//     } 
//   ]; 

//   await modelA.deleteMany(); 
//   await modelB.deleteMany(); 
  
//   await modelA.create(mockA); 
//   await modelB.create(mockB); 

//   const reada = await modelA.find(); 
//   const readb = await modelB.find(); 
//   // console.log('reada', reada) 
//   // console.log('readb', readb) 


// }



// const formatMetadataKey = Symbol("format");
// function format(formatString: string) {
//   return Reflect.metadata(formatMetadataKey, formatString);
// }
// function getFormat(target: any, propertyKey: string) {
//   return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
// }

// class Greeter {
//   @format("Hello, %s")
//   greeting: string;
//   constructor(message: string) {
//     this.greeting = message;
//   }
//   greet() {
//     let formatString = getFormat(this, "greeting");
//     return formatString.replace("%s", this.greeting);
//   }
// }
