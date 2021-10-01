// --------------------------------------------------------
import { ValidateToCreate, ValidateToUpdate, ValidateIdsToFind } from './validation/validation.action'; 
import { CrudError, ErrProp } from "./validation/errprop.class"; 
import { MongoModel } from "./mongomodel.parsing"; 
import { Input } from "./item.utils"; 



// Create -------------------------------------------------
export async function Create( model:MongoModel, inputs:Input[] ) { 
  try{
    const errors = await ValidateToCreate(model, inputs); 
    if(errors.length > 0) 
      throw new CrudError(errors); 
    return await model.create(inputs); 
  } catch(err) { 
    throw err; 
  } 
} 



// Read ---------------------------------------------------
export async function Read( model:MongoModel, ids?:string[] ) {
  try{
    const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
    if(errors.length > 0) 
      throw new CrudError(errors) 
    const selector = ids ? {_id: {$in: ids}} : {}; 
    return await model.find(selector); 
  } catch(err) { 
    throw err; 
  }
}



// Update ------------------------------------------------- 
export async function Update( model:MongoModel, inputs:Input[] ) { 
  try {
    const errors = await ValidateToUpdate(model, inputs); 
    if(errors.length > 0) 
      throw new CrudError(errors); 
    for(let i = 0; i < inputs.length; i++) { 
      const {_id, ...parsedItem} = inputs[i]; 
      await model.updateOne({_id:_id}, parsedItem); 
    } 
    // fetch modified items 
    const ids = inputs.map( item => item._id ); 
    return await model.find({_id: {$in: ids}}); 
  } catch(err) { 
    throw err; 
  }
}



// Delete ------------------------------------------------- 
export async function Delete( model:MongoModel, ids:string[] ) { 
  try{
    const errors = ids ? await ValidateIdsToFind(model, ids): [] as ErrProp[]; 
    if(errors.length > 0) 
      throw new CrudError(errors); 
    const items = await model.find({_id: {$in: ids}}); 
    await model.deleteMany({_id: {$in: ids}}); 
    return items; 
  } catch(err) { 
    throw err; 
  } 
} 