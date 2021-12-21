// import { ClassType, Resolver, Query, ObjectType, Field, Arg } 
//   from "type-graphql"; 
// import { prop, getModelForClass } from "@typegoose/typegoose"; 



// // -------------------------------------------------------- 
// import { ModelDescriptor } from './modeldescriptor.model'; 
// import { TypegooseModel } from '../../typegoose.utils/typegoose.utils'; 
// // import { GetIFields, GetMongoModel } from "../../typegoose.utils/typegoosemodel.util"; 



// /** MODELDESCRIPTOR RESOLVER FACTORY ======================
//  * Factor generic ModelDescriptorResolver factory
//  * 
//  * @param itemClass 
//  * @returns 
//  */
// export function ModelDescriptor_FactoryResolver<T extends ClassType>(itemClass:T):any { 
//   const itemSuffix = itemClass.name; 

//   // Factored abstract CrudResolver class 
//   @Resolver({ isAbstract: true }) 
//   abstract class ModelResolverFactoryClass { 
//     /** MODEL ----------------------------------------------
//      * 
//      * @returns 
//      */
//     @Query(type => ModelDescriptor, {name:`ModelDescriptor${itemSuffix}`}) 
//     async ModelDescriptor(): Promise<ModelDescriptor> { 
//       const model = getModelForClass(ModelDescriptor); 
//       const [found] = await model.find({accessor:itemSuffix}) 
//       return found; 
//     } 
//   } 
//   return ModelResolverFactoryClass; 
// } 



// /** ExtendFactoredModelResolver 
//  * Helps extends a generic CrudResolver class from Objectype class 
//  * @param itemClass 
//  * @returns 
//  */ 
//  export function Extend_ModelDescriptor_FactoryResolver<T extends ClassType>(itemClass:T) { 
//   const BaseResolver = ModelDescriptor_FactoryResolver(itemClass); 
//   @Resolver(of => itemClass) 
//   class FactoriedResolver extends BaseResolver {} 
//   return FactoriedResolver; 
// } 


// /** ModelDescriptorsResolver ======================================
//  * 
//  */
// @Resolver() 
// export class ModelDescriptorsResolver{ 

//   /** ModelDescriptors =========================================== 
//    * 
//    * @returns 
//    */
//   @Query(type => [ModelDescriptor]) 
//   async ModelDescriptors( @Arg("modelsName", type => [String], { nullable: true }) modelsName?:string[] ): Promise<ModelDescriptor[]> { 
//     // const model = getModelForClass(ModelDescriptor); 
//     // return (await model.find()).filter( gqlmodel => modelsName?.includes(gqlmodel.accessor) ?? true ) 
//     const results = (await TypegooseModel.GetIModels({modelsName:(modelsName??[])}) ) as any[]; 
//     return results; 
//   } 
// }


