// Importing the Course class from the course.js file
import { Course } from "./course.js";

// Retrieving courses from local storage
var coursesInLocal = localStorage.getItem('courses');

// Parsing the courses from local storage into an array
var courses = JSON.parse(coursesInLocal);

// Initializing an empty array to store Course instances
export let coursesArray = [];

// Creating Course instances from the parsed data and adding them to the coursesArray
for (var i = 0; i < courses.length; i++) {
    coursesArray[i] = new Course(
        courses[i].courseId,
        courses[i].courseName,
        courses[i].instructorName,
        courses[i].acts,
        courses[i].midtermPercent,
        courses[i].finalPercent,
        courses[i].pointScale
    );
}

// Function to check if a course ID is valid and not already in use
function checksIdValid(input) {
    for (var i = 0; i < coursesArray.length; i++) {
        input = parseInt(input);
        if (coursesArray[i].courseId === input) {
            return false;
        }
    }
    return true;
}

// Function to check if the number of acts is valid (greater than 0)
function checksActsValid(input) {
    var acts = parseInt(input);
    if (acts > 0) {
        return true;
    }
    return false;
}

// Function to check if the midterm percentage is valid (between 1 and 99)
function checksMPercentValid(input) {
    var midtermPercent = parseInt(input);
    if (midtermPercent <= 99 && midtermPercent >= 1) {
        return true;
    }
    return false;
}

// Function to check if the point scale is valid (7 or 10)
function checksPointScale(input) {
    var pointScale = parseInt(input);
    if (pointScale === 7 || pointScale === 10) {
        return true;
    }
    return false;
}

// Function to add a new course to the coursesArray and local storage
export function addCourse(courseId, courseName, instructorName, courseActs, courseMPercent, pointScale) {
    console.log(typeof courseId);
    if (!checksIdValid(courseId)) {
        alert("It already exists with this course Id. Change it please.");
    } else if (!checksActsValid(courseActs)) {
        alert("You cannot enter a negative number of acts. Change it please.");
    } else if (!checksMPercentValid(courseMPercent)) {
        alert("You cannot enter midterm percent outside of 1-99. Change it please.");
    } else if (!checksPointScale(pointScale)) {
        alert("You can only enter 7 or 10 for the point scale. Change it please.");
    } else {
        // Creating a new Course instance
        const course = new Course(
            parseInt(courseId),
            courseName,
            instructorName,
            parseInt(courseActs),
            parseInt(courseMPercent),
            100 - parseInt(courseMPercent),
            parseInt(pointScale)
        );

        // Adding the new course to the coursesArray
        coursesArray.push(course);

        // Logging the coursesArray to the console
        console.log(coursesArray);

        // Updating local storage with the modified coursesArray
        localStorage.setItem('courses', JSON.stringify(coursesArray));
    }
}
