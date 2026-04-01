import { useState, useEffect } from 'react'
import { tasksApi, type Task } from '@/lib/api/tasks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function TrashPage() {
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([])

  const fetchDeleted = async () => {
    const res = await tasksApi.list({ include_deleted: true })
    setDeletedTasks(res.data.tasks.filter((t) => t.deleted_at !== null))
  }

  useEffect(() => {
    fetchDeleted()
  }, [])

  const handleRestore = async (taskId: number) => {
    await tasksApi.restore(taskId)
    fetchDeleted()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ゴミ箱</h1>
      <p className="text-sm text-muted-foreground">削除後30日で自動的に完全削除されます</p>

      {deletedTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            ゴミ箱は空です
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {deletedTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-muted-foreground line-through">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    削除日: {new Date(task.deleted_at!).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleRestore(task.id)}>
                  復元
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
