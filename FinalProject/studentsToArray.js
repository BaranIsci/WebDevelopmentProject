// Importing the Student class from the student module
import { Student } from "./student.js";

// Importing the coursesArray from the coursesToArray module
import { coursesArray } from "./coursesToArray.js";

// Retrieving students from local storage and parsing them
var studentsInLocal = localStorage.getItem('students');
var students = JSON.parse(studentsInLocal);

// Initializing an array to store Student objects
export let studentsArray = [];

// Creating Student objects and populating studentsArray
for (var i = 0; i < students.length; i++) {
    studentsArray[i] = new Student(
        students[i].studentId,
        students[i].name,
        students[i].surname,
        students[i].takenCourses,
        students[i].grades
    );
}

// Function to check if grades input is valid
function checksForGrades(input) {
    var myList = input.split(",");
    for (var i = 0; i < 2; i++) {
        var grade = parseInt(myList[i]);
        if (grade <= 100 && grade >= 0) {
            continue;
        } else {
            console.log(myList[i]);
            return false;
        }
    }
    return true;
}

// Function to check if student ID is valid
export function checksIdValid(input) {
    for (var i = 0; i < studentsArray.length; i++) {
        console.log(studentsArray[i]);
        input = parseInt(input);
        if (studentsArray[i].studentId === input) {
            return false;
        }
    }
    return true;
}

// Function to find courseId by courseName
function findCourseIdByName(courseName) {
    for (var i = 0; i < coursesArray.length; i++) {
        if (courseName === coursesArray[i].courseName) {
            return coursesArray[i].courseId;
        }
    }
}

// Function to check if grades list has exactly 2 grades
function checkGradesLength(gradesList) {
    var gradesList = gradesList.split(",");
    if (gradesList.length === 2) {
        return true;
    }
    return false;
}

// Function to add a new student
export function addStudent(id, name, surname, courseName, grades) {
    if (!checksForGrades(grades)) {
        alert("Grades input is not valid. Please write like said below.");
    } else if (!checksIdValid(id)) {
        alert("It already exists with this id. Change it please.");
    } else if (!checkGradesLength(grades)) {
        alert("Grades are not 2. Just enter 2 grades please.");
    } else {
        var takenCourses = [];
        console.log(grades);
        var splittedGrades = grades.split(",");
        var allCoursesGrades = [];
        var courseGrades = [];
        courseGrades.push(parseInt(splittedGrades[0]));
        courseGrades.push(parseInt(splittedGrades[1]));
        allCoursesGrades.push(courseGrades);
        takenCourses.push(findCourseIdByName(courseName));
        var student = new Student(parseInt(id), name, surname, takenCourses, allCoursesGrades);
        studentsArray.push(student);
        console.log(studentsArray);
        localStorage.setItem('students', JSON.stringify(studentsArray));
    }
}
