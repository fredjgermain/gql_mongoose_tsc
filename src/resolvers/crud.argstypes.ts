import { Field, ID, ArgsType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from '../models/customscalar'; 



// ARGSTYPES ############################################## 
@ArgsType() 
export class FeedbackMsgArg { 
  @Field(type => [String]) 
  feedbackNames: string[]; 
}

@ArgsType() 
export class ModelNameArg { 
  @Field(type => String) 
  modelName: string; 
}

@ArgsType() 
export class ModelIdsArgs extends ModelNameArg { 
  @Field(type => [ID], {nullable:true} ) 
  ids: string[]; 
}

@ArgsType() 
export class CreateArgs extends ModelNameArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: object[]; 
} 

@ArgsType() 
export class UpdateArgs extends ModelNameArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: object[]; 
} 
