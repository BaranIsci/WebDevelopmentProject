// Importing the hideOtherElements function from the listAllCourses module
import { hideOtherElements } from "./listAllCourses.js";

// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selectors for the home image button and the home section content
    const homeImageButton = document.querySelector('#homeImage');
    const homeSectionContent = document.querySelector("#HomeContentOfPage");

    // Hide other elements in the home section content on page load
    hideOtherElements(homeSectionContent);

    // Event listener for the home image button click
    homeImageButton.addEventListener('click', () => {
        // Hide other elements in the home section content when the button is clicked
        hideOtherElements(homeSectionContent);
    });
});
