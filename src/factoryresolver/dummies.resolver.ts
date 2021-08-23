import { ClassType, Field, ID, Int, ObjectType, Ctx, Root, Info, 
  Resolver, Query, Mutation, Arg, NonEmptyArray, InputType, FieldResolver } 
  from "type-graphql"; 
//import { getModelWithString } from "@typegoose/typegoose"; 
import { getModelForClass } from "@typegoose/typegoose"; 
import { ObjectId } from "mongoose";


// --------------------------------------------------------
import { A, B, } from './dummies.model'; 
import { ExtendFactoredResolver, CrudResolverFactory } from '../typegql.utils/crud.resolver'; 


const AResolver = ExtendFactoredResolver(A); 
const BResolver = ExtendFactoredResolver(B); 

export const dummiesResolver = [AResolver, BResolver] as NonEmptyArray<Function> | NonEmptyArray<string>; 



// @Resolver((of) => A) 
// export class AResolver { 
//   @Query((type) => [A]) 
//   async As(): Promise<A[]> { 
//     const model = getModelForClass(A); 
//     if(!model) 
//       return []; 
//     const result = await model.find({}); 
//     //console.log('find All ... result !! ', result); 
//     return result; 
//   }

//   // @FieldResolver() 
//   // async name(@Root() root:any, @Ctx ctx:any) { 

//   //   console.log("root a.name", Object.keys(root), JSON.stringify(root)); 
//   //   console.log('root name', root._bsontype); 
//   //   console.log('root name', root.id); 

//   //   console.log("ctx ", Object.keys(root), JSON.stringify(root)); 
//   //   //console.log(result);
//   //   return root.name; 
//   // }

//   /*@FieldResolver(type => String) 
//   async testField(@Root() root:any) { 
//     console.log('root testField', root); 
//     //console.log(result);
//     return 'testField'; 
//   }*/
// } 


// @Resolver((of) => B) 
// export class BResolver { 
//   @Query((type) => [B]) 
//   async Bs(@Ctx() ctx:any): Promise<B[]> { 
//     //console.log('ctx', ctx); 

//     const model = getModelForClass(B); 
//     if(!model) 
//       return []; 
//     const result = await model.find({}); 
//     return result; 
//   }

//   // @FieldResolver() 
//   // async nested(@Root() root:any, @Ctx() ctx:any) { 
//   //   // console.log('root nested', Object.keys(root), root); 
//   //   // console.log('ctx nested', Object.keys(ctx), ctx); 

//   //   // Object.entries(ctx).forEach( entry => {
//   //   //   console.log(entry[0], entry[1])
//   //   // }); 
//   //   //const nestedId = root.nested; 
//   //   console.log('root', root); 
//   //   //const result = await (getModelForClass(A)).findById(); 
//   //   // console.log('resolver', result); 
//   //   //const result = await submodel.findById(nestedId); 
//   //   console.log('result', root._doc.nested); 
    
//   //   return root._doc.nested; 
//   // }
// } 



// DUMMY RESOLVER ---------------------------------------------------------

// @Resolver((of) => Dummya) 
// export class DummyAResolver extends CrudBaseResolver(Dummya, InputDummya) { 
//   constructor() { 
//     super(); 
//   } 
// } 

// @Resolver((of) => Dummyb) 
// export class DummyBResolver { 
  
//   @Query((type) => [Dummyb])
//   async findAll(): Promise<Dummyb[]> { 
//     const model = getModelForClass(Dummyb); 
//     if(!model) 
//       return []; 
//     const result = await model.find(); 
//     console.log('find All ... result !! ', result); 
//     return result; 
//   }

//   @FieldResolver() 
//   async nested(@Root() dummyb:{_doc:any}) { 
//     const nestedId = (dummyb._doc as Dummyb).nested; 
//     const submodel = getModelForClass(Dummya); 
//     return await submodel.findById(nestedId); 
//   }
// } 

//export const dummiesResolver = []