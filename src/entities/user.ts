import { Activity } from './activity';

export type User = {
  name: string;
  surname: string;
  password: string;
  email: string;
  age?: number;
  address?: string;
  saves?: Activity[];
};
