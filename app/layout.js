import "./globals.css"

export const metadata = {
  title: "Placement Drive Manager | T&P Cell",
  description: "Keep track of upcoming placement drives for the Training and Placement Cell.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
