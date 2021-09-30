// --------------------------------------------------------
import { ValidateToCreate, ValidateToUpdate, ValidateIdsToFind } from './validation/validation.action'; 
import { ErrProp } from "./validation/errprop.class"; 
import { MongoModel } from "./mongomodel.parsing"; 
import { Input } from "./item.utils"; 



// Create -------------------------------------------------
export async function Create( model:MongoModel, inputs:Input[] ) { 
  const errors = await ValidateToCreate(model, inputs); 
  if(errors.length > 0) 
    return {items:[], errors} 
  // Creates many 
  const items = await model.create(inputs); 
  return {items} 
} 



// Read ---------------------------------------------------
export async function Read( model:MongoModel, ids?:string[] ) {
  const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
  if(errors.length > 0) 
    return {items:[], errors} 
  const selector = ids ? {_id: {$in: ids}} : {}; 
  // fetch items. 
  const items = await model.find(selector); 
  return {items}; 
}



// Update ------------------------------------------------- 
export async function Update( model:MongoModel, inputs:Input[] ) { 
  const errors = await ValidateToUpdate(model, inputs); 
  if(errors.length > 0) 
    return {items:[], errors} 
  // Updates many 
  for(let i = 0; i < inputs.length; i++) { 
    const {_id, ...parsedItem} = inputs[i]; 
    await model.updateOne({_id:_id}, parsedItem); 
  } 
  // fetch modified items 
  const ids = inputs.map( item => item._id ); 
  const items = await model.find({_id: {$in: ids}}); 
  return {items}; 
}



// Delete ------------------------------------------------- 
export async function Delete( model:MongoModel, ids:string[] ) { 
  const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
  if(errors.length > 0) 
    return {items:[], errors} 
  // fetch items before deletion
  const items = await model.find({_id: {$in: ids}}); 
  // delete many 
  await model.deleteMany({_id: {$in: ids}}); 
  return {items}; 
}