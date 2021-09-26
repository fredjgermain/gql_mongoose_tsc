import { IsEmpty } from '../utils'; 



/** PREDICATE =============== 
 * @param t current element.  
 * @param i current index number. 
 * @param a array itself. 
 * @param positive accumulator for positive results.  
 * @param negative accumulator of negative results.  
 * @return boolean if predicate passes of fails. 
 */
//export type Predicate<T> = (t:T, i:number, a:T[], positive:T[], negative:T[]) => boolean; 
export type Predicate<T> = (iteration:{t:T, i:number, array:T[], positive:T[], negative:T[]}) => boolean; 
export const PREDICATES = { 
  isUnic: <T extends unknown>(sameness: Comparator<T>):Predicate<T> => { 
    return ({t, positive}) => !positive.some( p => sameness(t, p) ); 
  } 
} 


/** Comparator ================== 
 * @param t current element 
 * @param pivot value to compare to 't' 
 * @return boolean if comparison of 't' and 'pivot' passes or fails. 
 */
export type Comparator<T> = (t:T, pivot:T) => boolean; 



/** TOARRAY ================= 
 * Converts an object into a array if it is not already an array. Returns the array itself it is already an array, or returns an empty array if it is empty. 
 * @param toArray value to be converted into an array. 
 * @returns an array. 
 */
 export function ToArray(toArray:any|any[]):any[] { 
  return toArray !== undefined ? [toArray].flat() : [] as any[]; 
} 



/** PICK ==================== 
 * 
 * @param toPickFrom 
 * @param pickingOrder 
 * @param picker 
 * @returns 
 */ 
export function Pick<T, U>(toPickFrom:T[] = [], pickingOrder:U[] = [], picker:(t:T, u:U) => boolean):T[] { 
  let picked = [] as T[]; 
  pickingOrder.forEach( p => { 
    const found = toPickFrom.filter( t => picker(t, p) ) 
    if(found) 
      picked = [...picked, ...found]; 
  }); 
  return picked; 
}



/** GROUP =================== 
 * Groups elements using a predicate. 
 * @param array array to group. 
 * @param grouping grouping is a criteria by which to group elements. 
 * @returns an array of grouped values (array of arrays). 
 */ 
export function Group<T>(array:T[] = [], grouping:Predicate<T>):T[][] { 
  if(IsEmpty(array)) 
    return []; 
  const [grouped, ungrouped] = Filter(array, grouping); 
  const remainder = Group<T>(ungrouped, grouping); 
  return [grouped, ...remainder]; 
}



/** SORTS ===================
 * Quick sorts an array using multiple criterias. The reversing of the sorters is necessary to properly sort. 
 * @param array array to sort. 
 * @param sorters array of sorting predicates. 
 * @returns sorted array 
 */
export function Sorts<T>(array:T[] = [], sorters:Comparator<T>[] = []):T[] { 
  let sorted = [...array]; 
  if(IsEmpty(sorters)) 
    return sorted; 
    const _sorters = [...sorters].reverse(); 
  _sorters.forEach( sorter => sorted = Sort(sorted, sorter)) 
  return sorted; 
} 



/** SORT ====================
 * Quick sort an array
 * @param array array to sort. 
 * @param sorter sorting predicate. 
 * @returns sorted array. 
 */
export function Sort<T>(array:T[] = [], sorter:Comparator<T>):T[] { 
  const [pivot, ...remainder] = [...array]; 
  if(IsEmpty(remainder)) 
    return pivot ? [pivot]:[]; 
  const [inclusion, exclusion] = Filter(remainder, ({t}) => sorter(t, pivot)); 
  const left = Sort<T>(inclusion, sorter); 
  const right = Sort<T>(exclusion, sorter); 
  return [...left, pivot, ...right]; 
} 



/** FILTER ==================
 * Takes an array and filter that array according to a predicate. Returns 2 accumulators; 
 * accumulator "positive" for elements that pass the predicate. 
 * accumulator "negative" for elements that fail the predicate. 
 * 
 * @param array array to filter 
 * @param predicate filtering predicate 
 * @returns 2 arrays: filtered elements, remaining elements. 
 */ 
export function Filter<T>(array:T[] = [], predicate:Predicate<T>):[T[], T[]] { 
  const positive = [] as T[]; 
  const negative = [] as T[]; 
  array.forEach( (t:T, i:number, array:T[]) => 
    predicate({t, i, array, positive, negative}) ? positive.push(t): negative.push(t) 
  ) 
  return [positive, negative]; 
} 



/** UNIC ================= 
 * Takes an array and a 'sameness' criteria 
 * return 2 arrays [unic values, duplicates values] 
 * 
 * @param array 
 * @param Sameness 
 * @returns 
 */
 export function Unic<T>(array:T[], Sameness:Comparator<T>):[T[], T[]] { 
  const isUnic:Predicate<T> = ({t, positive}) => !positive.some( p => Sameness(t, p) ); 
  return Filter(array, isUnic); 
} 

