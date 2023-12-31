// Definition of the Course class
export class Course {
    // Constructor method that initializes an instance of the Course class
    constructor(courseId, courseName, instructorName, acts, midtermPercent, finalPercent, pointScale) {
        // Assigning values to properties of the Course instance
        this.courseId = courseId;
        this.courseName = courseName;
        this.instructorName = instructorName;
        this.acts = acts;
        this.midtermPercent = midtermPercent;
        this.finalPercent = finalPercent;
        this.pointScale = pointScale;
    }
}
