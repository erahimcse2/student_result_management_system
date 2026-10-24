
const API_URL = "https://my-project-rahim.onrender.com";
const STUDENTS_URL = `${API_URL}/students/`;

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const message = document.getElementById("message");

const studentIdInput = document.getElementById("studentId");
const firstNameInput = document.getElementById("first_name");
const lastNameInput = document.getElementById("last_name");
const departmentInput = document.getElementById("department");
const rollInput = document.getElementById("roll");
const marksInput = document.getElementById("marks");
const resultInput = document.getElementById("result");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const refreshBtn = document.getElementById("refreshBtn");

let editingRoll = null;

function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;
}

function clearMessage() {
    message.textContent = "";
    message.className = "message";
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        let errorMessage = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();

            if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail
                    .map(item => item.msg)
                    .join(", ");
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch {
            // Keep the default error message.
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
    return cell;
}

async function loadStudents() {
    clearMessage();

    try {
        const students = await apiRequest(STUDENTS_URL);
        studentTable.replaceChildren();

        if (!Array.isArray(students) || students.length === 0) {
            const row = document.createElement("tr");
            const cell = addCell(row, "No students found.");
            cell.colSpan = 8;
            studentTable.appendChild(row);
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            addCell(row, student.id);
            addCell(row, student.first_name);
            addCell(row, student.last_name);
            addCell(row, student.department);
            addCell(row, student.roll);
            addCell(row, student.marks);
            addCell(row, student.result);

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.type = "button";
            editButton.addEventListener("click", () => editStudent(student));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            deleteButton.type = "button";
            deleteButton.addEventListener("click", () =>
                deleteStudent(student.roll)
            );

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);
            studentTable.appendChild(row);
        });
    } catch (error) {
        showMessage(`Could not load students: ${error.message}`, "error");
        studentTable.replaceChildren();

        const row = document.createElement("tr");
        const cell = addCell(row, "Unable to load students.");
        cell.colSpan = 8;
        studentTable.appendChild(row);
    }
}

function editStudent(student) {
    clearMessage();

    studentIdInput.value = student.id ?? "";
    firstNameInput.value = student.first_name ?? "";
    lastNameInput.value = student.last_name ?? "";
    departmentInput.value = student.department ?? "";
    rollInput.value = student.roll ?? "";
    marksInput.value = student.marks ?? "";
    resultInput.value = student.result ?? "";

    editingRoll = String(student.roll);

    rollInput.dataset.originalRoll = String(student.roll);

    formTitle.textContent = "Update Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.hidden = false;

    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
    form.reset();
    studentIdInput.value = "";
    resultInput.value = "";
    editingRoll = null;
    delete rollInput.dataset.originalRoll;

    formTitle.textContent = "Add Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.hidden = true;
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage();

    const marks = Number(marksInput.value);

    if (
        marksInput.value.trim() === "" ||
        !Number.isInteger(marks) ||
        marks < 0 ||
        marks > 100
    ) {
        showMessage("Marks must be a whole number between 0 and 100.", "error");
        return;
    }

    const studentData = {
        first_name: firstNameInput.value.trim(),
        last_name: lastNameInput.value.trim(),
        department: departmentInput.value.trim(),
        roll: rollInput.value.trim(),
        marks: marks
    };

    const isEditing = editingRoll !== null;

    const url = isEditing
        ? `${STUDENTS_URL}update/${encodeURIComponent(editingRoll)}`
        : `${STUDENTS_URL}create`;

    const method = isEditing ? "PATCH" : "POST";

    submitBtn.disabled = true;

    try {
        const savedStudent = await apiRequest(url, {
            method,
            body: JSON.stringify(studentData)
        });

        const calculatedResult = savedStudent?.result ?? "Not returned";

        resetForm();
        await loadStudents();

        showMessage(
            `Student ${isEditing ? "updated" : "added"} successfully. Result: ${calculatedResult}`,
            "success"
        );
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        submitBtn.disabled = false;
    }
});

async function deleteStudent(roll) {
    const confirmed = confirm(`Delete student with roll ${roll}?`);

    if (!confirmed) {
        return;
    }

    clearMessage();

    try {
        await apiRequest(
            `${STUDENTS_URL}${encodeURIComponent(roll)}`,
            { method: "DELETE" }
        );

        if (editingRoll === String(roll)) {
            resetForm();
        }

        await loadStudents();
        showMessage("Student deleted successfully.", "success");
    } catch (error) {
        showMessage(error.message, "error");
    }
}

cancelBtn.addEventListener("click", () => {
    resetForm();
    clearMessage();
});

refreshBtn.addEventListener("click", loadStudents);

loadStudents();
