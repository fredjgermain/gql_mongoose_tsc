import { GraphQLScalarType, Kind, valueFromAST } from "graphql"; 
import { ObjectId } from "mongodb";


interface UpdateObject {
  id:string; 
  [key:string]:any; 
}


export const UpdateScalar = new GraphQLScalarType({ 
  name: "UpdateScalar", 
  description: "Simulates Object with Id", 

  // SERIALIZE --------------------------------------------
  serialize(value: unknown): UpdateObject {
    //console.log('serialize', value);
    // check the type of received value
    if (!(value instanceof Object)) {
      throw new Error("UpdateScalar can only UpdateObject Object values");
    }
    return (value as Object) as UpdateObject; // value sent to the client
  },

  // PARSE VALUE ------------------------------------------
  parseValue(value: unknown): UpdateObject { 
    //console.log('parsed value', value); 
    // check the type of received value 
    if (typeof value !== "string") { 
      throw new Error("UpdateScalar can only parse UpdateObject values"); 
    } 
    
    return (value as Object) as UpdateObject; // value from the client input variables 
  }, 

  // PARSE LITERAL ----------------------------------------
  parseLiteral(ast): UpdateObject { 
    // check the type of received value 
    const {fields} = ast as any; 
    let parsedObject = {} as any; 
    (fields as any[]).map( f => { 
        const {name:{value:name}, value:{value}} = f; 
        parsedObject[name] =value; 
      } 
    ) 

    if (ast.kind !== Kind.OBJECT) { 
      throw new Error("UpdateScalar can only parse object values (Literal)"); 
    } 
    
    //console.log('parse literal', parsedObject); 

    return parsedObject as UpdateObject; 
  }, 
}); 



export const ObjectScalar = new GraphQLScalarType({ 
  name: "ObjectScalar", 
  description: "Simulates Object", 
  // SERIALIZE --------------------------------------------
  serialize(value: unknown): Object {
    //console.log('serialize test', value); 
    // check the type of received value 
    if (!(value instanceof Object)) {
      throw new Error("ObjectScalar can only serialize Object values");
    }
    return value; // value sent to the client
  },

  // PARSE VALUE ------------------------------------------
  parseValue(value: unknown): Object { 
    //console.log('parsed value 1', value); 
    // check the type of received value 
    /*if (typeof value != "string") { 
      console.log('parsed value ... is string ?', value); 
      throw new Error("ObjectScalar can only parse object values"); 
    } */ 
    //console.log('parsed value 2', value); 
    
    return value as any as Object; // value from the client input variables 
  }, 

  // PARSE LITERAL ----------------------------------------
  parseLiteral(ast): Object { 
    //console.log('parsed literal'); 
    let parsedObject = ParseObjectValue(ast as ObjectValue) 
    if (ast.kind !== Kind.OBJECT) { 
      throw new Error("ObjectScalar can only parse object values (Literal)"); 
    } 
    return parsedObject as Object; 
  }, 
}); 


type Nested = ListValue | ScalarValue | ObjectValue; 

interface ListValue { 
  kind: string, 
  values: Nested[], 
} 

interface ScalarValue { 
  kind: string, 
  value: any, 
} 

interface ObjectValue { 
  kind: string, 
  fields: ObjectField[] 
} 

interface ObjectField { 
  kind: string, 
  name: { value: string } 
  value: Nested, 
} 


function ParseScalarValue(toParse:ScalarValue):any { 
  return toParse.value; 
} 

function ParseListValue(toParse:ListValue):any[] { 
  return toParse.values.map( _toParse => { 
    return SwitchByKind(_toParse) 
  }) 
} 

function SwitchByKind(toParse:Nested):any { 
  if(toParse.kind === 'ListValue') 
    return ParseListValue(toParse as ListValue) 
  else if(toParse.kind === 'ObjectField') 
    return ParseObjectValue(toParse as ObjectValue) 
  return ParseScalarValue(toParse as ScalarValue) 
} 

function ParseObjectValue(toParse:ObjectValue) { 
  let parsedValue = {} as any; 
  toParse.fields.forEach( field => { 
    parsedValue[field.name.value] = SwitchByKind(field.value); 
  }) 
  return parsedValue; 
} 


//Ast

/*interface AstField { 
  kind: string, 
  name: {kind:'Name', value:'<fieldName>'} 
  value: { 
    kind: 'StringValue' ... 
    value: '<string value itself>' 
    ...
  } 
  
  OR

  value: { 
    kind: 'ListValue' ... 
    values: [Object, Object] 
    ...
  } 


  ... 
}*/













export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    console.log("serialize", value); 

    // check the type of received value
    if (!(value instanceof ObjectId)) {
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return value.toHexString(); // value sent to the client
  },
  parseValue(value: unknown): ObjectId {
    console.log("parse-value", value); 
    // check the type of received value
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(value); // value from the client input variables
  },
  parseLiteral(ast): ObjectId {
    console.log("parse-literal", ast); 
    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new ObjectId(ast.value); // value from the client query
  },
});
