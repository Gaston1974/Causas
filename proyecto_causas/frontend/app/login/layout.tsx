import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Pantalla de acceso al sistema',
  generator: 'dev',
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ minHeight: '100vh', margin: 0, background: '#0f172a' }}>{children}</div>
  )
}
