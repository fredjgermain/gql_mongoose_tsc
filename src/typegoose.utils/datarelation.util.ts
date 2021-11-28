import { mongoose, getModelForClass, getModelWithString } from '@typegoose/typegoose'; 
import { ClassType } from 'type-graphql'; 

// export function TestClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T): ClassDecorator {

//   console.log(`Message is:`) 
//     return function (): void { 
//         console.log('constructor') 
//     } 
//   // return class extends constructor {
//   //   test = "from deco";
//   // };
// }

type ModelDoc = {accessor:string, label?:string, description?:string} 
const registeredModels = [] as ModelDoc[]; 

export function TestClassDecorator(documentation?:Omit<ModelDoc, "accessor">): ClassDecorator {

  //console.log(`Message is: ${message}`)
  return function <TFunction extends Function>(target:TFunction): void { 
    const {accessor, description, label} = {...documentation, accessor:target.name}; 
    console.log(`model-documentation: ${accessor} ${description ?? ''} ${label ?? ''} `); 

    // too soon for registering ??  ----- 
      // const model = getModelWithString(modelName); // does it register the model ?? 
      // console.log(model); 
    /*const mongoModel = mongoose.models[modelName]; 
    console.log(mongoModel); */ 
    registeredModels.push(); 
  } 
} 


@TestClassDecorator({description:"deco", label:"deco label"}) 
class DecoratedClass {} 



/** ToObjectId 
 * Extract an id from an input. 
 * 
 * @param value 
 * @returns 
 */
export function ToObjectId(value:any) { 
  if(typeof value === 'string') 
    return new mongoose.Types.ObjectId(value); 
  else if("_id" in value) 
    return value._id; 
  return value; 
}


/** FromObjectId 
 * Finds and returns a document from a model type and an id. 
 * 
 * @param itemClass 
 * @param id 
 * @returns 
 */
export function FindObjectByClassAndId(itemClass:any,  id:any) {
  //console.log(itemClass.name); 
  const model = getModelForClass(itemClass); 
  const found = model.findById(id).exec(); 
  return found; 
}


/** OneToOne ... OneToMany -------------------------------- 
 * Deconstruct in the attributes @prop of a Business model to create a OneToMany or OneToOne relation between data collections. 
 * It is then possible to use subfields from nested object (OnetoOne) or array of nested objects (OneToMany) 
 * 
 * @Field(() => Patient) 
 * @prop({ ...OneToOne(Patient) }) 
 * patient: Ref<Patient>; 
 * 
 * @param itemClass // class of the element being referenced 
 * @returns 
 */
export function OneToOne<T extends ClassType>(itemClass:T) { 
  return { 
    //type: itemClass, 
    ref: () => itemClass, 
    set: (value:any) => ToObjectId(value), 
    get: (id:any) => FindObjectByClassAndId(itemClass, id) 
  } 
} 

export function OneToMany<T extends ClassType>(itemClass:T) { 
  return { 
    //type: [itemClass], 
    ref: () => itemClass, 
    set: (values:any[]) => values.map( value => ToObjectId(value)), 
    get: (ids:any[]) => ids.map( id => FindObjectByClassAndId(itemClass, id) ), 
    isArray: true, 
  } 
} 
