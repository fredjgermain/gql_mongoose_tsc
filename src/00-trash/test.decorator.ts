import { ClassType } from "type-graphql";
import { ClassTypeResolver } from "type-graphql/dist/decorators/types";



function Deco(arg:string) { 
  console.log("Deco1", arg); 
  return function(target:any) { 
    console.log("target:", target.prototype); 
    //console.log("key", key); 
    //console.log("des", des.value); 
    //des.value()
  } 
}


@Deco("Caca") 
class Greeter { 
  prop:string; 

  /*@Deco("Caca") 
  TakeAShit() { 
    console.log("suck my balzz"); 
  } */
}

export function Test() { 
  function GetClassType<T extends ClassTypeResolver> (classType:T) { 
    
  }
}
