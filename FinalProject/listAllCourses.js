// Importing arrays containing course and student data
import { coursesArray } from "./coursesToArray.js";
import { studentsArray } from "./studentsToArray.js";

document.addEventListener('DOMContentLoaded', () => {
    // Selecting HTML elements
    const searchCourseButton = document.querySelector('#searchCourse');
    const coursesListContainer = document.querySelector('#coursesList');

    // Event listener for the "Search Course" button
    searchCourseButton.addEventListener('click', () => {
        // Hiding other elements and displaying the course table
        hideOtherElements(coursesListContainer);
        displayCourseTable(coursesArray, coursesListContainer);

        // Displaying the course dropdown menu
        const courseDropdownContainer = document.getElementById("courseDropdownContainer");
        coursesDropdownMenu(courseDropdownContainer, coursesListContainer);
    });

    // Event listener for delete button clicks in the course table
    coursesListContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteButton")) {
            // Confirming deletion with the user
            var userResponse = window.confirm("Are you sure to delete? It is not recoverable.");

            if (userResponse) {
                // Deleting the selected course and updating related student data
                const courseIdToDelete = parseInt(event.target.dataset.courseId, 10);
                deleteCourseById(courseIdToDelete);

                // Updating student data after course deletion
                for (var i = 0; i < studentsArray.length; i++) {
                    var student = studentsArray[i];
                    var studentsCourses = student.takenCourses;

                    for (var j = 0; j < studentsCourses.length; j++) {
                        if (studentsCourses[j] === courseIdToDelete) {
                            studentsCourses.splice(j, 1);
                            student.grades.splice(j, 1);
                        }
                    }
                }

                // Logging updated data to the console and redisplaying the course table
                console.log(coursesArray);
                console.log(studentsArray);
                displayCourseTable(coursesArray, coursesListContainer);
            }
        }
    });
});

// Function to handle changes in the course dropdown menu
export function coursesDropdownMenu(courseDropdownContainer, coursesListContainer) {
    courseDropdownContainer.addEventListener('change', (event) => {
        // Handling course selection changes
        const selectedCourseId = event.target.value;

        if (selectedCourseId) {
            const selectedCourse = coursesArray.find(course => course.courseId === parseInt(selectedCourseId));

            if (selectedCourse) {
                // Filtering students taking the selected course and displaying them
                const studentsTakingCourse = studentsArray.filter(student =>
                    student.takenCourses.includes(selectedCourse.courseId)
                );
                displayStudentsForCourse(studentsTakingCourse, coursesListContainer, selectedCourse.courseName);
            }
        }
    });
}

// Function to hide elements other than the specified container
export function hideOtherElements(container) {
    const allElementsInSection = document.querySelectorAll(".container");

    // Hiding other elements
    for (const anElement of allElementsInSection) {
        anElement.style.display = "none";
    }

    // Displaying the specified container
    container.style.display = "block";
}

// Function to delete a course by its ID
function deleteCourseById(courseId) {
    const coursesListContainer = document.querySelector('#coursesList');
    const courseDropdownContainer = document.getElementById("courseDropdownContainer");

    // Finding the index of the course to delete
    const indexToDelete = coursesArray.findIndex(course => course.courseId === courseId);

    if (indexToDelete !== -1) {
        // Deleting the course from the array and updating local storage
        coursesArray.splice(indexToDelete, 1);
        localStorage.setItem("courses", JSON.stringify(coursesArray));
        console.log(`Course with ID ${courseId} deleted. Updated coursesArray:`, coursesArray);
    } else {
        console.log(`Course with ID ${courseId} not found.`);
    }

    // Updating the course dropdown menu
    coursesDropdownMenu(courseDropdownContainer, coursesListContainer);
}

// Function to display the course table
function displayCourseTable(courseArray, container) {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Course Name</th>
                <th>Instructor of that Course</th>
                <th>ACTS</th>
                <th>Midterm -- Final Percent</th>
                <th>Point Scale</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            ${courseArray.map(course => `
                <tr>
                    <td>${course.courseId}</td>
                    <td>${course.courseName}</td>
                    <td>${course.instructorName}</td>
                    <td>${course.acts}</td>
                    <td>${"%"+ course.midtermPercent + "--" +"%"+ course.finalPercent}</td>
                    <td>${course.pointScale}</td>
                    <td><button class="deleteButton" data-course-id="${course.courseId}">Delete</button></td>
                </tr>
            `).join('')}
        </tbody>
    `;

    container.innerHTML = '';  // Clearing previous content

    // Creating the course dropdown container
    const courseDropdownContainer = document.createElement('div');
    courseDropdownContainer.id = 'courseDropdownContainer';
    
    // Creating and populating the course dropdown menu
    const courseDropdown = document.createElement('select');
    courseDropdown.id = 'courseDropdown';
    courseDropdown.innerHTML = '<option value="" selected disabled>Select a Course</option>';

    courseArray.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseId;
        option.text = course.courseName;
        courseDropdown.appendChild(option);
    });

    courseDropdownContainer.appendChild(courseDropdown);

    // Adding the dropdown and table to the container
    container.appendChild(courseDropdownContainer);
    container.appendChild(table);
}

// Function to display students enrolled in a specific course
function displayStudentsForCourse(studentArray, container, courseName) {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Midterm Grade</th>
                <th>Final Grade</th>
                <th>Letter Grade</th>
                <th>Is Passed</th>
                <th>Is Failed</th>
            </tr>
        </thead>
        <tbody>
            ${studentArray.map(student => `
                <tr>
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    <td>${student.surname}</td>
                    <td>${getGradeForCourse(student, courseName, 'midterm')}</td>
                    <td>${getGradeForCourse(student, courseName, 'final')}</td>
                    <td>${getLetterGradeForCourse(student, courseName)}</td>
                    <td>${getIsPassedStudents(student, courseName)}</td>
                    <td>${getIsFailedStudents(student, courseName)}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // Clearing previous content
    container.innerHTML = '';

    // Adding information about the course
    const informationAboutCourse = document.createElement("p");
    const numberOfAllStudents = counterAllStudentsForCourse(courseName);
    const numberOfAllPassedStudents = passedAllStudentsForCourse(courseName);
    const averageGradeOfCourse = calculateAverageGradeForCourse(courseName);

    informationAboutCourse.innerHTML =`
        Here it is the information about <strong>${courseName}</strong>. <br>
        There are <strong>${numberOfAllStudents}</strong> students for this course. <br>
        There are <strong>${numberOfAllPassedStudents}</strong> students who passed for this course. <br>
        There are <strong>${numberOfAllStudents - numberOfAllPassedStudents}</strong> students who failed for this course. <br>
        The average grade of this course is : <strong>${averageGradeOfCourse.toFixed(2)}</strong>.
    `;

    // Adding the table and information to the container
    container.appendChild(informationAboutCourse);
    container.appendChild(table);
}

// Function to get the grade for a specific course and exam type (midterm or final)
function getGradeForCourse(student, courseName, examType) {
    const courseIndex = student.takenCourses.indexOf(coursesArray.find(course => course.courseName === courseName).courseId);
    return courseIndex !== -1 ? student.grades[courseIndex][examType === 'midterm' ? 0 : 1] : '';
}

// Function to get the letter grade for a specific course
function getLetterGradeForCourse(student, courseName) {
    const course = coursesArray.find(course => course.courseName === courseName);

    if (!course) {
        console.error(`Course not found: ${courseName}`);
        return '';
    }

    const courseIndex = student.takenCourses.indexOf(course.courseId);

    if (courseIndex === -1) {
        console.error(`Student not enrolled in course: ${courseName}`);
        return '';
    }

    const midtermGrade = student.grades[courseIndex][0];
    const finalGrade = student.grades[courseIndex][1];
    const midtermPercent = course.midtermPercent;
    const finalPercent = course.finalPercent;
    const averageGrade = student.findAverageGrades(midtermGrade, finalGrade, midtermPercent, finalPercent);

    // Finding the letter grade for the given point scale
    if (course.pointScale === 10) {
        return student.findLetterGradeFor10(averageGrade);
    } else {
        return student.findLetterGradeFor7(averageGrade);
    }
}

// Function to check if a student passed a specific course
function getIsPassedStudents(student, courseName) {
    if (getLetterGradeForCourse(student, courseName) === "FF") {
        return "No";
    } else {
        return "Yes";
    }
}

// Function to check if a student failed a specific course
function getIsFailedStudents(student, courseName) {
    if (getLetterGradeForCourse(student, courseName) === "FF") {
        return "Yes";
    } else {
        return "No";
    }
}

// Function to count all students enrolled in a specific course
function counterAllStudentsForCourse(courseName) {
    const courseId = coursesArray.find(course => course.courseName === courseName).courseId;
    var counter = 0;

    for (var i = 0; i < studentsArray.length; i++) {
        for (var j = 0; j < studentsArray[i].takenCourses.length; j++) {
            if (courseId === studentsArray[i].takenCourses[j]) {
                counter++;
            }
        }
    }
    return counter;
}

// Function to count students who passed a specific course
function passedAllStudentsForCourse(courseName) {
    const courseId = coursesArray.find(course => course.courseName === courseName).courseId;
    var counter = 0;

    for (var i = 0; i < studentsArray.length; i++) {
        for (var j = 0; j < studentsArray[i].takenCourses.length; j++) {
            if (courseId === studentsArray[i].takenCourses[j]) {
                if (getLetterGradeForCourse(studentsArray[i], courseName) !== "FF") {
                    counter++;
                }
            }
        }
    }
    return counter;
}
// Calculates the average grade for a given course.
function calculateAverageGradeForCourse(courseName) {
    // Find the courseId for the given courseName in the coursesArray
    const courseId = coursesArray.find(course => course.courseName === courseName).courseId;
    
    // Find the course object using courseId
    const course = coursesArray.find(course => course.courseName === courseName);

    // Initialize totalGrade to calculate the sum of average grades
    var totalGrade = 0;

    // Iterate through the studentsArray
    for (var i = 0; i < studentsArray.length; i++) {
        // Get the current student
        var student = studentsArray[i];

        // Iterate through the taken courses of the student
        for (var j = 0; j < student.takenCourses.length; j++) {
            // Get the index of the current course in the student's taken courses
            var courseIndex = j;

            // Check if the courseId matches the current course in the loop
            if (courseId === student.takenCourses[j]) {
                // Log information for debugging
                console.log(student);
                console.log(student.grades);
                console.log(courseIndex);

                // Get the midterm and final grades for the current course
                const midtermGrade = student.grades[courseIndex][0];
                const finalGrade = student.grades[courseIndex][1];

                // Get the midterm and final percentage weights for the course
                const midtermPercent = course.midtermPercent;
                const finalPercent = course.finalPercent;

                // Calculate the average grade for the course using the student method
                const averageGrade = student.findAverageGrades(midtermGrade, finalGrade, midtermPercent, finalPercent);

                // Accumulate the average grade to calculate the total
                totalGrade += averageGrade;
            }
        }
    }

    // Calculate the average grade for the course by dividing the total by the number of students
    return totalGrade / counterAllStudentsForCourse(courseName);
}