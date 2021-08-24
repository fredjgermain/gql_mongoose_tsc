import { ObjectId } from 'mongoose'; 
//import "reflect-metadata";


import { Field, ObjectType, Resolver, Arg, Query,  } 
  from "type-graphql"; 
//import { getModelWithString } from "@typegoose/typegoose"; 
import { getModelForClass, prop } from "@typegoose/typegoose"; 

// ---------------------------------------------------------------
import { ObjectIdScalar } from './customscalar/objectid.scalar'; 



export const MLabelDescriptor = { 
  //_id: new mongoose.Types.ObjectId(), 
  accessor:'MLabel', 
  label:['MLabel'], 
  description: [''], 
} 



// MLabel ================================================= 
@ObjectType({ description: "Multi lingual label" }) 
export class MLabel { 
  @Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; 
  // @Field(() => ID) 
  // id: string; 

  @Field(type => String) 
  @prop({label: ["Name", "Nom"], 
  required:true, unique:true, abbrev:true}) 
  name: string; 

  @Field(type => [String]) 
  @prop({type:[String], required:true }) 
  label: string[]; 
}



/** MLABEL RESOLVER ==================================================
 * Resolver to fetch model's description 
 */
@Resolver() 
export class MLabelResolver { 
  @Query(type => [MLabel]) 
  async MLabel( @Arg("labelsName", type => [String], {nullable:true}) labelsName?:string[] ): Promise<MLabel[]> { 
    const model = getModelForClass(MLabel); 
    const labels = (await model.find()) as MLabel[] 
    return labels.filter( label => labelsName?.includes(label.name) ?? true ) 
  }
}