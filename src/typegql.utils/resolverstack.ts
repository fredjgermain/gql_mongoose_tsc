import { NonEmptyArray } from 'type-graphql';
import { Extend_Crud_FactoryResolver } from './crud/crud.factory.resolver';

const resolverStack = [] as any[]; 

export function ResolverStack(resolver?:any) { 
  if(resolver) 
    resolverStack.push(resolver); 
  return resolverStack as NonEmptyArray<Function> | NonEmptyArray<string>; 
} 

export function GetResolverStack() { 
  console.log("get resolver stack"); 
  return resolverStack as NonEmptyArray<Function> | NonEmptyArray<string>; 
}

// Resolver Stack Decorator ------------------------------------------- 
/*
  Cannot truly register models before connecting with Mongoose. 
  Once mongoose is connected and resolvers are mounted, call function RegisterModels above. 
*/ 
export function Stack(): ClassDecorator { 

  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = target;  
    ResolverStack(resolver); 
  } 
} 

export function CrudStack(): ClassDecorator { 
  return function <TFunction extends Function>(target:TFunction): void { 
    // find classType of classItem iteself as target ?? 
    const resolver = Extend_Crud_FactoryResolver(target as any); 
    ResolverStack(resolver); 
  } 
}