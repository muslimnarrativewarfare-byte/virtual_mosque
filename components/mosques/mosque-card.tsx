export type MosqueCardProps = {
  name: string;
  city?: string;
};

export function MosqueCard({ name, city }: MosqueCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      {city ? <p>{city}</p> : null}
    </article>
  );
}
