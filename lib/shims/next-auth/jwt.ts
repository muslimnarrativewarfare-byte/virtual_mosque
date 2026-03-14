export interface JWT {
  id: string;
  role: string;
  [key: string]: unknown;
}
