
import "./globals.css";



export const metadata = {
  title: "Fara Ede",
  description: "Fara Ede Programmer Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
