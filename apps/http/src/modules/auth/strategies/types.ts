export type JwtPayload = {
  sub: string;
  avatar: string;
  firstName: string;
  lastName: string;
  about: string;
  email: string;
  phone: string;
  iat: number;
  exp: number;
};
