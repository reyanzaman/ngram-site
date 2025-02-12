import "./globals.css";

export const metadata = {
  title: "N-Gram Searching",
  description: "PhD Project of Nazia Nishat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
