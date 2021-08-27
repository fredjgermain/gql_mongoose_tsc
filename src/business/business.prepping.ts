import { NonEmptyArray } from 'type-graphql';

// Business import ------------------------------------------------------ 
import { A, B, C, descriptorA, descriptorB, descriptorC } from './models/dummies.model'; 
import { Answer, descriptorAnswer } from './models/answer.model'; 
import { Form, descriptorForm } from './models/form.model'; 
import { Instruction, descriptorInstruction } from './models/instruction.model'; 
import { Patient, descriptorPatient } from './models/patient.model'; 
import { Question, descriptorQuestion } from './models/question.model'; 
import { ResponseGroup, descriptorResponse } from './models/responsegroup.model'; 

// datas 
import { dataA, dataB, dataC } from './mockdatas/dummies.data'; 
import { data as answersData } from './mockdatas/answers.mockdata'; 
import { data as formsData } from './mockdatas/forms.mockdata'; 
import { data as instructionsData } from './mockdatas/instructions.mockdata'; 
import { data as patientsData } from './mockdatas/patients.mockdata'; 
import { data as questionsData } from './mockdatas/questions.mockdata'; 
import { data as responsesData } from './mockdatas/responses.mockdata'; 

// ---------------------------------------------------------- 
import { InitPrepping, Populate, RegisterModels, basicResolvers, Extend_Crud_ModelDescriptor_FactoryResolvers } from '../typegql.utils/basic.prepping'; 
import { ModelDescriptor } from '../typegql.utils/modeldescriptor/modeldescriptor.model';




const registrations = [ 
  {model:A, modelDescriptor:descriptorA as ModelDescriptor}, 
  {model:B, modelDescriptor:descriptorB as ModelDescriptor}, 
  {model:C, modelDescriptor:descriptorC as ModelDescriptor}, 

  {model:Patient, modelDescriptor:descriptorPatient}, 
  {model:Form, modelDescriptor:descriptorForm}, 
  {model:Instruction, modelDescriptor:descriptorInstruction}, 
  {model:ResponseGroup, modelDescriptor:descriptorResponse}, 
  {model:Question, modelDescriptor:descriptorQuestion}, 
  {model:Answer, modelDescriptor:descriptorAnswer}, 
] as {model:any, modelDescriptor:ModelDescriptor}[] 

const population = [ 
  {model:A, data:dataA}, 
  {model:B, data:dataB}, 
  {model:C, data:dataC},  

  {model:Patient, data:patientsData}, 
  {model:Form, data:formsData}, 
  {model:Instruction, data:instructionsData}, 
  {model:ResponseGroup, data:responsesData}, 
  {model:Question, data:questionsData}, 
  {model:Answer, data:answersData}, 
] 

export async function BusinessPrepping() { 
  await InitPrepping(); 
  await RegisterModels(registrations); 
  await Populate(population); 
} 

const businessResolsvers = Extend_Crud_ModelDescriptor_FactoryResolvers( registrations.map( regis => regis.model ) ); 
export const resolvers = [...basicResolvers,  ...businessResolsvers] as NonEmptyArray<Function> | NonEmptyArray<string>; 

