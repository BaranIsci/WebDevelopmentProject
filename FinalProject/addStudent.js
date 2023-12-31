// Importing functions and arrays from other modules
import { hideOtherElements } from "./listAllCourses.js";
import { addStudent } from "./studentsToArray.js";
import { coursesArray } from "./coursesToArray.js";

// Event listener for the DOMContentLoaded event to ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Selecting relevant HTML elements
    const addStudentSideBarButton = document.querySelector('#addStudent');
    const addStudentContainer = document.querySelector('#addStudentSection');
    const addStudentButton = document.querySelector('#addStudentButton');

    // Function to populate the course dropdown menu with courses from the coursesArray
    function populateCourseDropdown() {
        const takenCourseDropdown = document.querySelector('#takenCourseName');

        // First, clear the existing options
        takenCourseDropdown.innerHTML = '<option value="" selected disabled>Select a Course</option>';

        // Add courses from the coursesArray
        coursesArray.forEach(course => {
            const option = document.createElement('option');
            option.value = course.courseName; // You can use the course name as the value
            option.text = course.courseName;
            takenCourseDropdown.appendChild(option);
        });
    }

    // Adding a click event listener to the "Add Student" button in the sidebar
    addStudentSideBarButton.addEventListener('click', () => {
        // Hiding other elements and showing the "Add Student" section
        hideOtherElements(addStudentContainer);

        // Populate the dropdown menu when the page is loaded
        populateCourseDropdown();
    });

    // Adding a click event listener to the "Add Student" button inside the "Add Student" section
    addStudentButton.addEventListener('click', () => {
        // Retrieving values from input fields
        const studentId = document.querySelector('#studentId').value;
        const studentName = document.querySelector('#name').value;
        const studentSurname = document.querySelector('#surname').value;
        const courseName = document.querySelector('#takenCourseName').value;
        const courseGrade = document.querySelector('#courseGrade').value;

        // Checking if "Select a Course" is chosen
        if (courseName === "") {
            alert("Please select a course.");
            return; // Terminate the function here
        }

        // Calling the addStudent function with the retrieved values
        addStudent(studentId, studentName, studentSurname, courseName, courseGrade);
    });
});
