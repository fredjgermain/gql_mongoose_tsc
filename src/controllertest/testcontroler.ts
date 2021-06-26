import express, {Request, Response} from 'express'; 


// Access -------------------------------------------------
async function Access(req:Request, res:Response) { 
  return res.status(200).send('TypeGQL'); 
} 

export function MakeController() { 
  const router = express.Router(); 
  router.get('/api/', Access);  // for connection test purposes 
  return router; 
} 
