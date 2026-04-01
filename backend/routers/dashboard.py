from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from models.database import get_db
from models.user import User
from models.task import Task, Status
from services.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardStats(BaseModel):
    total_tasks: int
    done_tasks: int
    completion_rate: float
    today_tasks: int
    overdue_tasks: int
    this_week_done: int


@router.get("", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    base_query = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.deleted_at.is_(None),
    )

    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    week_start = today_start - timedelta(days=today_start.weekday())

    total_tasks = base_query.count()
    done_tasks = base_query.filter(Task.status == Status.DONE).count()
    completion_rate = round((done_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0

    today_tasks = base_query.filter(
        Task.due_date >= today_start,
        Task.due_date < today_end,
        Task.status != Status.DONE,
    ).count()

    overdue_tasks = base_query.filter(
        Task.due_date < now,
        Task.status != Status.DONE,
    ).count()

    this_week_done = base_query.filter(
        Task.completed_at >= week_start,
        Task.status == Status.DONE,
    ).count()

    return DashboardStats(
        total_tasks=total_tasks,
        done_tasks=done_tasks,
        completion_rate=completion_rate,
        today_tasks=today_tasks,
        overdue_tasks=overdue_tasks,
        this_week_done=this_week_done,
    )
