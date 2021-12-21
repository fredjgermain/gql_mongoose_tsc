// import { ObjectType, Field, ID } 
//   from "type-graphql"; 
// import { prop } from "@typegoose/typegoose"; 


// // -------------------------------------------------------- 
// import { ObjectScalar } from "../customscalar/object.scalar"; 
// import { TypegooseModel } from "../../typegoose.utils/typegoose.utils"; 



// // MODELDESCRIPTOR ===============================================
// @ObjectType() 
// export class ModelDescriptor { 
//   @Field(type => ID) 
//   _id: string; 

//   @Field( type => String ) 
//   @prop({ type:String, required:true, unique:true }) 
//   accessor: string; 
  
//   @Field(type => [String]) 
//   @prop({ type:[String], required:true }) 
//   label: string[]; 

//   @Field(type => [String]) 
//   @prop({ type:[String], required:true }) 
//   description: string[]; 

//   @Field(type => [ObjectScalar]) // replace with IField type ?? 
//   ifields(): object[] { 
//     const _this = (this as any)._doc as ModelDescriptor; 
//     const model = new TypegooseModel(_this.accessor); 
//     return model?.model?.ifields ?? []; 
//   } 
// } 

