from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# DATABASE_URL ="mysql+pymysql://root:root@localhost:3306/training_db"
DATABASE_URL = "postgresql+psycopg2://practice_database_lk53_user:2FhDuiaZ2avgKWpnnguYS4Gw8klwTiOm@dpg-dbcthlmq1p3s73d90jrg-a.oregon-postgres.render.com/practice_database_lk53"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()