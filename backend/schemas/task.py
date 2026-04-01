from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models.task import Priority, Status


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: Status
    priority: Priority
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    deleted_at: Optional[datetime]
    category_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
