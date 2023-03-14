import { Activity } from './activity';

export type User = {
  id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  age?: number;
  address?: string;
  saves?: Activity[];
};
