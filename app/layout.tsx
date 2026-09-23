import type { Metadata } from 'next';
import { Heebo, Lato } from 'next/font/google';
import './globals.css';

const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '600'],
});

const lato = Lato({
  variable: '--font-lato',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  title: 'Studio M.B.R. | Manuele Barbosa — Designer de Interiores',
  description:
    'Projetos, consultoria de interiores e marcenaria planejada por Manuele Barbosa, do Studio M.B.R.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${heebo.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
