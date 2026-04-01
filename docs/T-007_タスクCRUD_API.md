# T-007: タスクCRUD API

**ステータス:** 未着手
**フェーズ:** Step 4（コア機能）
**依存:** T-003, T-005

## 概要
タスクの作成・取得・更新・削除のRESTful APIエンドポイントを実装。

## 完了条件
- [ ] POST /tasks（タスク作成）
- [ ] GET /tasks（一覧取得、フィルタ・ソート対応）
  - フィルタ: status, category_id, priority
  - ソート: due_date, priority, created_at
- [ ] GET /tasks/{id}（詳細取得）
- [ ] PUT /tasks/{id}（更新）
- [ ] DELETE /tasks/{id}（論理削除 → deleted_at にタイムスタンプ）
- [ ] PATCH /tasks/{id}/complete（完了/未完了切替、completed_at 自動記録）
- [ ] 入力バリデーション（XSS・SQLインジェクション対策）
- [ ] タスク項目: title, description, status, priority(緊急/高/中/低), due_date, category_id
- [ ] レスポンスタイム 500ms以内
