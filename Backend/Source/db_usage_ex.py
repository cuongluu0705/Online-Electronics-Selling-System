# Example file to print all customer
# This file is for checking connection only

import json
from sqlalchemy import text

from database_connection import SessionLocal  # uses your existing DB connection


def main():
    # Create a new DB session
    db = SessionLocal()
    try:
        # Query all rows from the "customer" table
        result = db.execute(text("SELECT * FROM customer"))

        # Convert result rows to a list of dicts
        rows = result.mappings().all()

        # Dump as JSON (pretty printed, UTF-8 safe)
        print(json.dumps(list(rows), ensure_ascii=False, default=str, indent=2))
    finally:
        db.close()


if __name__ == "__main__":
    main()
