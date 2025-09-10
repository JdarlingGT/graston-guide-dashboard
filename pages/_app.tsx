import { SessionProvider, useSession, signIn } from "next-auth/react"
import type { AppProps } from "next/app"
import "../styles/globals.css"

function AuthGuard({ children }: { children: JSX.Element }) {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading auth...</div>
  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Staff Login Required</h2>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    )
  }
  return children
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </SessionProvider>
  )
}