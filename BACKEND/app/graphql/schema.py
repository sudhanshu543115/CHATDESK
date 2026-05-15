# app/graphql/schema.py
import strawberry
from strawberry.types import Info
from typing import List, Optional, cast
from datetime import datetime
import asyncio
from app.utils.auth import get_password_hash, verify_password, create_access_token
from app.config.db import SessionLocal
from app.models.user_model import User as UserModel
from app.models.chat_models import Workspace as WorkspaceModel, Channel as ChannelModel, Message as MessageModel, Group as GroupModel, Task as TaskModel
from sqlalchemy.exc import OperationalError, IntegrityError
from sqlalchemy import or_, and_

@strawberry.type
class User:
    id: int
    username: str
    email: str
    avatar: Optional[str] = None

@strawberry.type
class Task:
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    workspaceId: int
    assigneeId: Optional[int]
    createdAt: str
    dueDate: Optional[str] = None
    
    @strawberry.field
    def tags(self) -> List[str]:
        db = SessionLocal()
        try:
            task = db.query(TaskModel).filter(TaskModel.id == self.id).first()
            if task and task.tags:
                return [t.strip() for t in task.tags.split(',') if t.strip()]
            return []
        finally:
            db.close()

    @strawberry.field
    def assignee(self) -> Optional[User]:
        if not self.assigneeId: return None
        db = SessionLocal()
        try:
            user_obj = db.query(UserModel).filter(UserModel.id == self.assigneeId).first()
            if user_obj:
                return User(id=user_obj.id, username=user_obj.username, email=user_obj.email)
            return None
        finally:
            db.close()

@strawberry.type
class Message:
    id: int
    content: str
    timestamp: str
    senderId: int
    channelId: Optional[int] = None
    groupId: Optional[int] = None
    recipientId: Optional[int] = None
    
    @strawberry.field
    def sender(self) -> Optional[User]:
        db = SessionLocal()
        try:
            user_obj = db.query(UserModel).filter(UserModel.id == self.senderId).first()
            if user_obj:
                return User(id=user_obj.id, username=user_obj.username, email=user_obj.email)
            return None
        finally:
            db.close()

@strawberry.type
class Channel:
    id: int
    name: str
    isPrivate: bool
    workspaceId: int

@strawberry.type
class Group:
    id: int
    name: str
    workspaceId: int
    memberCount: int
    
    @strawberry.field
    def members(self) -> List[User]:
        db = SessionLocal()
        try:
            group_obj = db.query(GroupModel).filter(GroupModel.id == self.id).first()
            if group_obj and hasattr(group_obj, 'members'):
                return [
                    User(id=u.id, username=u.username, email=u.email) 
                    for u in group_obj.members
                ]
            return []
        finally:
            db.close()

@strawberry.type
class Workspace:
    id: int
    name: str
    slug: str
    ownerId: int

@strawberry.type
class AuthResponse:
    token: str
    username: str
    id: int

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "ChatDesk API is online"

    @strawberry.field
    def users(self) -> List[User]:
        db = SessionLocal()
        try:
            users = db.query(UserModel).all()
            return [User(id=u.id, username=u.username, email=u.email) for u in users]
        finally:
            db.close()

    @strawberry.field
    def workspaces(self) -> List[Workspace]:
        db = SessionLocal()
        try:
            workspaces = db.query(WorkspaceModel).all()
            return [Workspace(id=w.id, name=w.name, slug=w.slug, ownerId=w.owner_id) for w in workspaces]
        finally:
            db.close()

    @strawberry.field
    def tasks(self, workspaceId: int) -> List[Task]:
        db = SessionLocal()
        try:
            print(f"DEBUG: Fetching tasks for workspace {workspaceId}")
            tasks = db.query(TaskModel).filter(TaskModel.workspace_id == workspaceId).all()
            print(f"DEBUG: Found {len(tasks)} tasks")
            return [
                Task(
                    id=t.id, 
                    title=t.title, 
                    description=t.description, 
                    status=t.status, 
                    priority=t.priority, 
                    workspaceId=t.workspace_id,
                    assigneeId=t.assignee_id,
                    createdAt=t.created_at.isoformat(),
                    dueDate=t.due_date.isoformat() if t.due_date else None
                ) for t in tasks
            ]
        finally:
            db.close()

    @strawberry.field
    def group(self, id: int) -> Optional[Group]:
        db = SessionLocal()
        try:
            group_obj = db.query(GroupModel).filter(GroupModel.id == id).first()
            if group_obj:
                return Group(
                    id=group_obj.id, 
                    name=group_obj.name, 
                    workspaceId=group_obj.workspace_id, 
                    memberCount=len(group_obj.members)
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def groups(self, workspaceId: int) -> List[Group]:
        db = SessionLocal()
        try:
            groups = db.query(GroupModel).filter(GroupModel.workspace_id == workspaceId).all()
            return [
                Group(
                    id=g.id, 
                    name=g.name, 
                    workspaceId=g.workspace_id, 
                    memberCount=len(g.members)
                ) for g in groups
            ]
        finally:
            db.close()

    @strawberry.field
    def messages(self, info: Info, channelId: Optional[int] = None, groupId: Optional[int] = None, recipientId: Optional[int] = None) -> List[Message]:
        db = SessionLocal()
        try:
            query = db.query(MessageModel)
            if channelId:
                query = query.filter(MessageModel.channel_id == channelId)
            elif groupId:
                query = query.filter(MessageModel.group_id == groupId)
            elif recipientId:
                query = query.filter(or_(MessageModel.recipient_id == recipientId, MessageModel.sender_id == recipientId))
            
            messages = query.order_by(MessageModel.timestamp.asc()).limit(100).all()
            return [
                Message(
                    id=m.id, 
                    content=m.content, 
                    timestamp=m.timestamp.isoformat(), 
                    senderId=m.sender_id,
                    channelId=m.channel_id,
                    groupId=m.group_id,
                    recipientId=m.recipient_id
                ) for m in messages
            ]
        finally:
            db.close()

@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, username: str, email: str, password: str) -> AuthResponse:
        db = SessionLocal()
        try:
            hashed_pw = get_password_hash(password)
            user = UserModel(username=username, email=email, password=hashed_pw)
            db.add(user)
            db.commit()
            db.refresh(user)
            token = create_access_token({"sub": user.username, "id": str(user.id)})
            return AuthResponse(token=token, username=user.username, id=user.id)
        finally:
            db.close()

    @strawberry.mutation
    def login(self, username: str, password: str) -> AuthResponse:
        db = SessionLocal()
        try:
            user = db.query(UserModel).filter(UserModel.username == username).first()
            if not user or not verify_password(password, user.password):
                raise Exception("Invalid credentials")
            token = create_access_token({"sub": user.username, "id": str(user.id)})
            return AuthResponse(token=token, username=user.username, id=user.id)
        finally:
            db.close()

    @strawberry.mutation
    def create_task(self, info: Info, title: str, workspaceId: int, description: Optional[str] = None, priority: str = "Medium", assigneeId: Optional[int] = None, tags: Optional[List[str]] = None, dueDate: Optional[str] = None) -> Task:
        db = SessionLocal()
        try:
            due_date_obj = datetime.fromisoformat(dueDate) if dueDate else None
            tags_str = ",".join(tags) if tags else None
            
            task = TaskModel(
                title=title, 
                description=description, 
                workspace_id=workspaceId, 
                priority=priority,
                assignee_id=assigneeId,
                status="To Do",
                tags=tags_str,
                due_date=due_date_obj
            )
            db.add(task)
            db.commit()
            db.refresh(task)

            # Broadcast to all users
            manager = info.context.get("manager")
            if manager:
                asyncio.create_task(manager.broadcast({
                    "type": "TASK_CREATED",
                    "data": { "workspaceId": workspaceId }
                }))

            return Task(
                id=task.id, 
                title=task.title, 
                description=task.description, 
                status=task.status, 
                priority=task.priority, 
                workspaceId=task.workspace_id,
                assigneeId=task.assignee_id,
                createdAt=task.created_at.isoformat(),
                dueDate=task.due_date.isoformat() if task.due_date else None
            )
        finally:
            db.close()

    @strawberry.mutation
    def update_task_status(self, info: Info, id: int, status: str) -> Task:
        db = SessionLocal()
        try:
            task = db.query(TaskModel).filter(TaskModel.id == id).first()
            if task:
                task.status = status
                db.commit()
                db.refresh(task)

                # Broadcast to all users
                manager = info.context.get("manager")
                if manager:
                    asyncio.create_task(manager.broadcast({
                        "type": "TASK_UPDATED",
                        "data": { "workspaceId": task.workspace_id }
                    }))

            return Task(
                id=task.id, 
                title=task.title, 
                description=task.description, 
                status=task.status, 
                priority=task.priority, 
                workspaceId=task.workspace_id,
                assigneeId=task.assignee_id,
                createdAt=task.created_at.isoformat(),
                dueDate=task.due_date.isoformat() if task.due_date else None
            )
        finally:
            db.close()

    @strawberry.mutation
    def delete_task(self, info: Info, id: int) -> bool:
        db = SessionLocal()
        try:
            task = db.query(TaskModel).filter(TaskModel.id == id).first()
            if task:
                workspace_id = task.workspace_id
                db.delete(task)
                db.commit()

                # Broadcast to all users
                manager = info.context.get("manager")
                if manager:
                    asyncio.create_task(manager.broadcast({
                        "type": "TASK_DELETED",
                        "data": { "workspaceId": workspace_id }
                    }))
                return True
            return False
        finally:
            db.close()

    @strawberry.mutation
    def create_group(self, name: str, workspaceId: int, memberIds: List[int], info: Info) -> Group:
        db = SessionLocal()
        try:
            group = GroupModel(name=name, workspace_id=workspaceId)
            if memberIds:
                members = db.query(UserModel).filter(UserModel.id.in_(memberIds)).all()
                group.members = members
            db.add(group)
            db.commit()
            db.refresh(group)
            return Group(id=group.id, name=group.name, workspaceId=group.workspace_id, memberCount=len(group.members))
        finally:
            db.close()

    @strawberry.mutation
    def add_member_to_group(self, groupId: int, userId: int) -> Group:
        db = SessionLocal()
        try:
            group = db.query(GroupModel).filter(GroupModel.id == groupId).first()
            user = db.query(UserModel).filter(UserModel.id == userId).first()
            if group and user and user not in group.members:
                group.members.append(user)
                db.commit()
                db.refresh(group)
            return Group(id=group.id, name=group.name, workspaceId=group.workspace_id, memberCount=len(group.members))
        finally:
            db.close()

    @strawberry.mutation
    def remove_member_from_group(self, groupId: int, userId: int) -> Group:
        db = SessionLocal()
        try:
            group = db.query(GroupModel).filter(GroupModel.id == groupId).first()
            user = db.query(UserModel).filter(UserModel.id == userId).first()
            if group and user and user in group.members:
                group.members.remove(user)
                db.commit()
                db.refresh(group)
            return Group(id=group.id, name=group.name, workspaceId=group.workspace_id, memberCount=len(group.members))
        finally:
            db.close()

    @strawberry.mutation
    def delete_group(self, groupId: int) -> bool:
        db = SessionLocal()
        try:
            group = db.query(GroupModel).filter(GroupModel.id == groupId).first()
            if group:
                db.delete(group)
                db.commit()
                return True
            return False
        finally:
            db.close()

    @strawberry.mutation
    def delete_message(self, id: int) -> bool:
        db = SessionLocal()
        try:
            message = db.query(MessageModel).filter(MessageModel.id == id).first()
            if message:
                db.delete(message)
                db.commit()
                return True
            return False
        finally:
            db.close()

    @strawberry.mutation
    async def send_message(self, content: str, senderId: int, info: Info, channelId: Optional[int] = None, groupId: Optional[int] = None, recipientId: Optional[int] = None) -> Message:
        db = SessionLocal()
        try:
            message_time = datetime.utcnow()
            message = MessageModel(
                content=content,
                sender_id=senderId,
                channel_id=channelId,
                group_id=groupId,
                recipient_id=recipientId,
                timestamp=message_time
            )
            db.add(message)
            sender = db.query(UserModel).filter(UserModel.id == senderId).first()
            sender_name = sender.username if sender else "Unknown"
            db.commit()
            manager = info.context.get("manager")
            if manager:
                payload = {
                    "type": "NEW_MESSAGE",
                    "data": {
                        "id": message.id,
                        "content": content,
                        "timestamp": message_time.isoformat(),
                        "senderId": senderId,
                        "channelId": channelId,
                        "groupId": groupId,
                        "recipientId": recipientId,
                        "sender": {
                            "id": senderId,
                            "username": sender_name
                        }
                    }
                }
                asyncio.create_task(manager.broadcast(payload))
            return Message(id=message.id, content=content, timestamp=message_time.isoformat(), senderId=senderId, channelId=channelId, groupId=groupId, recipientId=recipientId)
        finally:
            db.close()

schema = strawberry.Schema(query=Query, mutation=Mutation)
