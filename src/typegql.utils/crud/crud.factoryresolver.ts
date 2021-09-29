//import { ObjectId } from "mongodb"; 
import { ClassType, Resolver, Query, Mutation, Arg, ObjectType } 
  from "type-graphql"; 
//import { Type } from '@nestjs/common'; 
import { getModelWithString } from "@typegoose/typegoose"; 


//import { prop as Property, getModelForClass } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { ObjectScalar } from "../customscalar/object.scalar"; 
import { ValidateInputs } from '../../typegoose.utils/validation/validation.action'; 
import { ErrProp } from "../../typegoose.utils/validation/errprop.class"; 
import { CrudResult_FactoryModel } from "./result.factorymodel"; 
import { GetMongoModel } from "../../typegoose.utils/typegoosemodel.util"; 
import * as CrudAction from '../../typegoose.utils/crud.actions'; 



/** CRUD RESOLVER FACTORY =============================================
 * Factor generic CrudResolver class from class ObjectType 
 * @param itemClass 
 * @returns 
 */
export function Crud_FactoryResolver<T extends ClassType>(itemClass:T):any { 
  const itemSuffix = itemClass.name; 


  // Factor generic CrudResult class containing errors and results items. 
  @ObjectType(`CrudResult${itemSuffix}`) 
  class CrudResult extends CrudResult_FactoryModel(itemClass) {} 



  // Factored abstract CrudResolver class 
  @Resolver({ isAbstract: true }) 
  abstract class CrudResolver { 


    /** VALIDATE ------------------------------------------
     * Validates inputs 
     * - test mongoose validations. 
     * - test for duplicate fields values. 
     * 
     * @param inputs 
     * @returns ErrProp containning all inputs errors, if any. 
     */
    @Query(type => [ObjectScalar], {name:`Validate${itemSuffix}` }) 
    async Validate( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<ErrProp[]> { 
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return []; 
      return await ValidateInputs(model, inputs); 
    }



    /** CREATE --------------------------------------------
     * If the inputs are valid, 
      - they will be created and the newly created items will be returned in {items}. 
     * If ANY of the inputs is INVALID, 
      - NONE of the input will be created and errors will be returned in {errors}. 
     * @param inputs 
     * @returns 
     */
    @Mutation(type => CrudResult, { name: `Create${itemSuffix}` }) 
    async Create( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<CrudResult> { 
      const {model} = GetMongoModel(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      return await CrudAction.Create(model, inputs); 
    } 



    /** READ --------------------------------------------
     * If the ids are found, 
      - the corresponding items will be return in {items} 
     * If ANY of the IDS is UNFOUND, 
      - NONE of the items will be returned and an error will be returned in {errors}. 
     * @param ids 
     * @returns 
     */
    @Query((type) => CrudResult, { name: `Read${itemSuffix}` }) 
    async Read( @Arg("ids", type => [String], { nullable: true }) ids?:string[] ): Promise<CrudResult> { 
      const {model} = GetMongoModel(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      return await CrudAction.Read(model, ids); 
    }



    /** UPDATE --------------------------------------------
     * If the inputs are valid, 
      - they will be updated and the modified items will be returned in {items}. 
     * If ANY of the inputs is INVALID, 
      - NONE of the input will be updated and errors will be returned in {errors}. 
     * @param inputs
     * @returns 
     */
    @Mutation(type => CrudResult, { name: `Update${itemSuffix}` })
    async Update( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<CrudResult> { 
      const {model} = GetMongoModel(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      return await CrudAction.Update(model, inputs); 
    } 



    /** DELETE --------------------------------------------
     * If the ids are found, 
      - the corresponding items will be deleted and returned in {items} 
     * If ANY of the IDS is UNFOUND, 
      - NONE of the items will be deleted and an error will be returned in {errors}. 
     * @param ids 
     * @returns 
     */
    @Mutation(type => CrudResult, { name: `Delete${itemSuffix}` }) 
    async Delete( @Arg("ids", type => [String]) ids:string[] ): Promise<CrudResult> { 
      const {model} = GetMongoModel(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      return await CrudAction.Delete(model, ids); 
    } 
  } 
  return CrudResolver; 
} 



/** ExtendsFactoredResolver 
 * Helps extends a generic CrudResolver class from Objectype class 
 * @param itemClass 
 * @returns 
 */
export function Extend_Crud_FactoryResolver<T extends ClassType>(itemClass:T) { 
  
  const BaseResolver = Crud_FactoryResolver(itemClass); 
  @Resolver(of => itemClass) 
  class FactoriedResolver extends BaseResolver {} 
  return FactoriedResolver; 
} 


