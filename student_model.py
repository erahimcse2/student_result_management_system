
from database import Base
from sqlalchemy import Column, Integer, String, Float


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50))
    roll = Column(String(50), nullable=False, unique=True)
    session = Column(Integer)
    department = Column(String(50))
    mark = Column(Float, nullable=False, default=0)
