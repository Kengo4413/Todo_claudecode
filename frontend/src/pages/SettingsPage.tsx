import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#6b7280')

  const fetchCategories = async () => {
    const res = await categoriesApi.list()
    setCategories(res.data)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    await categoriesApi.create({ name: newCategoryName.trim(), color: newCategoryColor })
    setNewCategoryName('')
    setNewCategoryColor('#6b7280')
    fetchCategories()
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('このカテゴリを削除しますか？')) return
    await categoriesApi.delete(id)
    fetchCategories()
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">設定</h1>

      {/* プロフィール */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>メールアドレス</Label>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* カテゴリ管理 */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* カテゴリ一覧 */}
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">カテゴリがありません</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    削除
                  </Button>
                </div>
              ))
            )}
          </div>

          <Separator />

          {/* カテゴリ追加 */}
          <form onSubmit={handleAddCategory} className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="catName">新規カテゴリ</Label>
              <Input
                id="catName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="カテゴリ名"
              />
            </div>
            <Input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="w-12 h-9 p-1"
            />
            <Button type="submit" size="sm">追加</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
