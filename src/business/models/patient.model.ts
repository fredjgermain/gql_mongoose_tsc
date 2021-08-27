import { Field, ObjectType, ID } 
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
}