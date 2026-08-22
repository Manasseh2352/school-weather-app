import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "UniAbuja Smart Weather Monitoring System",
  description:
    "Real-time weather monitoring and environmental alerts for the University of Abuja campus.",
};

const themeInitScript = `
(function() {
  try {
    var stored = window.localStorage.getItem('uniabuja-weather-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen text-slate-800 dark:text-slate-100 dark:bg-slate-900 transition-colors">
        <ThemeProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <footer className="text-center text-xs text-slate-400 dark:text-slate-500 py-8">
            Prototype system — Department of Computer Science, University of Abuja
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
