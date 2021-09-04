import { Field, ObjectType, ID, Resolver, FieldResolver, Root } 
  from "type-graphql"; 
import { prop, Ref } 
  from "@typegoose/typegoose"; 

// --------------------------------------------------------------- 
//import { OneToOne, OneToMany } from '../../typegoose.utils/typegoosemodel.util'; 


export const descriptorPatient = { 
  accessor: 'Patient', 
  label: ['Patient', 'Patient'], 
  description: ['Patient profile', 'Profile de patient'] 
} 


/** Patient
 * Patient profile
 * 
 * ramq
 * firstname
 * lastname
 * birthday
 * coordonnate ... 
 */

/* COORDONNATES ?? 
@prop({label: ["phone number", "No de téléphone"], 
  required:true, unique:true, match: '^[a-zA-Z]{4}[0-9]{8}$'}) 
phone: string[]; 

@prop({label: ["email", "courriel"], 
  required:true, unique:true, match: '^[a-zA-Z]{4}[0-9]{8}$'}) 
email: string[]; */

/*@prop({label: ["email", "courriel"], 
  required:true, unique:true, match: '^[a-zA-Z]{4}[0-9]{8}$'}) 
address: string[]; */
// match: '^[a-zA-Z]{4}[0-9]{8}$'


@ObjectType({description:"Patient"})
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
@Resolver(type => Patient) 
export class PatientAbbrevResolver { 
  @FieldResolver(type => String) 
  public async abbrev(@Root() root:any) { 
    const item:Patient = root._doc; 
    return `${item.firstname}, ${item.lastname}`;
  } 
} 