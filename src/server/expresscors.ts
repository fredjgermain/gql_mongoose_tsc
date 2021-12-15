import express from "express"; 
import cors from "cors"; 



/* ExpressCORS --------------------------------------------- 
 * Sets up express with CORS 
*/ 
export function ExpressCORS() { 
  const app = express(); 

	// Express CORS -------------------
	app.use(cors()); 
	/*app.use(cors({ 
		//origin: 'http://localhost:3000' 
		//origin: "https://react-mongoose-demo.herokuapp.com", 
		//origin: "https://fjg-demo-typegql-backend.com", 
	})); */

  return app; 
} 