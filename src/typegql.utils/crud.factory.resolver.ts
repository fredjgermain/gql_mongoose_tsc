import { ClassType, Resolver, Query, Mutation, Arg } 
  from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from "./object.scalar"; 
import { TypegooseCrud } from '../typegoose.utils/typegoose.utils'; 



/** CRUD RESOLVER FACTORY =============================================
 * Factor generic CrudResolver class from class ObjectType 
 * @param itemClass 
 * @returns 
 */
export function Crud_FactoryResolver<T extends ClassType>(itemClass:T):any { 
  const itemSuffix = itemClass.name; 

  // Factor generic CrudResult class containing errors and results items. 
  // @ObjectType(`CrudResult${itemSuffix}`) 
  // class CrudResult extends CrudResult_FactoryModel(itemClass) {} 

  // Factored abstract CrudResolver class 
  @Resolver({ isAbstract: true }) 
  abstract class CrudResolver { 
    //model = GetMongoModel(itemSuffix); 
    model = new TypegooseCrud(itemSuffix); 

    /** VALIDATE ------------------------------------------
     * Validates inputs 
     * - test mongoose validations. 
     * - test for duplicate fields values. 
     * 
     * @param inputs 
     * @returns ErrProp containning all inputs errors, if any. 
     */
    @Query(type => [ObjectScalar], {name:`Validate${itemSuffix}` }) 
    async Validate( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<InputError[]> { 
      try{
        return await this.model.ValidateInput(inputs); 
      } catch(err) { 
        throw err; 
      } 
    }

    

    /** CREATE --------------------------------------------
     * If the inputs are valid, 
      - they will be created and the newly created items will be returned in {items}. 
     * If ANY of the inputs is INVALID, 
      - NONE of the input will be created and errors will be returned in {errors}. 
     * @param inputs 
     * @returns 
     */
    @Mutation(type => [itemClass], { name: `Create${itemSuffix}` }) 
    async Create( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<T[]> { 
      try { 
        return (await this.model.Create(inputs)) as any[]; 
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
    @Query((type) => [itemClass], { name: `Read${itemSuffix}` }) 
    async Read( @Arg("ids", type => [String], { nullable: true }) ids?:string[] ): Promise<T[]>  { 
      try{
        return (await this.model.Read(ids)) as any[]; 
      } catch(err) {
        throw err; 
      }
    }



    /** UPDATE --------------------------------------------
     * If the inputs are valid, 
      - they will be updated and the modified items will be returned in {items}. 
      * If ANY of the inputs is INVALID, 
      - NONE of the input will be updated and errors will be returned in {errors}. 
      * @param inputs
      * @returns 
      */
    @Mutation(type => [itemClass], { name: `Update${itemSuffix}` })
    async Update( @Arg("inputs", type => [ObjectScalar]) inputs:any[] ): Promise<T[]> { 
      try{ 
        return (await this.model.Update(inputs)) as any[]; 
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
    @Mutation(type => [itemClass], { name: `Delete${itemSuffix}` }) 
    async Delete( @Arg("ids", type => [String]) ids:string[] ): Promise<T[]> { 
      try{ 
        return (await this.model.Delete(ids)) as any[]; 
      } catch(err) { 
        throw err; 
      }
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

