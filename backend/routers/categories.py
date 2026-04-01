from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from models.database import get_db
from models.user import User
from models.category import Category
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from services.auth import get_current_user

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    request: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = Category(
        name=request.name,
        color=request.color,
        user_id=current_user.id,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Category).filter(Category.user_id == current_user.id).all()


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    request: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(Category).filter(
        Category.id == category_id, Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")

    update_data = request.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    category = db.query(Category).filter(
        Category.id == category_id, Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="カテゴリが見つかりません")

    db.delete(category)
    db.commit()
