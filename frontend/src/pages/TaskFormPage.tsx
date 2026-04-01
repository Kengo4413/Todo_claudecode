import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { tasksApi, type TaskCreate, type Priority } from '@/lib/api/tasks'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TaskFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    categoriesApi.list().then((res) => setCategories(res.data))

    if (isEdit && id) {
      tasksApi.get(Number(id)).then((res) => {
        const task = res.data
        setTitle(task.title)
        setDescription(task.description || '')
        setPriority(task.priority)
        setDueDate(task.due_date ? task.due_date.slice(0, 16) : '')
        setCategoryId(task.category_id ? String(task.category_id) : '')
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }

    setIsLoading(true)
    try {
      const data: TaskCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || undefined,
        category_id: categoryId ? Number(categoryId) : undefined,
      }

      if (isEdit && id) {
        await tasksApi.update(Number(id), data)
      } else {
        await tasksApi.create(data)
      }
      navigate('/tasks')
    } catch {
      setError('保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'タスク編集' : 'タスク追加'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タスクのタイトル"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="タスクの詳細"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>優先度</Label>
                <Select value={priority} onValueChange={(v) => setPriority((v ?? 'medium') as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">緊急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>カテゴリ</Label>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">期限</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? '保存中...' : '保存'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/tasks')}>
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
