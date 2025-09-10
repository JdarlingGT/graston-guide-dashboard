import Link from "next/link"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ padding: "10px 20px", background: "#1e293b", color: "white" }}>
        <h2>Graston Dashboard</h2>
        <nav>
          <Link href="/">Events</Link> | <Link href="/reports">Reports</Link>
        </nav>
      </header>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  )
}