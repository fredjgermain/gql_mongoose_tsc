import { Story } from '@storybook/react'; 
import { InterpolateString } from '../../string.utils'; 


function TemplateString() { 
  const values = {value1:'valeur 1', value2:'valeur 2'} 
  const result = InterpolateString(values, "blabla:${values.value1}, ${values.value2}") 
  return <div>{JSON.stringify(result)}</div> 
} 

export default { 
  title: 'utils/string', 
  component: TemplateString 
} 

const Template:Story<any> = args => <TemplateString {...args} /> 

export const TestInterpolateString = Template.bind({}) 
TestInterpolateString.args = {} 


