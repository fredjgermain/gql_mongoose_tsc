// https://dev.to/cuzox/dynamically-convert-plain-objects-into-typescript-classes-1cjg


import { ClassType, Field, ID, Int, 
  Resolver, Query, Mutation, Arg, NonEmptyArray, InputType } 
  from "type-graphql"; 
import { getModelWithString } from "@typegoose/typegoose"; 
import { ObjectId } from "mongodb"; 

// ------------------------------
import { ObjectIdScalar, ObjectScalar } from '../typegql.utils/customscalar/object.scalar'; 


function createBaseResolver<T extends ClassType, C extends ClassType, U extends ClassType> 
(suffix: string, objectTypeClass: T, createInputClass:C, updateInputClass:U) { 
  const model = getModelWithString(suffix); 

  @Resolver({ isAbstract: true }) 
  abstract class BaseResolver { 

    @Query(type => Int, { name: `Count${suffix}` }) 
    async Count(): Promise<number> { 
      // CASE SENSITIVE !!! Requires that getModelForClass has been used 
      if(!model) 
        return 0; 
      return await (await model.find()).length; 
    } 

    @Query(type => [ObjectIdScalar]) 
    async TestObjectIdScalar(@Arg("input", type => [ObjectIdScalar]) input: ObjectId): Promise<object[]> { 
      return [input]; 
    } 


    // ObjectScalar must not have a selection since type \"[ObjectScalar!]!\" has no subfields."
    @Query(type => [ObjectScalar]) 
    async TestObjectScalar(@Arg("input", type => [ObjectScalar]) input: Object): Promise<object> { 
      return input; 
    } 

    // READ =====================================
    @Query(type => [objectTypeClass], { name: `Read${suffix}` }) 
    async Read(): Promise<T[]> { 
      // CASE SENSITIVE !!! Requires that getModelForClass has been used 
      if(!model) 
        return []; 
      return await model.find(); 
    } 

    // CREATE ===================================
    @Mutation(type => [objectTypeClass], { name: `Create${suffix}` }) 
    async Create(@Arg("toCreate", type => [createInputClass]) toCreate: U[]): Promise<T[]> { 
      if(!model) 
        return []; 
      return await model.create(toCreate); 
    } 

    // UPDATE =====================================
    /*@Mutation(type => [objectTypeClass], { name: `Update${suffix}` }) 
    async Update(@Arg("toUpdate", type => [updateInputClass]) toUpdate: U[]): Promise<T[]> { 
      if(!model) 
        return []; 
      for(let i=0; i<toUpdate.length; i++) { 
        await model.updateOne({_id: ids[i] }, toUpdate[i]) 
      } 
      return await model.find(); 
    }*/

    // DELETE =====================================
    @Mutation(type => [objectTypeClass], { name: `Delete${suffix}` }) 
    async Delete(@Arg("toDelete", type => [ID]) toDelete: string[]): Promise<T[]> { 
      if(!model) 
        return []; 
      for(let i=0; i<toDelete.length; i++) { 
        await model.deleteOne({_id: toDelete[i] }) 
      } 
      return await model.find(); 
    }
    

    @Query(type => [String]) 
    async GetAny(@Arg("modelName", type => String) modelName: string): Promise<string[]> { 
      // CASE SENSITIVE !!! Requires that getModelForClass has been used 
      if(!model) 
        return []; 
      const items = await model.find(); 
      const toJson = items.map(i => JSON.stringify(i)); 
      //console.log(toJson.map(i=>JSON.parse(i))); 
      return toJson; 
    } 
  } 

  return BaseResolver; 
} 

export function FactoryResolver<T extends ClassType, C extends ClassType, U extends ClassType> 
  (objectTypeClass: T, createInputClass:C, updateInputClass:U) { 
  
  const BaseResolver = createBaseResolver(objectTypeClass.name, objectTypeClass, createInputClass, updateInputClass); 
  @Resolver(of => objectTypeClass) 
  class FactoriedResolver extends BaseResolver {} 
  return FactoriedResolver; 
} 
