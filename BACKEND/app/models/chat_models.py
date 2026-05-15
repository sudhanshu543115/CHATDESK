# app/models/chat_models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Table
from sqlalchemy.orm import relationship
from app.config.db import Base
from datetime import datetime

# Join table for Many-to-Many relationship between Users and Groups
group_members = Table(
    "group_members",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("group_id", Integer, ForeignKey("groups.id"), primary_key=True),
)

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    slug = Column(String, unique=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    channels = relationship("Channel", back_populates="workspace")
    groups = relationship("Group", back_populates="workspace")
    tasks = relationship("Task", back_populates="workspace")

class Channel(Base):
    __tablename__ = "channels"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    is_private = Column(Boolean, default=False)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    
    workspace = relationship("Workspace", back_populates="channels")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    
    workspace = relationship("Workspace", back_populates="groups")
    members = relationship("User", secondary=group_members)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String, nullable=True)
    status = Column(String, default="To Do") # "To Do", "In Progress", "Completed"
    priority = Column(String, default="Medium") # "Low", "Medium", "High", "Critical"
    tags = Column(String, nullable=True) # Stored as comma-separated values
    due_date = Column(DateTime, nullable=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    workspace = relationship("Workspace", back_populates="tasks")
    assignee = relationship("User")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sender_id = Column(Integer, ForeignKey("users.id"))
    
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Media Attachments
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    file_name = Column(String, nullable=True)

