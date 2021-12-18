import { NonEmptyArray } from 'type-graphql';
import { Extend_Crud_FactoryResolver } from './crud.factory.resolver';



// Resolver Stack Decorator ------------------------------------------- 
/*
  Cannot register models before connecting with Mongoose. 
  Once mongoose is connected and resolvers are mounted, call function RegisterModels above. 
*/ 



/* RESOLVERSTACK ----------------------------------------------------- 
  This array stores Resolvers, before being used by the apollo server. 
*/ 
const resolverStack = [] as any[]; 


/* DATA and MODEL stacks ---------------------------------------------
  These stacks contains the data and model for registration once connected to MongoDb 
*/
const dataStack = [] as { data:any[], classItem:any }[]; 
const modelStatck = [] as { imodel:IModel, classItem:any }[]; 




/** ResolverStack -----------------------------------------------------
 * Receive a resolver and add it to the resolver stack. 
 * Return the resolver stack. 
 * @param resolver 
 * @returns 
 */
export function ResolverStack(resolver?:any) { 
  if(resolver) 
    resolverStack.push(resolver); 
  return resolverStack as NonEmptyArray<Function> | NonEmptyArray<string>; 
} 

export function GetResolverStack() { 
  return resolverStack as NonEmptyArray<Function> | NonEmptyArray<string>; 
}



/** STACK ----------------------------------------------------------- 
 * Use as a decorator for a Resolver class. 
 * Stacks the targeted resolver. 
 * 
 * CAREFUL !! A Model need to be imported AND USED somewhere otherwise their decorator will not be read and the model will not be stacked. 
 * 
 * @returns 
 */
export function Stack(): ClassDecorator { 

  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = target; 
    ResolverStack(resolver); 
  } 
} 



/** CRUDSTACK ----------------------------------------------------------- 
 * Use as a decorator for an Objectype. 
 * Factories a Crud Resolver for that Objectype. 
 * Stacks the Factoried Crud Resolver. 
 * 
 * CAREFUL !! A Model need to be imported AND USED somewhere otherwise their decorator will not be read and the model will not be stacked. 
 * 
 * @returns 
 */
export function CrudStack(): ClassDecorator { 
  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = Extend_Crud_FactoryResolver(target as any); 
    ResolverStack(resolver); 
  } 
}

