export { ToArray, Filter, Sort, Sorts, Group, Unic, Pick } 
  from './utils/arrays.utils'; 
export type { Predicate, Comparator } from './utils/arrays.utils'; 

export { StringInterpolation, ReduceToString, SplitWithRegex, StringifyEach } 
  from './utils/string.utils'; 

export { DaysPerMonth, IsLeapYear, IsToday, ParseDate } 
  from './utils/date.utils'; 

export { Copy, DeepCopy, IsEmpty, IsNaN, IsNull } 
  from './utils/value.utils'; 

export { GetDefaultValue, GetTypeNameByValue, GetTType, GetTTypeFromValue, IsInDomain, TypeNames } 
  from './utils/type.utils'; 
export type { TType } from './utils/type.utils'; 


// HTML utils 
export { GetInputType, GetValueFromInput, InputType_ValueType } 
  from './utils/html.utils/html.utils'; 
export type { IEvent } from './utils/html.utils/html.utils'; 

export { ActionAttributes, EnterIsPressed, IsPressed } 
  from './utils/html.utils/htmlactionattributes.utils'; 
export type { TActionAttributes } from './utils/html.utils/htmlactionattributes.utils'; 

