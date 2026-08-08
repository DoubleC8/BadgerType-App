from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    clerk_id: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)
    profile_picture: str | None = Field(default=None)

class Match(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    player1_id: uuid.UUID = Field(foreign_key="user.id")
    player2_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id")
    winner_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.id")
    
    # Add the missing stat columns!
    p1_wpm: float
    p1_accuracy: float
    p2_wpm: Optional[float] = Field(default=None)
    p2_accuracy: Optional[float] = Field(default=None)
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
