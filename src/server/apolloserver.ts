import { ApolloServer } from "apollo-server-express"; 
import { buildSchema, NonEmptyArray } from "type-graphql"; 

// -----------------------------------------------------------
import { ExpressCORS } from './expresscors'; 



/* BuildSchema -----------------------------------------------
 * Takes a Set of resolvers and build the schema. 
*/
export async function BuildSchema(resolvers:NonEmptyArray<Function> | NonEmptyArray<string>) {
  return await buildSchema({ 
    resolvers: [...resolvers] as NonEmptyArray<Function> | NonEmptyArray<string>,  
    //scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }], 
    emitSchemaFile: true, 
    validate: false, 
  }); 
}


type TResolvers = NonEmptyArray<Function> | NonEmptyArray<string>; 
type TPort = string|number; 
/* APOLLO SERVER ---------------------------------------------
 * Sets up and Run an ApolloServer. 
*/ 
export async function RunApolloserver(resolvers:TResolvers, PORT: TPort = process.env.PORT || 8000) { 
  const schema = await BuildSchema(resolvers); 
  const app = ExpressCORS(); 

	const server = new ApolloServer({
		schema, 
		introspection:true, 
	}); 
	server.applyMiddleware({ app }); 

	app.listen(PORT, () => 
    console.log(`Apollo server listening at ==> http://localhost:${PORT}${server.graphqlPath}`)
  ) 

  return server; 
}



