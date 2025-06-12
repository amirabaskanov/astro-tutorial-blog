import { Astro } from '../icons/Astro';
import { ReactJs } from '../icons/ReactJs';
import { Tailwindcss } from '../icons/Tailwind';
import { TypeScript } from '../icons/TypeScript';
import { Python } from '../icons/Python';
import { JavaScript } from '../icons/JavaScript';
import { AWS } from '../icons/AWS';

type TechStack = {
  name: string;
  icon: any; // Using any for now since we're working with Astro components
  description: string;
}

const techStacks: TechStack[] = [
  {
    name: 'Astro',
    icon: Astro,
    description: 'The web framework for content-driven websites'
  },
  {
    name: 'TypeScript',
    icon: TypeScript,
    description: 'JavaScript with syntax for types'
  },
  {
    name: 'React',
    icon: ReactJs,
    description: 'A JavaScript library for building user interfaces'
  },
  {
    name: 'TailwindCSS',
    icon: Tailwindcss,
    description: 'A utility-first CSS framework'
  },
  {
    name: 'Python',
    icon: Python,
    description: 'A versatile programming language'
  },
  {
    name: 'JavaScript',
    icon: JavaScript,
    description: 'The language of the web'
  },
  {
    name: 'AWS',
    icon: AWS,
    description: 'Cloud computing services'
  },
];

export default techStacks; 