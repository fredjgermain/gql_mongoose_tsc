

/** IsNan =======================================
 * 
 * @param value 
 * @returns 
 */
 export function IsNaN(value:any): boolean { 
  return typeof value === 'number' && new Number(value).toString() === 'NaN'; 
}



/** IsNull ======================================
 * returns true if value is:
  - undefined
  - null
otherwise returns false
 * @param value 
 * @returns 
 */
export function IsNull(value:any): boolean { 
  return (value ?? null) === null || IsNaN(value); 
} 



/** IsEmpty =====================================
return true if value is 
  - undefined
  - null
  - '' (an empty string) 
  - [] (an empty array) 
  - {} (an empty object) 
otherwise returns false 
 * @param value 
 * @returns 
 */
export function IsEmpty(value:any): boolean {
  if(IsNull(value)) 
    return true; 
  if(Array.isArray(value) && value.length === 0) 
    return true; 
  if(typeof value === 'object' && JSON.stringify(value) === '{}') 
    return true; 
  if(typeof value === 'string' && value === '') 
    return true; 
  return false; 
}



/** Copy ========================================
 * Returns a shallow copy an object or an array. 
 * Otherwise returns the value itself. 
 * @param source 
 * @returns 
 */
 export function Copy(source:any) { 
  if(Array.isArray(source)) 
    return [...source] 
  if(typeof source === 'object') 
    return {...source} 
  return source; 
} 



/** DeepCopy ====================================
 * Returns a deep copy of an object or of an array 
 * Otherwise returns the value itself. 
 * @param source 
 * @returns 
 */
export function DeepCopy(source:any):any { 
  if(Array.isArray(source)) 
    return source.map( value => DeepCopy(value) ); 
  if(typeof source === 'object') { 
    const deepCopy = {} as any; 
    Object.keys(source).forEach( key => 
      deepCopy[key] = DeepCopy(source[key]) 
    ); 
    return deepCopy; 
  } 
  return source; 
} 



// /** GetValueAt ============================================
//  * Get a single nested value form an object by listing the nested keys. 
//  * @param source 
//  * @param at 
//  * @returns 
//  */
//  export function GetValueAt(source:any, at:string[]):any { 
//   const [key, ...rest] = at; 
//   if(IsEmpty(key) || !(key in source)) 
//     return; 
//   if(IsEmpty(rest)) 
//     return source[key]; 
//   return GetValueAt(source[key], rest); 
// } 



// /** GetValuesAt ===========================================
//  * 
//  * @param source 
//  * @param indexer 
//  * @returns 
//  */
//  export function GetValuesAt(source:any, indexer:Indexer) { 
//   let result = {} as any; 
//   Object.keys(indexer).forEach( key => { 
//     if(indexer[key] === true) 
//       result[key] = Copy(source[key]); 
//     /*if(typeof indexer[key] === 'function') 
//       result[key] = (indexer[key] as Function)(source[key]); */
//     if(typeof indexer[key] === 'object') 
//       result[key] = GetValuesAt(source[key], indexer[key] as Indexer); 
//   }) 
//   return result; 
// } 



// /** SetValuesAt ===========================================
//  * 
//  * @param source 
//  * @param indexer 
//  * @returns 
//  */
// export function SetValuesAt(source:any, mods:any) { 
//   const result = DeepCopy(source); 
//   Object.keys(mods).forEach( key => { 
//     if(typeof mods[key] !== 'object') 
//       result[key] = mods[key]; 
//     if(typeof mods[key] === 'object') 
//       result[key] = SetValuesAt(source[key], mods[key]); 
//   }) 
//   return result; 
// }
