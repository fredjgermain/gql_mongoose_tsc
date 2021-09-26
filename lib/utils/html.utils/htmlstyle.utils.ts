

// TAG UTILS ################################### 
/*export function SetWidth(value:number):{width:any} { 
  return {width:`${DefaultWidth(value)+2}ch`}; 
} */

export function DefaultWidth(value:any, inputType:string):number { 
  if(inputType === 'checkbox') 
    return 2; 
  if(inputType === 'date') 
    return 17; 
  const w = String(value).length; 
  return w < 4 ? 4 : w; 
} 



export function Style() { 
  
} 
