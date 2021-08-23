import { ObjectId } from "mongodb"; 
import { ClassType, Resolver, Query, ObjectType, Field } 
  from "type-graphql"; 
import { prop, getModelForClass } from "@typegoose/typegoose"; 

// -------------------------------------------------------- 
import { ObjectScalar } from "./customscalar/object.scalar"; 
import { ObjectIdScalar } from "./customscalar/objectid.scalar"; 
import { GetIFields, GetMongoModel } from "../typegoose.utils/typegoosemodel.util";



export const GQLModelDescriptor = { 
  //_id: new mongoose.Types.ObjectId(), 
  accessor:'GQLModel', 
  label:['GQLModel'], 
  description: [''], 
} 



// GQLModel ===============================================
@ObjectType() 
export class GQLModel { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 

  @Field( type => String ) 
  @prop({ type:String, required:true, unique:true }) 
  accessor: string; 
  
  @Field(type => [String]) 
  @prop({ type:[String], required:true }) 
  label: string[]; 

  @Field(type => [String]) 
  @prop({ type:[String], required:true }) 
  description: string[]; 

  @Field(type => [ObjectScalar]) // replace with IField type ?? 
  @prop({ type:[ObjectScalar], required:true }) 
  ifields: any[]; 
} 



/** CRUD RESOLVER FACTORY =============================================
 * Factor generic CrudResolver class from class ObjectType 
 * @param itemClass 
 * @returns 
 */
export function ModelResolverFactory<T extends ClassType>(itemClass:T):any { 
  const itemSuffix = itemClass.name; 

  // Factored abstract CrudResolver class 
  @Resolver({ isAbstract: true }) 
  abstract class ModelResolverFactoryClass { 
    /** MODEL ----------------------------------------------
     * 
     * @returns 
     */
    @Query(type => GQLModel, {name:`GQLModels${itemSuffix}`}) 
    async GQLModels(): Promise<GQLModel> { 
      const gqlmodel = getModelForClass(GQLModel); 
      const [found] =  await gqlmodel.find({accessor:itemSuffix}) 
      return found; 
    } 
  } 
  return ModelResolverFactoryClass; 
} 



/** ExtendFactoredModelResolver 
 * Helps extends a generic CrudResolver class from Objectype class 
 * @param itemClass 
 * @returns 
 */ 
export function ExtendFactoredModelResolver<T extends ClassType>(itemClass:T) { 
  
  const BaseResolver = ModelResolverFactory(itemClass); 
  @Resolver(of => itemClass) 
  class FactoriedResolver extends BaseResolver {} 
  return FactoriedResolver; 
} 



/** RegisterGQLModel ----------------------------------------------------
 * Register a model and add its model description to the GQLModel collection. 
 * 
 * @param toRegister 
 * @param modelDescriptor 
 * @returns 
 */
export async function RegisterGQLModel( toRegister:any, modelDescriptor:GQLModel ) { 
  const gqlModel = getModelForClass(GQLModel); 
  getModelForClass(toRegister); 
  const {model} = GetMongoModel(modelDescriptor.accessor); 
  if(!model) 
    return; 
  modelDescriptor.ifields = GetIFields(model); 
  await gqlModel.create(modelDescriptor); 
} 
