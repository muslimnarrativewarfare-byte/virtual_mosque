import { createHash, timingSafeEqual } from 'node:crypto';

function digest(input: string) {
  return createHash('sha256').update(input).digest('hex');
}

export async function hash(input: string, _saltOrRounds?: string | number): Promise<string> {
  return digest(input);
}

export async function compare(input: string, hashed: string): Promise<boolean> {
  const left = Buffer.from(digest(input));
  const right = Buffer.from(hashed);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
