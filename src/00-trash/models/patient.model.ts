import { prop } from "@typegoose/typegoose"; 
import { Base } from '@typegoose/typegoose/lib/defaultClasses'; 

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

export class Patient extends Base { 
  @prop({label: ["RAMQ", "RAMQ"], 
    required:true, unique:true}) 
  ramq!: string; 

  @prop({label: ["first name", "prénom"], 
    required:true}) 
  firstname!: string; 

  @prop({label: ["last name", "nom"], 
    required:true}) 
  lastname!: string; 

  @prop({label: ["birthday", "date de naissance"]}) 
  birthday: Date; 
}
