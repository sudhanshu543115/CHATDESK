"""
Quick migration to add media columns to the messages table.
Run this once: python -m app.migrate_media
"""
from app.config.db import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE messages ADD COLUMN media_url VARCHAR"))
            print("Added media_url column")
        except Exception as e:
            print(f"media_url already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE messages ADD COLUMN media_type VARCHAR"))
            print("Added media_type column")
        except Exception as e:
            print(f"media_type already exists or error: {e}")

        try:
            conn.execute(text("ALTER TABLE messages ADD COLUMN file_name VARCHAR"))
            print("Added file_name column")
        except Exception as e:
            print(f"file_name already exists or error: {e}")

        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
