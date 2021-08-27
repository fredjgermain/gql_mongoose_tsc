import mongoose from 'mongoose'; 

// --------------------------------------------------------
import { data as FormDatas } from './forms.mockdata'; 
import { data as InstructionDatas } from './instructions.mockdata'; 
import { data as ResponseGroupDatas } from './responses.mockdata'; 

/*
import { Form } from '../models/form.model'; 
import { Instruction} from '../models/instruction.model'; 
import { ResponseGroup } from '../models/responsegroup.model'; 
*/
import { Question } from '../models/question.model'; 



// PDQD5 --------------------------------------------------
const pdqd5_f = FormDatas.find( f => f.fid.match('pdqd5')); 
const pdqd5_i = InstructionDatas.filter( i => i.iid.match('pdqd5') ); 
const pdqd5_r = ResponseGroupDatas.find( r => r.rid.match('pdqd5')); 

const pdqd5_q = [ 
  {label: ['Eu du mal a vous organiser?']}, 
  {label: ['Eu du mal a vous concentrer sur ce que vous lisez?']}, 
  {label: ['Oubliez la date a moins de la vérifier?']}, 
  {label: ['Oubliez le sujet de votre conversation apres un appel téléphonique?']}, 
  {label: [`Eu l'impression d'avoir un trou de mémoire?`]} 
] 

const pdqd5_questions = pdqd5_q.map( (question, i) => { 
  const label = question.label; 
  const qid = 'pdqd5_q'+(i+1); 
  const form = pdqd5_f; 
  const instructions = pdqd5_i; 
  const responsegroup = pdqd5_r; 
  const optional = false; 
  return {qid, label, form, instructions, optional, responsegroup} as Question; 
}) 



// ASRS ---------------------------------------------------
const asrs_f = FormDatas.find( f => f.fid.match('asrs')); 
//const asrs_i = instructions.filter( i => i.iid.match('asrs') ); 
const asrs_r = ResponseGroupDatas.find( r => r.rid.match('asrs')); 

const asrs_q = [ 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a finaliser les derniers détails d'un project une fois les parties les plus stimulantes ont été faites?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a mettre les choses en ordre lorsque vous devez faire quelque chose qui demande de l'organisation?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a vous rappeler vos rendez-vous ou vos obligations?`]}, 
  {label: [`Lorsque vous devez faire quelque chose qui demande beaucoup de réflexion, a quelle fréquence vous arrive-t-il d'éviter de le faire ou de remettre a plus tard?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il de remuer ou de tortiller les mains ou les pieds lorsque vous devez rester assis pendant un période prolongée?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il de vous sentir excessivement actif et contraint de faire quelques chose, comme si vous étiez entrainé malgré vous par un moteur?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il de faire des fautes d'étourderie lorsque vous travaillez a un projet ennuyeyx ou difficule?`]}, 
  {label: [`A quelles fréquence vous arrive-t-il d'avoir des difficultés a vous concentrer lorsque vous faites un travail ennuyeux ou répétitif`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a vous concentrer sur les propos de votre interlocuteur, meme s'il s'adresse directement a vous?`]}, 
  {label: [`Arrive-t-il d'égarer des choses ou d'avoir des difficultés a les retrouver?`]}, 
  {label: [`A la maison ou au travail, a quelle fréquence vous arrive-t-il d'etre distrait par l'activité ou le bruit autour de vous?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a vous détendre et a vous reposer dans vos temps libre?`]}, 
  {label: [`A quelle fréquences vous arrive-t-il de parler de facon excessive a l'occasion de vos rencontres sociales?`]}, 
  {label: [`Pendant une conversation, a quelle fréquence vous arrive-t-il de terminer les phrases de vos interlocuteurs avant que ces derniers aient le temps de les finir?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'avoir des difficultés a attendre votre tour lorsque vous devrier le faire?`]}, 
  {label: [`A quelle fréquence vous arrive-t-il d'interrompre les gens lorsqu'ils sont occupés?`]}
] 

const asrs_questions = asrs_q.map( ({label}, i) => { 
  const _id = new mongoose.Types.ObjectId(); 
  const qid = 'asrs'+(i+1); 
  const form = asrs_f; 
  const instructions = [] as any[]; 
  const responsegroup = pdqd5_r; 
  const optional = false; 
  return {_id, qid, label, form, instructions, optional, responsegroup} as Question; 
}) 



// WHODAS ---------------------------------------------------
const whodas_f = FormDatas.find( f => f.fid.match('whodas')); 
const whodas_i = InstructionDatas.filter( i => i.iid.match('whodas') ); 
const whodas_r1 = ResponseGroupDatas.find( r => r.rid.match('whodas_r1')); 
const whodas_r2 = ResponseGroupDatas.find( r => r.rid.match('whodas_r2')); 

const whodas_q = [
  {section:`d1`, label:[`Vous concentrer sur une tâche pendant 10 minutes?`]}, 
  {section:`d1`, label:[`Vous rappeler de faire des choses importantes?`]}, 
  {section:`d1`, label:[`Analyser et trouver des solutions à des problèmes de lavie courante?`]}, 
  {section:`d1`, label:[`Apprendre une nouvelle tâche ou par ex. découvrir un nouveau lieu?`]}, 
  {section:`d1`, label:[`Comprendre ce que les gens disent?`]}, 
  {section:`d1`, label:[`Commencer ou maintenir une conversation?`]}, 
  {section:`d2`, label:[`Être debout pour de longues périodes comme 30 min.?`]}, 
  {section:`d2`, label:[`Passer de la position assise à une position débout?`]}, 
  {section:`d2`, label:[`Vous déplacer dans votre maison?`]}, 
  {section:`d2`, label:[`Sortir de votre maison?`]}, 
  {section:`d2`, label:[`Marcher une longue distance comme 1 kilomètre?`]}, 
  {section:`d3`, label:[`Laver votre corps tout entier?`]}, 
  {section:`d3`, label:[`Vous habiller?`]}, 
  {section:`d3`, label:[`Manger?`]}, 
  {section:`d3`, label:[`Rester seul(e) durant quelques jours?`]}, 
  {section:`d4`, label:[`Avoir à faire avec des personnes que vous ne connaissez pas?`]}, 
  {section:`d4`, label:[`Entretenir une relation d'amitiés?`]}, 
  {section:`d4`, label:[`Vous entendre avec des proches?`]}, 
  {section:`d4`, label:[`Vous faire de nouveaux amis?`]}, 
  {section:`d4`, label:[`Avoir des relations sexuelles ?`]}, 
  {section:`d5`, label:[`Vous occuper de vos résponsabilités ménagères?`]}, 
  {section:`d5`, label:[`Faire bien vos tâches ménagères importantes?`]}, 
  {section:`d5`, label:[`Terminer tout ce qui devrait être fait comme tâches?`]}, 
  {section:`d5`, label:[`Faire votre ménage aussi vite que nécessaire?`]}, 
  {section:`d5optional`, label:[`Faire votre travail/ vos activités scolaires quotidièn(nes)`]}, 
  {section:`d5optional`, label:[`Faire correctement votre tâche la plus importante pour le travail/ les activités scolaires?`]}, 
  {section:`d5optional`, label:[`Faire tout le travail que vous avez à faire?`]}, 
  {section:`d5optional`, label:[`Faire votre travail aussi vite que nécessaire?`]}, 
  {section:`d6`, label:[`À quel point est-ce un problème de vous engager dans des activités communautaires (par ex. fêtes, activité religieuse ou autre) de la même façon que les autres?`]}, 
  {section:`d6`, label:[`Combien de problèmes avez-vous eues pour executer vos plans à cause de barrières ou d'empêchements dans le monde qui vous entoure?`]}, 
  {section:`d6`, label:[`À quel point est-ce un problème de vivre dignement malgré les attitudes et les actions d'autrui?`]}, 
  {section:`d6`, label:[`Combien de temps avez-vous passé sur votre état de santé ou ses conséquences?`]}, 
  {section:`d6`, label:[`À quel point avez-vous été émotionellement affecté(e) par votre état de santé?`]}, 
  {section:`d6`, label:[`À quel point votre santé a-t-elle été à l'origine d'une perte pour vos ressources financières et celles de votre famille?`]}, 
  {section:`d6`, label:[`Combien de difficulté votre famille a-t-elle eues à cause de votre état de santé?`]}, 
  {section:`d6`, label:[`Combien de difficulté avez-vous eues pour faire des choses tout(e ) seule(e ) pour vous relaxer ou pour votre plaisir?`]}, 
  {section:`h1`, label:[`Au total, durant les 30 dernier jours, pendant combien de jours avez-vous eu ces difficultés?`]}, 
  {section:`h2`, label:[`Durant les 30 derniers jours, pendant combien de jours avez-vous été incapable d'effectuer vos activités habituelles ou travail du fait de votre état de santé?`]}, 
  {section:`h3`, label:[`Durant les 30 derniers jours, sans compter les jours où vous étiez totalement incapable, pendant combien de temps avez-vous diminué ou réduit vos activités habituelles ou votre travail du fait de votre état de santé?`]}, 
]

const whodas_questions = whodas_q.map( ({label, section}, i) => { 
  const _id = new mongoose.Types.ObjectId(); 
  const qid = section+(i+1); 
  const form = whodas_f; 
  const instructions = whodas_i.filter( i => i.iid.match(section)); 
  const responsegroup = section.match('h') ? whodas_r2: whodas_r1; 
  const optional = false; 
  return {_id, qid, label, form, instructions, optional, responsegroup} as Question; 
}) 



// EDEC ---------------------------------------------------
const edec_f = FormDatas.find( f => f.fid.match('edec')); 
const edec_i = InstructionDatas.filter( i => i.iid.match('edec') ); 
const edec_r = ResponseGroupDatas.find( r => r.rid.match('edec') ); 

const edec_q = [ 
  {label: [`De mémoire ex. oublier ce qui s'est passé il y a quelques jours?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 
  
  {label: [`De mémoire ex. oublier des conversations qui se sont passées il y a quelques jours?`]},  
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`De mémoire ex. se rendre compte que vous vous répétez?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A communiquer vos idées en mots?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A trouver le bon mot lors de conversations?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`Oublier el sens de mots communs?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A penser avant d'agir?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A planifier d'avance?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A retrouver votre chemin dans un endroit que vous connaissez?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A suivre des directions sur une carte?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A garder votre chambre/maison organisée?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A cuisiner ou travailler et parler en meme temps?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A se concentrer sur une tache sans etre distrait(e) par ce qui se passe autour de vous?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A organiser vos finances?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A faire deux choses en meme temps?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 

  {label: [`A maintenir vos documents et courriers organisés?`]}, 
  {label: [`Ceci dérange votre fonctionnement?`]}, 
] 

const edec_questions = edec_q.map( ({label}, i) => { 
  const _id = new mongoose.Types.ObjectId(); 
  const qid = `edec_${i+1}`; 
  const form = edec_f; 
  const instructions = [] as any[]; 
  const responsegroup = edec_r; 
  const optional = false; 
  return {_id, qid, label, form, instructions, optional, responsegroup} as Question; 
}) 


export const data = [...asrs_questions, ...pdqd5_questions, ...whodas_questions, ...edec_questions]; 







/*
// QUESTION -------------------------------------
export const questions = [ 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 1, 
    qid: 'f1d1q1', 
    label: ['Question 1', 'Question 1'], 
    responseType: responses[0], 
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 2, 
    qid: 'f1d1q2', 
    label: ['Question 2', 'Question 2'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 3, 
    qid: 'f1d1q3', 
    label: ['Question 3', 'Question 3'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 4, 
    qid: 'f1d1q4', 
    label: ['Question 4', 'Question 4'], 
    responseType: responses[0], 
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 5, 
    qid: 'f1d1q5', 
    label: ['Question 5', 'Question 5'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  { 
    _id: new mongoose.Types.ObjectId(), 
    form: forms[0], 
    section: 'd1', 
    order: 6, 
    qid: 'f1d1q6', 
    label: ['Question 6', 'Question 6'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  },
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[1], 
    section: 'd1', 
    order: 7, 
    qid: 'f2d1q1', 
    label: ['Question 7', 'Question 7'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  }, 
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[1], 
    section: 'd1', 
    order: 8, 
    qid: 'f2d1q2', 
    label: ['Question 8', 'Question 8'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  },
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[1], 
    section: 'd1', 
    order: 9, 
    qid: 'f2d1q3', 
    label: ['Question 9', 'Question 9'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[0]], 
  },
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[1], 
    section: 'd2', 
    order: 10, 
    qid: 'f2d1q4', 
    label: ['Question d2q1', 'Question d2q1'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[1]], 
  }, 
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[2], 
    section: 'd1', 
    order: 10, 
    qid: 'f3d1q1', 
    label: ['Question d2q2', 'Question d2q2'], 
    responseType: responses[0],
    optional: false, 
    instructions: [instructions[1]], 
  }, 
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[2], 
    section: 'd2', 
    order: 10, 
    qid: 'f3d1q2', 
    label: ['Question d2q3', 'Question d2q3'], 
    responseType: responses[0],  
    optional: false, 
    instructions: [instructions[1]], 
  },
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[2], 
    section: 'd3', 
    order: 10, 
    qid: 'f3d1q3', 
    label: ['Question d3q1', 'Question d3q1'], 
    responseType: responses[0], 
    optional: false, 
    instructions: [instructions[1]], 
  }, 
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[2], 
    section: 'd3', 
    order: 10, 
    qid: 'f3d1q4', 
    label: ['Question d3q2', 'Question d3q2'], 
    responseType: responses[0], 
    optional: false, 
    instructions: [instructions[1]], 
  }, 
  {
    _id: new mongoose.Types.ObjectId(), 
    form: forms[2], 
    section: 'd3', 
    order: 10, 
    qid: 'f3d1q5', 
    label: ['Question d3q3', 'Question d3q3'], 
    responseType: responses[0],  
    optional: false, 
    instructions: [instructions[1]], 
  }
]

*/