import "./globals.css";

export const metadata = {
  title: "Thematic Searching",
  description: "Thematic Searching For Al-Qur'an",
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
