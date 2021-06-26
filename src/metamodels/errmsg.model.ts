import { prop } from "@typegoose/typegoose"; 


/** ErrMsg 
 * ErrMsg stores multilingual error messages 
 * ?ErrMsg ought to be searched by accessor, rather than by Id? 
*/
export class ErrMsg { 
  // unique accessor for errmsg 
  @prop({required:true, unique:true}) 
  accessor: string; 

  // Multilingual error messages. 
  @prop({required:true}) 
  errmsg: string[]; 
} 