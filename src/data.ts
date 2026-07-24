import { Card } from './types';

export const FIBONACCI_CARDS: Card[] = [
  {
    id: 'fib-0',
    value: '0',
    numericValue: 0,
    type: 'fibonacci',
    color: 'from-emerald-400 to-teal-500 text-emerald-950 dark:from-emerald-600 dark:to-teal-700 dark:text-emerald-50',
    label: 'Sin esfuerzo',
    description: 'La tarea está resuelta o no requiere ningún esfuerzo real (ej. cambiar un texto simple).'
  },
  {
    id: 'fib-1',
    value: '1',
    numericValue: 1,
    type: 'fibonacci',
    color: 'from-teal-400 to-cyan-500 text-teal-950 dark:from-teal-600 dark:to-cyan-700 dark:text-teal-50',
    label: 'Muy fácil',
    description: 'Esfuerzo mínimo. Entendido, sin riesgos y toma muy poco tiempo.'
  },
  {
    id: 'fib-2',
    value: '2',
    numericValue: 2,
    type: 'fibonacci',
    color: 'from-cyan-400 to-sky-500 text-cyan-950 dark:from-cyan-600 dark:to-sky-700 dark:text-cyan-50',
    label: 'Fácil',
    description: 'Tarea de bajo esfuerzo. Tarea simple con pocos pasos y nula complejidad.'
  },
  {
    id: 'fib-3',
    value: '3',
    numericValue: 3,
    type: 'fibonacci',
    color: 'from-blue-400 to-indigo-500 text-blue-950 dark:from-blue-600 dark:to-indigo-700 dark:text-blue-50',
    label: 'Normal',
    description: 'Esfuerzo estándar. Requiere concentración pero el camino está muy claro.'
  },
  {
    id: 'fib-5',
    value: '5',
    numericValue: 5,
    type: 'fibonacci',
    color: 'from-indigo-400 to-violet-500 text-indigo-950 dark:from-indigo-600 dark:to-violet-700 dark:text-indigo-50',
    label: 'Medio',
    description: 'Complejidad intermedia. Requiere análisis y hay factores desconocidos.'
  },
  {
    id: 'fib-8',
    value: '8',
    numericValue: 8,
    type: 'fibonacci',
    color: 'from-violet-400 to-fuchsia-500 text-violet-950 dark:from-violet-600 dark:to-fuchsia-700 dark:text-violet-50',
    label: 'Considerable',
    description: 'Esfuerzo alto. Se trata de una tarea grande o compleja que podría requerir un par de días.'
  },
  {
    id: 'fib-13',
    value: '13',
    numericValue: 13,
    type: 'fibonacci',
    color: 'from-fuchsia-400 to-pink-500 text-fuchsia-950 dark:from-fuchsia-600 dark:to-pink-700 dark:text-fuchsia-50',
    label: 'Muy alto',
    description: 'Se recomienda dividir la tarea en subtareas más pequeñas.'
  },
  {
    id: 'fib-21',
    value: '21',
    numericValue: 21,
    type: 'fibonacci',
    color: 'from-pink-400 to-rose-500 text-pink-950 dark:from-pink-600 dark:to-rose-700 dark:text-pink-50',
    label: 'Esfuerzo extremo',
    description: 'Complejidad altísima. Es imperativo desglosar esta historia de usuario.'
  },
  {
    id: 'fib-34',
    value: '34',
    numericValue: 34,
    type: 'fibonacci',
    color: 'from-rose-400 to-red-500 text-rose-950 dark:from-rose-600 dark:to-red-700 dark:text-rose-50',
    label: 'Incalculable',
    description: 'Demasiado grande para estimar en un Sprint. Debe dividirse inmediatamente.'
  },
  {
    id: 'fib-55',
    value: '55',
    numericValue: 55,
    type: 'fibonacci',
    color: 'from-red-400 to-orange-500 text-red-950 dark:from-red-600 dark:to-orange-700 dark:text-red-50',
    label: 'Épica',
    description: 'Equivale a un módulo completo. No es estimable en este estado.'
  }
];

export const SPECIAL_CARDS: Card[] = [
  {
    id: 'spec-uncertainty',
    value: '?',
    numericValue: null,
    type: 'special',
    color: 'from-amber-400 to-yellow-500 text-amber-950 dark:from-amber-600 dark:to-yellow-700 dark:text-amber-50',
    label: 'Incertidumbre',
    description: 'No tengo suficiente información o la historia es demasiado vaga.'
  },
  {
    id: 'spec-break',
    value: '☕',
    numericValue: null,
    type: 'special',
    color: 'from-blue-400 to-indigo-500 text-blue-950 dark:from-blue-600 dark:to-indigo-700 dark:text-blue-50',
    label: 'Descanso',
    description: 'He estado debatiendo demasiado tiempo o necesito café.'
  }
];

export const ALL_CARDS = [...FIBONACCI_CARDS, ...SPECIAL_CARDS];
