import { Resolver, Arg, Query,  } 
  from "type-graphql"; 
//import { getModelWithString } from "@typegoose/typegoose"; 
import { getModelForClass, prop } from "@typegoose/typegoose"; 

// ---------------------------------------------------------------
import { MLabel } from './mlabel.model'; 



/** MLABEL RESOLVER ==================================================
 * Resolver to fetch model's description 
 */
@Resolver() 
export class MLabelResolver { 

  
  @Query(type => [MLabel]) 
  async MLabels( @Arg("labelsName", type => [String], {nullable:true}) labelsName?:string[] ): Promise<MLabel[]> { 
    const model = getModelForClass(MLabel); 
    const labels = (await model.find()) as MLabel[] 
    return labels.filter( label => labelsName?.includes(label.name) ?? true ) 
  }
}