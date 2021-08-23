import { Resolver, Query, Arg, 
  ObjectType, Field } 
  from "type-graphql"; 
import { ObjectScalar } from "./customscalar/object.scalar"; 


// --------------------------------------------------------
import { ErrProp } from "../typegoose.utils/validation/errprop.class"; 
import { GQLModel, CrudResultModel } from "./return.class"; 
import { FetchIModel } from "../typegoose.utils/typegoosemodel/typegoosemodel.util"; 




/** MODEL RESOLVER ==================================================
 * Resolver to fetch model's description 
 */
@Resolver() 
export class ModelResolver { 
  /** MODELS ------------------------------------------
   * Fetch and return models listed in modelsName. 
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
