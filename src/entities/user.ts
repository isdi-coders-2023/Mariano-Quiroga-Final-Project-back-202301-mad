export type User = {
  id: string;
  name: string;
  password: string;
  email: string;
  avatar?: string;
  notes?: Array<UserNotes>;
  images?: Array<Images>;

  role: 'user' | 'admin';
  token?: string;
};

export type UserNotes = {
  title: string;
  note: string;
};

export type Images = {
  image: string;
};
