import mongoose from 'mongoose'; 
import { A, B, C, D } from '../models/dummies.model'; 

import { DataToPopulate } from "../../prepping/typegoose.stacker"; 

export const dataA = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test A1 with population'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A2'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A3'}, 
] 
DataToPopulate(A, dataA); 

export const dataB = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test B1', nested:dataA[0]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B2', nested:dataA[1]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B3', nested:dataA[2]}, 
] 
DataToPopulate(B, dataB); 

export const dataC = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test C1', array:['test C1'], nested:dataB[0], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C2', array:['test C2'], nested:dataB[1], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C3', array:['test C3'], nested:dataB[2], manyNested:dataB}, 
] 
DataToPopulate(C, dataC); 

export const dataD = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test D1', age:2}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test D2', age:10}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test D3', age:12}, 
] 
DataToPopulate(D, dataD); 
