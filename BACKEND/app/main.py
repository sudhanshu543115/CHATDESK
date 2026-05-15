from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from typing import List, Dict, Set
import json
import asyncio
from app.config.db import engine, Base
import app.models.chat_models # Ensure models are loaded
import app.models.user_model # Ensure user model is loaded

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChatDesk API")

# CORS Configuration - Explicitly allow all for WebSocket handshakes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        try:
            await websocket.accept()
            if user_id not in self.active_connections:
                self.active_connections[user_id] = set()
            self.active_connections[user_id].add(websocket)
            print(f"DEBUG: User {user_id} connected. Active sessions: {len(self.active_connections[user_id])}")
            return True
        except Exception as e:
            print(f"DEBUG: Failed to accept WS for User {user_id}: {e}")
            return False

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"DEBUG: Session for User {user_id} removed")

    async def broadcast(self, message: dict):
        data = json.dumps(message)
        dead_connections = []
        
        # Snapshot of connections to avoid modification errors
        current_users = list(self.active_connections.items())
        
        for user_id, connections in current_users:
            for websocket in list(connections):
                try:
                    await websocket.send_text(data)
                except Exception:
                    dead_connections.append((user_id, websocket))
        
        for user_id, websocket in dead_connections:
            self.disconnect(websocket, user_id)

manager = ConnectionManager()

async def get_context():
    return {"manager": manager}

graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    success = await manager.connect(websocket, user_id)
    if not success:
        return

    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=60.0)
                if data == "ping":
                    await websocket.send_text("pong")
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"type": "PING"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"DEBUG: WS Loop error for User {user_id}: {e}")
        manager.disconnect(websocket, user_id)

@app.get("/")
async def root():
    return {"message": "ChatDesk Backend is running on Port 8001"}
