import { hideOtherElements } from "./listAllCourses.js";
import { studentsArray } from "./studentsToArray.js";
import { coursesArray} from "./coursesToArray.js";
// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selectors for the search student button and the student list container
    const searchStudentButton = document.querySelector('#searchStudent');
    const studentListContainer = document.querySelector('#studentsList');

    // Event listener for the search student button click
    searchStudentButton.addEventListener('click', () => {
        // Hide other elements and display the student table
        hideOtherElements(studentListContainer);
        displayStudentTable(studentsArray, studentListContainer);
    });

    // Event listener for the global document click
    document.addEventListener('click', (event) => {
        const searchInput = document.getElementById('searchInput');
        // Check if the clicked element is the search button
        if (event.target.id === 'searchButton') {
            // Get the search input value and trim it
            const searchTerm = searchInput.value.trim().toLowerCase();

            // Filter students based on the search term
            const filteredStudents = studentsArray.filter(student => {
                const fullName = `${student.name} ${student.surname}`.toLowerCase();
                return fullName.includes(searchTerm);
            });

            // Display the filtered students in the student table
            displayStudentTable(filteredStudents, studentListContainer);
        }
    });

    // Event listener for the student list container click
    studentListContainer.addEventListener('click', (event) => {
        // Check if the clicked element has the 'deleteButton' class
        if (event.target.classList.contains('deleteButton')) {
            // Ask for user confirmation before deleting
            var userResponse = window.confirm("Are you sure to delete? It is not recoverable.");
            if (userResponse) {
                // Get the student ID to delete and call the delete function
                const studentIdToDelete = parseInt(event.target.dataset.studentId, 10);
                deleteStudentById(studentIdToDelete);
                // Display the updated student table
                displayStudentTable(studentsArray, studentListContainer);
            }
        }

        // Check if the clicked element has the 'updateButton' class
        if (event.target.classList.contains('updateButton')) {
            // Get the student ID to update and find the corresponding student
            const studentIdToUpdate = parseInt(event.target.dataset.studentId, 10);
            const studentToUpdate = studentsArray.find(student => student.studentId === studentIdToUpdate);

            if (studentToUpdate) {
                // Show the update student form with the selected student data
                showUpdateStudent(studentToUpdate);
                // Get the update student button and its event listener
                const updatingStudentButton = document.querySelector("#updateStudentButton");
                // Get all delete buttons and add event listeners for deleting courses
                const deleteButtons = document.querySelectorAll(".deleteCourseButton");
                deleteButtons.forEach((deleteButton) => {
                    deleteButton.addEventListener("click", () => {
                        // Ask for user confirmation before deleting the course from the student
                        const userResponse = window.confirm("Are you sure to delete? It is not recoverable.");
                        if (userResponse) {
                            // Extract the deleted course ID from the button ID
                            const charsOfButtonId = deleteButton.id.split("");
                            const deletedCourseId = parseInt(charsOfButtonId[charsOfButtonId.length - 1]);
                            // Find the student and course index to delete the course
                            const updatingStudent = studentsArray.find(student => student.studentId === studentToUpdate.studentId);
                            const courseIndex = updatingStudent.takenCourses.indexOf(deletedCourseId);
                            // Delete the course and grades from the student
                            if (courseIndex !== -1) {
                                updatingStudent.takenCourses.splice(courseIndex, 1);
                                updatingStudent.grades.splice(courseIndex, 1);
                            }
                            // Hide the course grade container in the display table
                            document.getElementById(`courseGradeContainer${deletedCourseId}`).style.display = "none";
                        }
                    });
                });
                // Get the add course to student button and its event listener
                const addCourseToStudent = document.querySelector("#addCourseToStudent");
                addCourseToStudent.addEventListener("click", () => {
                    // Ask for user confirmation before adding the course to the student
                    const userResponse = window.confirm("Are you sure to add? It is not recoverable.");
                    if (userResponse) {
                        // Get the selected course ID and grades input value
                        const newCourseIdOption = document.querySelector("#takingCourseName");
                        const newGrades = document.querySelector("#newTakingCourse").value;
                        const newCourseId = newCourseIdOption.value;
                        console.log(newCourseId);
                        // Check if the student already has the selected course
                        if (studentToUpdate.takenCourses.includes(parseInt(newCourseId))) {
                            alert("You cannot add that course. The student already has it.")
                        } else {
                            // Split the grades input and add the new course to the student
                            const newGradesToPush = newGrades.split(",");
                            if (newGradesToPush.length === 2) {
                                studentToUpdate.takenCourses.push(parseInt(newCourseId));
                                studentToUpdate.grades.push([parseInt(newGradesToPush[0]), parseInt(newGradesToPush[1])])
                                console.log(studentToUpdate);
                                localStorage.setItem('students', JSON.stringify(studentsArray));
                            }
                        }
                    }
                });
                // Get the updating student button and its event listener
                updatingStudentButton.addEventListener('click', () => {
                    // Call the update student function and display the updated student table
                    updateStudent(studentToUpdate.studentId);
                    console.log(studentToUpdate);
                    displayStudentTable(studentsArray, studentListContainer);
                    hideOtherElements(studentListContainer);
                });
            } else {
                console.log(`Student with ID ${studentIdToUpdate} not found.`);
            }
        }
    });
});

// Function to show the update student form with the selected student data
function showUpdateStudent(student) {
    // Get the update student form container
    const updateFormContainer = document.querySelector('#updateStudentForm');
    // Hide other elements and show the update form
    hideOtherElements(updateFormContainer);

    // Get the taken courses and grades of the student
    const takenCourses = student.takenCourses;
    const grades = student.grades;

    // Create HTML content for each course in the update form
    const formContent = takenCourses.map((courseId, index) => {
        // Find the course object based on the courseId
        const course = coursesArray.find(course => course.courseId === courseId);

        // Get the course name
        const courseName = course ? course.courseName : '';

        return `
            <div class="courseGradeContainer" id="courseGradeContainer${courseId}">
                <label for="updateCourse${courseId}">Grades for ${courseName} </label>
                <input type="text" id="updateCourse${courseId}" value="${grades[index]}" required>
                <button type="button" class="deleteCourseButton" id="deleteCourseButton${courseId}"> Delete</button>
            </div>
        `;
    }).join('');

    // Set the update form content
    updateFormContainer.innerHTML = `
        <h2>Update Student</h2>
        <form id="updateForm">
            <label for="updateName">Name</label>
            <input type="text" id="updateName" value="${student.name}" required>

            <label for="updateSurname">Surname</label>
            <input type="text" id="updateSurname" value="${student.surname}" required>

            <div class="courseContainer"></div>
            ${formContent}
            <label for="newTakingCourse">Grades</label>
            <input type="text" id="newTakingCourse" value="" required>
            <!-- New dropdown menu for adding a course -->
            <label for="takingCourseName">Select a Course to Add:</label>
            <select id="takingCourseName">
                <option value="" selected disabled>Select a Course</option>
            </select>
            <button type="button" id="addCourseToStudent">Add Course</button>
            <button type="button" id="updateStudentButton">Update</button>
        </form>
    `;

    // Populate the course dropdown menu
    populateCourseDropdown(student, coursesArray);
}

// Function to populate the course dropdown menu
function populateCourseDropdown(student, coursesArray) {
    // Get the course dropdown menu
    const takenCourseDropdown = document.querySelector('#takingCourseName');

    // Clear existing options first
    takenCourseDropdown.innerHTML = '<option value="" selected disabled>Select a Course</option>';

    // Add courses from coursesArray to the dropdown menu
    coursesArray.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseId; // Use the course ID as the value
        option.text = course.courseName;
        takenCourseDropdown.appendChild(option);
    });
}

// Function to update a student's information and grades
function updateStudent(studentId) {
    // Find the index of the student to update
    const indexToUpdate = studentsArray.findIndex(student => student.studentId === studentId);

    // Get the updated name and surname from the input fields
    const updatedName = document.getElementById('updateName').value;
    const updatedSurname = document.getElementById('updateSurname').value;

    // Check if the student is found
    if (indexToUpdate !== -1) {
        // Get all course grade inputs
        const courseGradesInputs = document.querySelectorAll('.courseGradeContainer input');

        // Iterate through each course and update the grades
        courseGradesInputs.forEach(input => {
            // Extract the course ID from the input ID
            const courseId = parseInt(input.id.slice(-1));

            // Extract and clean the updated grades input
            const updatedGrades = input.value.split(',').map(grade => grade.trim());

            // Check for valid grades input
            if (updatedGrades.length !== 2) {
                alert("Just enter 2 grades for every lesson please.");
            } else if (parseInt(updatedGrades[0]) > 100 || parseInt(updatedGrades[0]) < 0 || parseInt(updatedGrades[1]) > 100 || parseInt(updatedGrades[1]) < 0) {
                alert("Your grades are not valid. Please change them.");
            } else {
                // Update the grades for the course
                const courseIndex = studentsArray[indexToUpdate].takenCourses.indexOf(courseId);
                if (courseIndex !== -1) {
                    studentsArray[indexToUpdate].grades[courseIndex][0] = parseInt(updatedGrades[0]);
                    studentsArray[indexToUpdate].grades[courseIndex][1] = parseInt(updatedGrades[1]);
                }
            }
        });

        // Update the student's name and surname
        studentsArray[indexToUpdate].name = updatedName;
        studentsArray[indexToUpdate].surname = updatedSurname;

        // Update localStorage
        localStorage.setItem('students', JSON.stringify(studentsArray));

        // Clear the update form
        document.getElementById('updateStudentForm').innerHTML = '';
    } else {
        console.log(`Student with ID ${studentId} not found.`);
    }
}

// Function to delete a student by ID
function deleteStudentById(studentId) {
    // Find the index of the student to delete
    const indexToDelete = studentsArray.findIndex(student => student.studentId === studentId);

    // Check if the student is found
    if (indexToDelete !== -1) {
        // Delete the student from the array
        studentsArray.splice(indexToDelete, 1);
        // Update localStorage
        localStorage.setItem('students', JSON.stringify(studentsArray));
        console.log(`Student with ID ${studentId} deleted. Updated studentsArray:`, studentsArray);
    } else {
        console.log(`Student with ID ${studentId} not found.`);
    }
}

// Function to display the student table
function displayStudentTable(studentArray, container) {
    // Create a new HTML table
    const table = document.createElement('table');
    table.id = "displayStudentTable";

    // Set the table headers
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>GPA</th>
                <th>Total ACTS</th>
                <th>Lecture Names</th>
                <th>Lecture Grades</th>
                <th>Delete</th>
                <th>Update</th>
            </tr>
        </thead>
        <tbody>
            ${studentArray.map(student => `
                <tr>
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    <td>${student.surname}</td>
                    <td>${student.getStudentGpa()}</td>
                    <td>${student.getTotalActs()}</td>
                    <!-- Edit Lecture Names and Lecture Grades columns -->
                    <td>${formatLectureNames(student.getLectureNames())}</td>
                    <td>${formatLectureGrades(student.getLectureGrades())}</td>
                    <!-- Add Delete and Update buttons -->
                    <td><button class="deleteButton" data-student-id="${student.studentId}">Delete</button></td>
                    <td><button class="updateButton" data-student-id="${student.studentId}">Update</button></td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Clear the container content and add input and search button for searching
    container.innerHTML = '';
    container.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search by Name or Surname">
        <button id="searchButton">Search</button>
    `;

    // Append the table to the container
    container.appendChild(table);
}

// Helper function to format Lecture Names column
function formatLectureNames(lectureNames) {
    // Place each course name on a new line
    return lectureNames.join('<br>');
}

// Helper function to format Lecture Grades column
function formatLectureGrades(lectureGrades) {
    // Place each grade on a new line, add "Midterm" for odd-indexed grades and "Final" for even-indexed grades
    return lectureGrades.map((grade, index) => `${grade}${index % 2 === 0 ? ' - Midterm' : ' - Final'}`).join('<br>');
}
