import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { tasksApi, type Task, type Priority, type Status, type TaskListParams } from '@/lib/api/tasks'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  urgent: { label: '緊急', color: 'bg-red-500' },
  high: { label: '高', color: 'bg-orange-500' },
  medium: { label: '中', color: 'bg-blue-500' },
  low: { label: '低', color: 'bg-gray-400' },
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority'>('created_at')

  const fetchTasks = useCallback(async () => {
    const params: TaskListParams = { sort_by: sortBy, sort_order: 'desc' }
    if (statusFilter !== 'all') params.status = statusFilter as Status
    if (priorityFilter !== 'all') params.priority = priorityFilter as Priority
    if (categoryFilter !== 'all') params.category_id = Number(categoryFilter)

    const res = await tasksApi.list(params)
    setTasks(res.data.tasks)
  }, [statusFilter, priorityFilter, categoryFilter, sortBy])

  useEffect(() => {
    fetchTasks()
    categoriesApi.list().then((res) => setCategories(res.data))
  }, [fetchTasks])

  const handleToggleComplete = async (taskId: number) => {
    await tasksApi.toggleComplete(taskId)
    fetchTasks()
  }

  const handleDelete = async (taskId: number) => {
    if (!confirm('このタスクを削除しますか？')) return
    await tasksApi.delete(taskId)
    fetchTasks()
  }

  const isOverdue = (task: Task) => {
    if (!task.due_date || task.status === 'done') return false
    return new Date(task.due_date) < new Date()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスク一覧</h1>
        <Link to="/tasks/new">
          <Button>タスク追加</Button>
        </Link>
      </div>

      {/* フィルタ・ソート */}
      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="todo">未着手</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="done">完了</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? 'all')}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="urgent">緊急</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy((v ?? 'created_at') as typeof sortBy)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">作成日順</SelectItem>
            <SelectItem value="due_date">期限順</SelectItem>
            <SelectItem value="priority">優先度順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* タスクリスト */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">タスクがありません</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                isOverdue(task) ? 'border-destructive bg-destructive/5' : 'border-border'
              } ${task.status === 'done' ? 'opacity-60' : ''}`}
            >
              <Checkbox
                checked={task.status === 'done'}
                onCheckedChange={() => handleToggleComplete(task.id)}
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className={`font-medium hover:underline ${
                    task.status === 'done' ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <span className={`w-2 h-2 rounded-full mr-1 ${priorityConfig[task.priority].color}`} />
                    {priorityConfig[task.priority].label}
                  </Badge>
                  {task.due_date && (
                    <span className={`text-xs ${isOverdue(task) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      期限: {new Date(task.due_date).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                削除
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
