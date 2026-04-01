# Project Overview
Todo管理 - 個人向けタスク管理Webアプリケーション

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite, Tailwind CSS v4, shadcn/ui
- **Backend**: FastAPI (Python 3.12)
- **DB**: PostgreSQL (Railway managed)
- **認証**: JWT (python-jose) + bcrypt
- **メール通知**: Resend
- **ホスティング**: Vercel (FE) / Railway (BE)
- **CI/CD**: GitHub Actions

## Dev Environment
- OS: macOS
- Node: v22+
- Python: 3.12+
- Editor: Cursor / VS Code

## Project Structure
frontend/src/
├── pages/        # ページコンポーネント
├── components/   # 共通UIコンポーネント (shadcn/ui)
├── lib/          # ユーティリティ・設定
├── lib/api/      # API通信
├── hooks/        # カスタムフック
└── types/        # 型定義

backend/
├── routers/      # APIルーター
├── models/       # SQLAlchemyモデル
├── schemas/      # Pydanticスキーマ
└── services/     # ビジネスロジック

## Commands
### Frontend (frontend/)
- `npm run dev`   # 開発サーバー起動
- `npm run build` # ビルド
- `npm run lint`  # Lint実行

### Backend (backend/)
- `uvicorn main:app --reload` # 開発サーバー起動
- `alembic upgrade head`      # DBマイグレーション実行

## Coding Rules
- TypeScriptの型を必ず明示する（anyは原則禁止）
- コンポーネントはなるべく小さく分割する
- API通信はすべて`lib/api/`に集約する
- コメントは日本語でOK

## Notes
- `.env.local`に環境変数を記載（gitにコミットしない）
- PRを出す前に`npm run lint`と`npm run build`を必ず通すこと
