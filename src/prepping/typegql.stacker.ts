import { NonEmptyArray } from 'type-graphql'; 
import { Extend_Crud_FactoryResolver } from '../typegql.utils/crud.factory.resolver'; 
import { ModelResolver } from '../typegql.utils/model.resolver'; 



/* RESOLVERSTACK ---------------------------------------------------- 
 * This array stores Resolvers, before being used by the apollo server. 
 * ModelResolver is included as a default basic resolver. 
*/ 
const resolverStack = [ModelResolver] as any[]; 



/** GetResolverStack ------------------------------------------------ 
 * Receive a resolver and add it to the resolver stack. 
 * Return the resolver stack. 
 * @param resolver 
 * @returns 
 */
// export function ResolverStack(resolver?:any) { 
//   if(resolver) 
//     resolverStack.push(resolver); 
//   return resolverStack as NonEmptyArray<Function> | NonEmptyArray<string>; 
// } 

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
export function ResolverStack(): ClassDecorator { 

  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = target; 
    resolverStack.push(resolver); 
  } 
} 



/** CRUDRESOLVERSTACK ----------------------------------------------------------- 
 * Use as a decorator for an Objectype. 
 * Factories a Crud Resolver for that Objectype. 
 * Stacks the Factoried Crud Resolver. 
 * 
 * CAREFUL !! A Model need to be imported AND USED somewhere otherwise their decorator will not be read and the model will not be stacked. 
 * 
 * @returns 
 */
export function CrudResolverStack(): ClassDecorator { 
  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = Extend_Crud_FactoryResolver(target as any); 
    resolverStack.push(resolver); 
  } 
}

