import mongoose, { ObjectId } from 'mongoose'; 
//import "reflect-metadata";


import { Field, ID, Int, ObjectType, InputType } 
  from "type-graphql"; 
//import { getModelWithString } from "@typegoose/typegoose"; 
import { prop, getModelForClass, Ref } from "@typegoose/typegoose"; 


// ---------------------------------------------------------------
import { ObjectIdScalar } from '../typegql.utils/customscalar/objectid.scalar'; 




@ObjectType({ description: "The DummyA model" })
export class A { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 
  // @Field(() => ID) 
  // id: string; 

  @Field(type => String) 
  @prop({type:String, required:true }) 
  name: string; 

  @Field(type => String) 
  @prop({type:String}) 
  otherName: string; 
}

@ObjectType({ description: "The DummyA model" })
export class B { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 
  // @Field(() => ID) 
  // id: string; 

  @Field(type => String) 
  @prop({type:String}) 
  name: string; 

  @Field(() => A) 
  @prop({ref: () => A, set: (val:A) => val, get: (val:any) => val}) 
  nested: Ref<A> 
}


/// INPUT ==================================================
// @InputType({ description: "The A input" })
// export class AInput { 
//   @Field(type => ObjectIdScalar) 
//   readonly _id: ObjectId; 

//   @Field(type => String) 
//   @prop({ type:String }) 
//   name: string; 
// }

// @InputType({ description: "The B input" })
// export class BInput { 
//   @Field(type => ObjectIdScalar) 
//   readonly _id: ObjectId; 

//   @Field(type => String) 
//   @prop({type:String}) 
//   name: string; 

//   /*@Field(() => A) 
//   @prop({ref: () => A}) 
//   nested: Ref<A> */
// }



// /// DUMMY ==================================================
// //getModelForClass(DummyA); // Necessary to find datas in DB
// @ObjectType({ description: "The DummyA model" })
// export class Dummya extends Base { 
//   @Field()
//   @prop() 
//   name: string; 
// }

// @ObjectType({ description: "The DummyA model" })
// export class Dummyb extends Base { 
//   @Field()
//   @prop() 
//   name: string; 

//   @Field( type => Dummya ) 
//   @prop({ref: () => Dummya}) 
//   nested: Ref<Dummya>; 
// }


// // DUMMY OBJECT CLASS 
// @InputType({ description: "DummyA input" })
// export class InputDummya {
//   @Field( type => String ) 
//   @prop()
//   name: string;
// }

// // DUMMY OBJECT CLASS 
// @InputType({ description: "DummyB input" })
// export class InputDummyb { 
//   @Field()
//   @prop() 
//   name: string; 

//   @Field( type => InputDummya ) 
//   @prop({ref: () => InputDummya}) 
//   nested: InputDummya; 
// }




export async function RegisterModel() { 

  // A and B
  const modelA = getModelForClass(A); // Necessary to find datas in DB 
  const modelB = getModelForClass(B); // Necessary to find datas in DB 

  const mockA = [ 
    {
      _id: new mongoose.Types.ObjectId(), 
      name: 'test A'} 
  ] 
  const mockB = [ 
    { 
      _id: new mongoose.Types.ObjectId(), 
      name: 'test of B', 
      nested: mockA[0]
    } 
  ]; 

  await modelA.deleteMany(); 
  await modelB.deleteMany(); 
  
  await modelA.create(mockA); 
  await modelB.create(mockB); 

  const reada = await modelA.find(); 
  const readb = await modelB.find(); 
  // console.log('reada', reada) 
  // console.log('readb', readb) 


  // // DUMMIES
  // const modelDA = getModelForClass(Dummya); // Necessary to find datas in DB 
  // const modelDB = getModelForClass(Dummyb); // Necessary to find datas in DB 

  // await modelDA.deleteMany(); 
  // await modelDB.deleteMany(); 

  // const mockDA = [ 
  //   {_id: new mongoose.Types.ObjectId(), name: 'test DA'} 
  // ] 
  // const mockDB = [ 
  //   {name:'test DB', nested: mockDA[0]} 
  // ] as Dummyb[]; 

  // await modelDA.create(mockDA); 
  // await modelDB.create(mockDB); 


  // const readda = await modelDA.find(); 
  // const readdb = await modelDB.find(); 

  // console.log('readda', readda) 
  // console.log('readdb', readdb) 
}



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
