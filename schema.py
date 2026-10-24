
from pydantic import BaseModel, Field


class BaseStudent(BaseModel):
    first_name: str
    last_name: str
    roll: str
    session: int
    department: str
    mark: float = Field(ge=0, le=100)


class StudentCreateRequet(BaseStudent):
    pass


class StudentUpdateRequest(BaseModel):
    first_name: str
    last_name: str
    department: str
    session: int
    roll: str
    mark: float = Field(ge=0, le=100)


class StudentResponse(BaseStudent):
    id: int

    class Config:
        orm_mode = True
