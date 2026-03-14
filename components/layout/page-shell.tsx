import type { ReactNode } from "react";

export type PageShellProps = {
  title: string;
  children?: ReactNode;
};

export function PageShell({ title, children }: PageShellProps) {
  return (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
