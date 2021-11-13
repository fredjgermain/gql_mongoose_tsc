// const values = {value1:1, value2:'test2'} 
// const template = "value1: ${Plural('values.value1', 'single', 'many')}"; 

// // ${Plural(value1, 'single', 'many')} + , value2: ${values.value2}"; 
// console.log(InterpolationString2(values, template)); 



/** INTERPOLATIONSTRING =================================== 
 * Parse an string interpoler and replace the ${key} with their respective value found in 'values'. 
 * @param values 
 * @param template 
 * @returns 
 */
export function InterpolateString(values:any, template:string, pattern?:string) { 
  let str = `${template}`; 
  Object.keys(values).forEach( key => 
    str = str.replace(`{${key}}`, `${values[key]}`) ) 
  return str; 
} 

// export function InterpolateString(values:object, template:string) { 
//   function Interpolate(src:string) { 
//     return eval("`${"+src+"}`") 
//   } 

//   function Plural(src:string, singular:string, plural:string) { 
//     const value = Interpolate(src); 
//     return `${value} ${value > 1 ? plural:singular}`; 
//   } 

//   try { 
//     return eval("`"+template+"`") 
//   } catch(err) { 
//     return 'error'; 
//   } 
// } 


/*export function InterpolateString(values:object, interpoler:string) { 
  const splits = SplitWithRegex(interpoler, [ new RegExp(/\${[a-zA-Z0-9_]+}/) ] ) 

  let interpolated = ""; 
  splits.forEach( split => { 
    if(IsEmpty(split[1])) 
      interpolated += split[0]; 
    else { 
      const key = split[0].substring(2, split[0].length-1).trim(); 
      interpolated += StringifyEach(values[key])[0] ?? ''; 
    } 
  }) 
  return interpolated; 
} */


/** STRINGIFY =============================================
 * Takes a single value or an array of values and stringify each. 
 * If a value is already a string, it returns that string value unchanged. 
 * Else it stringify using 'JSON.stringify' rather than 'ToString'. 
 * @param values 
 * @returns Return an array of strings. 
 */
export function StringifyEach(values:any):string[] { 
  const array = values !== undefined ? [values].flat() : [] as any[]; 
  if(array.length == 0) 
    return []; 
  return array.map( value => { 
    return typeof value === 'string' ? value: JSON.stringify(value); 
  }) 
} 


/** REDUCETOSTRING ========================================
 * Takes a single value or an array of values and stringify each. 
 * If a value is already a string, it returns that string unchanged. 
 * Else it stringify using 'JSON.stringify' rather than 'ToString'. 
 * @param strArray 
 * @param delimiter 
 * @returns a single string. 
 */
export function ReduceToString(values:any, delimiter:string = '') { 
  const strArray = StringifyEach(values); 
  return strArray.join(delimiter); 
} 


/** SPLIT WITH REGEX ======================================
 * Takes a single string and recursively split that string when it matches regexs. 
 * @param src a single string 
 * @param regexs a array of regexs 
 * @returns an array of pairs [matching substring, matching regex] 
 */
export function SplitWithRegex(src:string, regexs:RegExp[]):[string, string][] { 
  const [regex, ..._regexs] = regexs; 
  if(!src) 
    return []; 
  if(!regex) 
    return [[src, '']]; 
  const match = regex.exec(src); 
  if(!match) { 
    return SplitWithRegex(src, _regexs); 
  } 

  const before = src.slice(0, match.index); 
  const found = [match[0], regex.source] as [string, string]; 
  const after = src.slice(match.index + found[0].length); 
  const befores = SplitWithRegex(before, _regexs); 
  const afters = SplitWithRegex(after, regexs); 
  return [...befores, found, ...afters]; 
}
