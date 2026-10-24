
from student_repository import StudentRepository
from sqlalchemy.orm import Session
from schema import StudentUpdateRequest, StudentCreateRequet
from fastapi import HTTPException
from student_model import Student


class StudentService:
    def __init__(self):
        self.repository = StudentRepository()

    def get_student_by_roll(self, db: Session, roll: str):
        student = self.repository.get_student_by_roll(db, roll)

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        return student

    def update_student(
        self,
        db: Session,
        update_student: StudentUpdateRequest,
        roll: str
    ):
        # Find student using the old roll
        student = self.repository.get_student_by_roll(db, roll)

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        # Check duplicate roll if roll is changed
        if update_student.roll != roll:
            existing_student = self.repository.get_student_by_roll(
                db, update_student.roll
            )

            if existing_student:
                raise HTTPException(
                    status_code=409,
                    detail="Student roll already exists"
                )

        # Update all fields
        student.first_name = update_student.first_name
        student.last_name = update_student.last_name
        student.department = update_student.department
        student.session = update_student.session
        student.roll = update_student.roll
        student.mark = update_student.mark

        return self.repository.update_student(db, student)

    def create_student(
        self,
        db: Session,
        student_payload: StudentCreateRequet
    ):
        # Check duplicate roll
        existing_student = self.repository.get_student_by_roll(
            db, student_payload.roll
        )

        if existing_student:
            raise HTTPException(
                status_code=409,
                detail="Student roll already exists"
            )

        # Create student with marks
        student = Student(
            first_name=student_payload.first_name,
            last_name=student_payload.last_name,
            roll=student_payload.roll,
            session=student_payload.session,
            department=student_payload.department,
            mark=student_payload.mark
        )

        return self.repository.create_student(db, student)

    def get_all_students(self, db: Session):
        return self.repository.get_all(db=db)

    def delete_student(self, roll: str, db: Session):
        student = self.repository.get_student_by_roll(db, roll)

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        return self.repository.delete_student(db, roll)
