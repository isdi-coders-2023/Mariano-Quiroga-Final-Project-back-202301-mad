import { Activity } from './activity';

export type User = {
  id: string;
  name: string;
  password: string;
  email: string;
  notes?: string[];
  image?: string[];
  saves?: Activity[];
  role?: string;
  token?: string;
};
