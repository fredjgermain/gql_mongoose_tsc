import mongoose from 'mongoose'; 

// --------------------------------------------------
import { DaysPerMonth } from '../../lib/date/date.utils'; 
import { ResponseGroup } from '../models/responsegroup.model'; 

function Range(min:number, max:number) { 
  const range = []; 
  for(let i = min; i <= max; i++) 
    range.push(i); 
  return range; 
}

function Range_DaysPerMonth() { 
  const year = new Date().getFullYear(); 
  const month = new Date().getMonth(); 
  const daysPerMonth = DaysPerMonth(year, month+1); 
  return Range(1, daysPerMonth); 
} 


// RESPONSE -------------------------------------
export const ResponseGroupDatas:ResponseGroup[] = [ 
  { 
    ////_id:new mongoose.Types.ObjectId(), 
    rid: 'pdqd5', 
    responsechoices: [
      ['Never', "Rarely (once or twice)", "Sometimes (3 to 5 times)", "Often (once per day)", "Very often (more than once per day)"], 
      ['Jamais', 'Rarement (1 ou 2 fois)', 'Quelques fois (3 a 5 fois)', 'Souvent (environ 1 fois par jours)', `Tres souvent (plus d'une fois par jours)`]
    ], 
  }, 
  { 
    ////_id:new mongoose.Types.ObjectId(), 
    rid: 'asrs', 
    responsechoices: [ 
      [`Not at all`, `Rarely`, `Sometimes`, `Often`, `Very often`], 
      [`Pas du tout`, `Rarement`, `Parfois`, `Souvent`, `Tres souvent`] 
    ], 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'whodas_r1', 
    responsechoices: [ 
      [`None`, `Mild`, `Moderate`, `Severe`, `Extreme or cannot do`], 
      [`Aucune`, `Légere`, `Modérée`, `Severe`, `Extreme ou ne peut pas faire`]
    ], 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'whodas_r2', 
    responsechoices: [ 
      Range(0, 30).map( i => JSON.stringify(i)) 
    ], 
  }, 
  {
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'edec_r', 
    responsechoices: [[
      `(0) Aucunement`, 
      `(1) Légerement`, 
      `(2) Légerement`, 
      `(3) Légerement`, 
      `(4) Modérément`, 
      `(5) Modérément`, 
      `(6) Modérément`, 
      `(7) Beaucoup`, 
      `(8) Beaucoup`, 
      `(9) Beaucoup`, 
      `(10) Etremement`, 
    ]]
  },
  /*{ 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'Weeks-day', 
    values: ['monday', 'thuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'Disagree-Agree', 
    values: ['strongly disagree', 'disagree', 'neutral', 'agree', 'strongly agree'], 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'From 0-7', 
    values: Range(0,7), 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'Last 30 days', 
    values: Range(0, 30), 
  }, 
  { 
    //_id:new mongoose.Types.ObjectId(), 
    rid: 'Last month days', 
    values: Range_DaysPerMonth(), 
  } */
]