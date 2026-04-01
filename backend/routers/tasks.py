from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from datetime import datetime, timezone
from typing import Optional

from models.database import get_db
from models.user import User
from models.task import Task, Priority, Status
from schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from services.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    request: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(
        title=request.title,
        description=request.description,
        priority=request.priority,
        due_date=request.due_date,
        category_id=request.category_id,
        user_id=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("", response_model=TaskListResponse)
def list_tasks(
    status_filter: Optional[Status] = Query(None, alias="status"),
    priority: Optional[Priority] = None,
    category_id: Optional[int] = None,
    include_deleted: bool = False,
    sort_by: str = Query("created_at", pattern="^(created_at|due_date|priority)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Task).filter(Task.user_id == current_user.id)

    if not include_deleted:
        query = query.filter(Task.deleted_at.is_(None))

    if status_filter:
        query = query.filter(Task.status == status_filter)
    if priority:
        query = query.filter(Task.priority == priority)
    if category_id:
        query = query.filter(Task.category_id == category_id)

    total = query.count()

    order_func = desc if sort_order == "desc" else asc
    query = query.order_by(order_func(getattr(Task, sort_by)))

    tasks = query.all()
    return TaskListResponse(tasks=tasks, total=total)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    request: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")

    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")

    if task.status == Status.DONE:
        task.status = Status.TODO
        task.completed_at = None
    else:
        task.status = Status.DONE
        task.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")

    task.deleted_at = datetime.now(timezone.utc)
    db.commit()


@router.patch("/{task_id}/restore", response_model=TaskResponse)
def restore_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task or not task.deleted_at:
        raise HTTPException(status_code=404, detail="削除済みタスクが見つかりません")

    task.deleted_at = None
    db.commit()
    db.refresh(task)
    return task
