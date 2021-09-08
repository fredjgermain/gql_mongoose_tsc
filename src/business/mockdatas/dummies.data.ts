import mongoose from 'mongoose'; 

export const dataA = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test A1'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A2'}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test A3'}, 
] 


export const dataB = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test B1', nested:dataA[0]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B2', nested:dataA[1]}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test B3', nested:dataA[2]}, 
] 

export const dataC = [ 
  { _id: new mongoose.Types.ObjectId(), name: 'test C1', array:['test C1'], nested:dataB[0], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C2', array:['test C2'], nested:dataB[1], manyNested:dataB}, 
  { _id: new mongoose.Types.ObjectId(), name: 'test C3', array:['test C3'], nested:dataB[2], manyNested:dataB}, 
] 
