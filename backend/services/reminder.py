"""リマインダー通知サービス

期限前24時間・当日のタスクに対してメール通知を送信する。
GitHub Actions Cron で定期実行される想定。
"""
import os
import httpx
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.task import Task, Status
from models.user import User

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM = os.getenv("RESEND_FROM", "Todo管理 <todo@example.com>")


def send_email(to: str, subject: str, body: str) -> bool:
    """Resend APIでメール送信"""
    if not RESEND_API_KEY:
        print(f"[DRY RUN] To: {to}, Subject: {subject}")
        return True

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={
            "from": RESEND_FROM,
            "to": [to],
            "subject": subject,
            "text": body,
        },
    )
    return response.status_code == 200


def send_reminders():
    """期限が近いタスクのリマインダーを送信"""
    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        tomorrow = now + timedelta(hours=24)

        # 期限が24時間以内 or 期限当日のタスク（未完了のみ）
        tasks = (
            db.query(Task)
            .filter(
                Task.status != Status.DONE,
                Task.deleted_at.is_(None),
                Task.due_date.isnot(None),
                Task.due_date <= tomorrow,
                Task.due_date >= now - timedelta(hours=1),  # 1時間前まで
            )
            .all()
        )

        for task in tasks:
            user = db.query(User).filter(User.id == task.user_id).first()
            if not user:
                continue

            due_str = task.due_date.strftime("%Y/%m/%d %H:%M")
            is_overdue = task.due_date < now

            if is_overdue:
                subject = f"【期限超過】{task.title}"
                body = f"以下のタスクが期限を過ぎています。\n\nタスク: {task.title}\n期限: {due_str}"
            else:
                subject = f"【リマインダー】{task.title} の期限が近づいています"
                body = f"以下のタスクの期限が近づいています。\n\nタスク: {task.title}\n期限: {due_str}"

            send_email(user.email, subject, body)
            print(f"Reminder sent: {task.title} -> {user.email}")

        print(f"Processed {len(tasks)} reminder(s)")
    finally:
        db.close()


if __name__ == "__main__":
    send_reminders()
