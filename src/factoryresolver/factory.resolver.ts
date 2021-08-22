//import { ObjectId } from "mongodb"; 
import { ClassType, Resolver, Query, Mutation, Arg, 
  ObjectType, Field, Int  } 
  from "type-graphql"; 
//import { Type } from '@nestjs/common'; 
import { getModelWithString } from "@typegoose/typegoose"; 
import { ObjectScalar } from "../typegql.utils/customscalar"; 

//import { prop as Property, getModelForClass } from "@typegoose/typegoose"; 

// --------------------------------------------------------
import { ValidateInputs, ValidateToCreate, ValidateIdsToFind } from './validation.utils'; 
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 
import { GqlResultFactory, GQLError, GQLModel } from "./return.class"; 
import { FetchIModel } from "../typegoose.utils/model/model.util";
import { ItemsExist } from "../typegoose.utils/item.utils";
import { IModel } from "../../lib/ifield.interface";
//import { GQLError } from "./return.class"; 


@ObjectType() 
class CrudResultModel{ 
  @Field(type => [GQLModel]) 
  items: GQLModel[]; 

  @Field(() => [ObjectScalar], {nullable:true}) 
  errors?: ErrProp[]; 
}


@Resolver() 
export class ModelResolver { 
  /** MODELS ------------------------------------------
   * Validates inputs 
   * - test mongoose validations. 
   * - test for duplicate fields values. 
   * 
   * @param modelsName 
   * @returns ErrProp containning all inputs errors, if any. 
   */
  @Query(type => CrudResultModel) 
  async Models( @Arg("modelsName", type => [String]) modelsName:string[] ): Promise<CrudResultModel> { 
    const crudResultModel = {items:[] as GQLModel[], errors:[] as ErrProp[]}; 
    for(let i =0; i < modelsName.length; i++) { 
      const {model, error} = await FetchIModel(modelsName[i]); 
      if(!!model) 
        crudResultModel.items.push(model); 
      else if (!!error) 
        crudResultModel.errors.push(error); 
    } 
    return crudResultModel; 
  }
}



/** CRUD RESOLVER FACTORY =============================================
 * Factor generic CrudResolver class from class ObjectType 
 * @param itemClass 
 * @returns 
 */
export function CrudResolverFactory<T extends ClassType>(itemClass:T):any { 
  const itemSuffix = itemClass.name; 

  @ObjectType(`CrudResult${itemSuffix}`) 
  class CrudResult extends GqlResultFactory(itemClass) {} 


  @Resolver({ isAbstract: true }) 
  abstract class CrudBaseResolverClass { 
    
    @Query(type => ObjectScalar, {name:`Model_${itemSuffix}`}) 
    async Model(): Promise<any> { 
      console.log(itemSuffix); 
      const {model} = await FetchIModel(itemSuffix); 
      console.log(model); 
      if(!model) 
        throw new Error("Model error"); 
      return model; 
    }

    /** VALIDATE ------------------------------------------
     * Validates inputs 
     * - test mongoose validations. 
     * - test for duplicate fields values. 
     * 
     * @param toValidate 
     * @returns ErrProp containning all inputs errors, if any. 
     */
    @Query(type => [ObjectScalar], {name:`Validate${itemSuffix}` }) 
    async Validate( @Arg("toValidate", type => [ObjectScalar]) toValidate:any[] ): Promise<ErrProp[]> { 
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return []; 
      return await ValidateInputs(model, toValidate); 
    }



    /** CREATE --------------------------------------------
     * If the inputs are valid, 
      - they will be created and the newly created items will be returned in {items}. 
     * If ANY of the inputs is INVALID, 
      - NONE of the input will be created and errors will be returned in {errors}. 
     * @param toCreate 
     * @returns 
     */
    @Mutation(type => CrudResult, { name: `Create${itemSuffix}` }) 
    async Create( @Arg("toCreate", type => [ObjectScalar]) toCreate:any[] ): Promise<CrudResult> { 
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      const errors = await ValidateToCreate(model, toCreate); 
      if(errors.length > 0) 
        return {items:[], errors} 
      try{ 
        const items = await model.create(toCreate); 
        return {items} 
      } catch(err) { 
        throw err; 
      } 
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
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
      if(errors.length > 0) 
        return {items:[], errors} 
      try { 
        const selector = ids ? {_id: {$in: ids}} : {}; 
        const items = await model.find(selector); 
        return {items}; 
      } catch(err) { 
        throw err; 
      } 
    }



    /** UPDATE --------------------------------------------
     * If the inputs are valid, 
      - they will be updated and the modified items will be returned in {items}. 
     * If ANY of the inputs is INVALID, 
      - NONE of the input will be updated and errors will be returned in {errors}. 
     * @param toUpdate 
     * @returns 
     */
    @Mutation(type => CrudResult, { name: `Update${itemSuffix}` })
    async Update( @Arg("toUpdate", type => [ObjectScalar]) toUpdate:any[] ): Promise<CrudResult> { 
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      const errors = await ValidateInputs(model, toUpdate); 
      if(errors.length > 0) 
        return {items:[], errors} 
      try { 
        for(let i = 0; i < toUpdate.length; i++) { 
          const {_id, ...parsedItem} = toUpdate[i]; 
          await model.updateOne({_id:_id}, parsedItem); 
        } 
        const ids = toUpdate.map( item => item._id ); 
        const items = await model.find({_id: {$in: ids}}); 
        return {items}; 
      } catch(err) { 
        throw err; 
      } 
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
      const model = getModelWithString(itemSuffix); 
      if(!model) 
        return {items:[], errors:[]}; 
      const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
      if(errors.length > 0) 
        return {items:[], errors} 
      try { 
        const items = await model.find({_id: {$in: ids}}); 
        await model.deleteMany({_id: {$in: ids}}); 
        return {items}; 
      } catch(err) { 
        throw err; 
      } 
    }

  }
  return CrudBaseResolverClass; 
}


/** ExtendsFactoredResolver 
 * Helps extends a generic CrudResolver class from Objectype class 
 * @param itemClass 
 * @returns 
 */
export function ExtendFactoredResolver<T extends ClassType>(itemClass:T) { 
  
  const BaseResolver = CrudResolverFactory(itemClass); 
  @Resolver(of => itemClass) 
  class FactoriedResolver extends BaseResolver {} 
  return FactoriedResolver; 
} 


