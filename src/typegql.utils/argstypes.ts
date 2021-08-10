import { Field, ID, ArgsType } from "type-graphql"; 

// --------------------------------------------------------
import { ObjectScalar } from './customscalar'; 
import { Item, Input } from "../typegoose.utils/item.utils";



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
export class FieldsArg extends ModelNameArg { 
  @Field(type => [String], {nullable:true}) 
  fields: string[]; 
}

@ArgsType() 
export class ValidateArg extends ModelNameArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: Input[]; 
} 

@ArgsType() 
export class ModelIdsArgs extends FieldsArg { 
  @Field(type => [ID], {nullable:true} ) 
  ids: string[]; 
}

@ArgsType() 
export class CreateArgs extends FieldsArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: Input[]; 
} 

@ArgsType() 
export class UpdateArgs extends FieldsArg { 
  @Field(type => [ObjectScalar] ) 
  inputs: Item[]; 
} 
