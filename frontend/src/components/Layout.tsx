import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-foreground">
            Todo管理
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ダッシュボード
            </Link>
            <Link to="/tasks" className="text-sm text-muted-foreground hover:text-foreground">
              タスク一覧
            </Link>
            <Link to="/trash" className="text-sm text-muted-foreground hover:text-foreground">
              ゴミ箱
            </Link>
            <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground">
              設定
            </Link>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                ログアウト
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
