import { IEvent } from './html.utils'; 


/** IsPressed ---------------------------------------------
 * Detect if a any of the given 'keys' have been pressed. 
 * if so then, it returns true, else it returns false. 
 * @param event event object to get key event from. 
 * @param keys keys to detect. 
 * @param Func 
 */
 export function IsPressed(event:any, keys:string[])  { 
  const {code} = (event as IEvent); 
  return keys.includes(code) 
} 


/** EnterIsPressed ----------------------------------------
 * Test if the 'Enter' key has been pressed. 
 * @param event 
 * @returns 
 */
export const EnterIsPressed = (event:any) => IsPressed(event, ['Enter', 'NumpadEnter']); 



// Type for a list of most commonly used action attributes. 
export type TActionAttributes = { 
  onFocus?:(event:any) => void, 
  onBlur?:(event:any) => void, 
  onEnter?:(event:any) => void, 
  onChange?:(event:any) => void, 
} 


/** ActionAttributes
 * Helper methods to defined commonly used action attributes. 
 * return a set a of actionAttributes. 
 * Simply destructure the result on a html object to give that object some Action Attributes. 
 * @param param0 
 * @returns 
 */
export function ActionAttributes({onChange, onBlur, onFocus, onEnter}:TActionAttributes) { 

  // Assumes detection of 'Enter' key on keyUp. 
  const onKeyUp = (event:any) => { 
    EnterIsPressed(event) && onEnter && onEnter(event) 
  } 
  const actionAttributes = {onChange, onBlur, onFocus, onKeyUp}; 
  return onBlur || onFocus ? {tabIndex:0, ...actionAttributes} : actionAttributes; 
}

