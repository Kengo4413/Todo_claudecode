import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tasksApi, type Task } from '@/lib/api/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    const res = await tasksApi.list({ sort_by: 'due_date', sort_order: 'asc' })
    setTasks(res.data.tasks)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(
    (t) => t.due_date && t.due_date.startsWith(todayStr) && t.status !== 'done'
  )
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
  )
  const totalTasks = tasks.length
  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const handleToggleComplete = async (taskId: number) => {
    await tasksApi.toggleComplete(taskId)
    fetchTasks()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">完了率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">{doneTasks}/{totalTasks} タスク完了</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">今日のタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayTasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">期限超過</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${overdueTasks.length > 0 ? 'text-destructive' : ''}`}>
              {overdueTasks.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 期限超過タスク */}
      {overdueTasks.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">期限超過タスク</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <Checkbox
                  checked={false}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                />
                <Link to={`/tasks/${task.id}/edit`} className="hover:underline flex-1">
                  {task.title}
                </Link>
                <Badge variant="destructive" className="text-xs">
                  {new Date(task.due_date!).toLocaleDateString('ja-JP')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 今日のタスク */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>今日のタスク</CardTitle>
          <Link to="/tasks/new">
            <Button size="sm">タスク追加</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {todayTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">今日のタスクはありません</p>
          ) : (
            todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <Checkbox
                  checked={false}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                />
                <Link to={`/tasks/${task.id}/edit`} className="hover:underline">
                  {task.title}
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
