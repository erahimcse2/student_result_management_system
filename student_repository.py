
from sqlalchemy.orm import Session
from student_model import Student


class StudentRepository:

    def create_student(self, db: Session, student: Student):
        # Save student with marks and calculated result
        db.add(student)
        db.commit()
        db.refresh(student)
        return student

    def get_student_by_roll(self, db: Session, roll: str):
        return (
            db.query(Student)
            .filter(Student.roll == roll)
            .first()
        )

    def update_student(self, db: Session, student: Student):
        # Marks and result are updated through the student object
        db.commit()
        db.refresh(student)
        return student

    def get_all(self, db: Session):
        return db.query(Student).order_by(Student.id).all()

    def delete_student(self, db: Session, roll: str):
        student = self.get_student_by_roll(db, roll)

        if student is None:
            return False

        db.delete(student)
        db.commit()
        return True
