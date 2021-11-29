import { Field, ObjectType, ID } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 
  
// --------------------------------------------------------------- 
import { OneToOne, OneToMany } from '../../typegoose.utils/datarelation.util'; 
import { Registeration } from "../../typegoose.utils/modelregister"; 
import { CrudStack } from "../../typegql.utils/resolverstack";


export const descriptorA = { 
  accessor: 'A', 
  label: ['label A'], 
  description: ['dummy A'] 
} 


@Registeration({description:['dummy A'] , label:['label A']}) 
@CrudStack() 
@ObjectType({ description: "The DummyA model from decorator" })
export class A { 
  @Field(type => ID) 
  _id: string; 
  /*@Field(type => ObjectIdScalar) 
  readonly _id: ObjectId; */

  @Field(type => String) 
  @prop({ type:String, required:true }) 
  name: string; 
}


export const descriptorB = { 
  accessor: 'B', 
  label: ['label B'], 
  description: ['dummy B'] 
} 

@Registeration({description:['dummy B'] , label:['label B']}) 
@CrudStack() 
@ObjectType({ description: "The DummyB model" })
export class B extends A { 
  @Field(() => A) 
  @prop({...OneToOne(A)}) 
  nested: Ref<A> 
} 


export const descriptorC = { 
  accessor: 'C', 
  label: ['model C'], 
  description: ['dummy C'] 
} 

@Registeration({description:['dummy C'] , label:['label C']}) 
@CrudStack() 
@ObjectType({ description: "The DummyC model" })
export class C extends A{ 
  @Field( () => [String] ) 
  @prop( {type: [String]} ) 
  array: string[]; 

  @Field(() => B) 
  @prop({...OneToOne(B)}) 
  nested: Ref<B> 

  @Field(() => [B], {nullable:true}) 
  @prop({...OneToMany(B)}) 
  manyNested?: Ref<B[]> 
} 



export const descriptorD = { 
  accessor: 'D', 
  label: ['model D'], 
  description: ['dummy D'] 
} 

@Registeration({description:['dummy D'] , label:['label D']}) 
@CrudStack() 
@ObjectType({ description: "The DummyD model" }) 
export class D extends A { 
  // @Field(type => String) 
  // @prop({ type:String, required:true }) 
  // str: string; 

  @Field(type => Number) 
  @prop({ type:Number, required:true, 
    validate:{ 
      validator: v => v > 0 && v < 100, 
      message: "`{PATH}` .... `{VALUE}`"
      // message: "Must be between 0 and 100", 
    }}) 
  age: string; 
} 


