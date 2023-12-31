// Importing functions from other modules
import { hideOtherElements } from "./listAllCourses.js";
import { addCourse } from "./coursesToArray.js";

// Event listener for the DOMContentLoaded event to ensure the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Selecting relevant HTML elements
    const addCourseSideBarButton = document.querySelector('#addCourse');
    const addCourseContainer = document.querySelector('#addCourseSection');
    const addCourseButton = document.querySelector('#addCourseButton');

    // Adding a click event listener to the "Add Course" button in the sidebar
    addCourseSideBarButton.addEventListener('click', () => {
        // Hiding other elements and showing the "Add Course" section
        hideOtherElements(addCourseContainer);
    });

    // Adding a click event listener to the "Add Course" button inside the "Add Course" section
    addCourseButton.addEventListener("click", () => {
        // Retrieving values from input fields
        const courseId = document.querySelector('#courseId').value;
        const courseName = document.querySelector('#courseName').value;
        const instructorName = document.querySelector('#instructorName').value;
        const courseActs = document.querySelector('#courseActs').value;
        const courseMPercent = document.querySelector('#courseMPercent').value;
        const pointScale = document.querySelector('#pointScale').value;
        // Calling the addCourse function with the retrieved values
        addCourse(courseId, courseName, instructorName, courseActs, courseMPercent, pointScale);
    });
});
