import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
import { ModelStack } from "../../prepping/typegoose.stacker"; 
import { CrudResolverStack, ResolverStack } from "../../prepping/typegql.stacker";



/** Patient
 * Patient profile
 * 
 * ramq
 * firstname
 * lastname
 * birthday
 * coordonnate ... 
 */
@ModelStack({description:'Patient profile' , label:'Patient'}) 
@CrudResolverStack() 
@ObjectType({description:"Patient profile"})
export class Patient { 
  @Field(type => ID) 
  _id: string; 

  @Field() 
  @prop({label: ["RAMQ", "RAMQ"], 
    required:true, unique:true}) 
  ramq!: string; 

  @Field() 
  @prop({label: ["first name", "prénom"], 
    required:true}) 
  firstname!: string; 

  @Field() 
  @prop({label: ["last name", "nom"], 
    required:true}) 
  lastname!: string; 

  @Field() 
  @prop({label: ["birthday", "date de naissance"]}) 
  birthday: Date; 

  // @Field(() => String, {nullable:true})
  // async abbrev() { 
  //   const _this = (this as any)._doc as Patient; 
  //   return `${_this.ramq}`; 
  // }
}


// AbbrevResolver -----------------------------------------
@ResolverStack() 
@Resolver(type => Patient) 
export class PatientAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Patient = root._doc; 
    return `${item.firstname}, ${item.lastname}`;
  } 
} 