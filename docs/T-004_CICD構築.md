# T-004: CI/CD パイプライン構築

**ステータス:** 未着手
**フェーズ:** Step 6（リリース）
**依存:** T-001, T-002

## 概要
GitHub ActionsでCI/CDを構築。PR時のlint・テスト自動実行、mainマージ時の自動デプロイ。

## 完了条件
- [ ] GitHub Actions ワークフロー作成（PR時: lint + テスト）
- [ ] フロントエンド自動デプロイ（Vercel）
- [ ] バックエンド自動デプロイ（Railway）
- [ ] dependabot 設定
