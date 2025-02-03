import type React from "react"
import { Brain } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
      >
        Skip to main content
      </a>
      <aside
        className="w-64 bg-gray-150 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Brain className="h-8 w-8 mr-2" aria-hidden="true" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cortex</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block px-4 py-2 text-sm ${
                  pathname === "/" ? "bg-gray-200 dark:bg-gray-700" : ""
                } text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Short-term Memory
              </Link>
            </li>
            <li>
              <Link
                href="/long-term"
                className={`block px-4 py-2 text-sm ${
                  pathname === "/long-term" ? "bg-gray-200 dark:bg-gray-700" : ""
                } text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md`}
                aria-current={pathname === "/long-term" ? "page" : undefined}
              >
                Long-term Memory
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto" id="main-content">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

