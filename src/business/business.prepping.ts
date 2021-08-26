import { NonEmptyArray } from 'type-graphql';

// Business import ------------------------------------------------------ 
import { A, B, C, descriptorA, descriptorB, descriptorC } from './models/dummies.model'; 
import { dataA, dataB, dataC } from './mockdatas/dummies.data'; 

// ---------------------------------------------------------- 
import { InitPrepping, Populate, RegisterModels, basicResolvers, Extend_Crud_ModelDescriptor_FactoryResolvers } from '../typegql.utils/basic.prepping'; 
import { ModelDescriptor } from '../typegql.utils/modeldescriptor/modeldescriptor.model';



const dummiesRegistrations = [ 
  {model:A, modelDescriptor:descriptorA as ModelDescriptor}, 
  {model:B, modelDescriptor:descriptorB as ModelDescriptor}, 
  {model:C, modelDescriptor:descriptorC as ModelDescriptor} 
] 

const dummiesPopulation = [ 
  {model:A, data:dataA}, 
  {model:B, data:dataB}, 
  {model:C, data:dataC} 
]

export async function BusinessPrepping() { 
  await InitPrepping(); 
  await RegisterModels(dummiesRegistrations); 
  await Populate(dummiesPopulation); 
} 

const businessResolsvers = Extend_Crud_ModelDescriptor_FactoryResolvers([A, B, C]); 
export const resolvers = [...basicResolvers,  ...businessResolsvers] as NonEmptyArray<Function> | NonEmptyArray<string>; 

