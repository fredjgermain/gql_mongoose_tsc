// -------------------------------------------------------- 
import { MongoModel } from './typegoosemodel/typegoosemodel.util'; 


export interface Input { 
  _id?:string; 
  [key:string]: any; 
} 

export interface Item { 
  _id:string; 
  [key:string]: any; 
}

export function ParseToCreate(input:object) { 
  const {id, _id, ..._input} = (input as any); // ignore id and _id if they were 
  return _input; 
}

export function ParseToUpdate(input:any): {_id:string, id:string, [key:string]:any} { 
  let parseToUpdate = {...input}; 
  parseToUpdate._id = parseToUpdate._id ?? parseToUpdate.id ?? ''; 
  parseToUpdate.id = parseToUpdate._id; 
  return parseToUpdate; 
} 

export function ParseFromDoc(docs:any): Item { 
  return JSON.parse(JSON.stringify(docs)); 
} 


export function ParsedItem(item:any): {_id:string, id:string, [key:string]:any} { 
  let parsedItem = JSON.parse(JSON.stringify(item)); 
  parsedItem._id = parsedItem._id ?? parsedItem.id ?? ''; 
  parsedItem.id = parsedItem._id; 
  return parsedItem; 
} 



/** ItemsExist 
 * Receive an array of items 
    parsed out their ids 
    For each id test If a matching item exists in a given collection. 
    Return an array of boolean, 1 element for each id. 
 * @param model 
 * @param items 
 * @returns Promise<boolean[]> 
 */
export async function ItemsExist(model:MongoModel, items:object[]):Promise<boolean[]> { 
  const ids = items.map( item => ParsedItem(item)._id ?? ParsedItem(item).id ); 
  return await IdsExist(model, ids); 
} 



/** IdsExists 
 * For each id test If a matching item exists in a given collection. 
    Return an array of boolean, 1 element for each id. 
 * 
 * @param model 
 * @param ids 
 * @returns Promise<boolean[]> 
 */
export async function IdsExist(model:MongoModel, ids:string[]):Promise<boolean[]> { 
  const collectionIds = (await model.find()).map( (item:any) => ParseFromDoc(item)._id ); 
  return ids.map( id => collectionIds.includes(id) ); 
} 