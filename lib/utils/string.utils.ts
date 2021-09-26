/** StringInterpolation ===================================
 * Evaluate a string interpolation template and replace it with its proper values. 
 * @param values 
 * @param strInterpoTemplate 
 * @returns 
 */ 
/* 
const error = {name:'error name', path:'a field name', value:'wrong value'}; 
console.log(EvalFormat(error, "this is error ${name}: at ${path} ... ${value} ")) 
const entry = {firstName:'Fred', lastName:'Jean-Germain', title:'Mrs'}; 
console.log(EvalFormat(entry, "Hi! ${title} ${lastName}, ${firstName} ")) 
*/ 
export function StringInterpolation(values:any, strInterpoTemplate:string) { 
  const keys = Object.keys(values); 
  strInterpoTemplate = strInterpoTemplate.replace(/`/g, '\\`'); 
  const fn = new Function(...keys, 'return `' + strInterpoTemplate + '`'); 
  return fn(...keys.map(key => values[key])); 
}



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
 * The default delimister is a white space ' '. 
 * @param strArray 
 * @param delimiter 
 * @returns a single string. 
 */
export function ReduceToString(values:any, delimiter:string = ' ') { 
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
