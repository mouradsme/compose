import { User } from './common.ts';

export interface HeaderProps {
  links: { id: number; label: string; url: string }[];
  user?: User;
}

export interface HomeProps {
  links: { id: number; label: string; url: string }[];
  user?: User;
}

export interface VideoProps {
  src: string;
  poster: string;
  rounded?: boolean;
}

export interface QuoteBoxProps {
  imageSrc: string;
  text: string;
}
