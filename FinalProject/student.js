// Importing the coursesArray from the coursesToArray module
import { coursesArray } from "./coursesToArray.js";

// Definition of the Student class
export class Student {
    // Constructor to initialize the Student object with provided properties
    constructor(studentId, name, surname, takenCourses, grades) {
        this.studentId = studentId;
        this.name = name;
        this.surname = surname;
        this.takenCourses = takenCourses;
        this.grades = grades;
    }

    // Method to calculate and return the GPA of the student
    getStudentGpa() {
        let totalPoint = 0;

        // Loop through taken courses and grades
        for (var i = 0; i < this.takenCourses.length; i++) {
            for (var j = 0; j < coursesArray.length; j++) {
                if (this.takenCourses[i] === coursesArray[j].courseId) {
                    if (coursesArray[j].pointScale === 7) {
                        totalPoint += this.getPointOfLetterGrade(
                            this.findLetterGradeFor7(
                                this.findAverageGrades(
                                    this.grades[i][0],
                                    this.grades[i][1],
                                    coursesArray[j].midtermPercent,
                                    coursesArray[j].finalPercent
                                )
                            )
                        ) * coursesArray[j].acts;
                    } else {
                        totalPoint += this.getPointOfLetterGrade(
                            this.findLetterGradeFor10(
                                this.findAverageGrades(
                                    this.grades[i][0],
                                    this.grades[i][1],
                                    coursesArray[j].midtermPercent,
                                    coursesArray[j].finalPercent
                                )
                            )
                        ) * coursesArray[j].acts;
                    }
                }
            }
        }

        // Calculate and return GPA with 2 decimal places
        return (totalPoint / this.getTotalActs()).toFixed(2);
    }

    // Method to calculate and return the total number of ACTs
    getTotalActs() {
        let totalActs = 0;

        // Loop through taken courses and accumulate ACTs
        for (var i = 0; i < this.takenCourses.length; i++) {
            for (var j = 0; j < coursesArray.length; j++) {
                if (this.takenCourses[i] === coursesArray[j].courseId) {
                    totalActs += coursesArray[j].acts;
                }
            }
        }

        return totalActs;
    }

    // Method to calculate and return the average of Midterm and Final grades
    findAverageGrades(MidtermGrade, FinalGrade, MidtermPercent, FinalPercent) {
        return (MidtermGrade * MidtermPercent / 100) + (FinalGrade * FinalPercent / 100);
    }

    // Method to get the point value of a letter grade
    getPointOfLetterGrade(letter) {
        switch (letter) {
            case "AA":
                return 4.0;
            case "BA":
                return 3.5;
            case "BB":
                return 3.0;
            case "CB":
                return 2.5;
            case "CC":
                return 2.0;
            case "DC":
                return 1.5;
            case "DD":
                return 1.0;
            case "FF":
                return 0.0;
        }
    }

    // Method to get the point scale of a course based on courseId
    getPointScale(courseId) {
        for (var i = 0; i < coursesArray.length; i++) {
            if (courseId === coursesArray[i].courseId) {
                return coursesArray[i].pointScale;
            }
        }
    }

    // Method to find the letter grade for a 7-point scale
    findLetterGradeFor7(grade) {
        if (grade <= 100 && grade >= 93) {
            return "AA";
        } else if (grade < 93 && grade >= 86) {
            return "BA";
        } else if (grade < 86 && grade >= 79) {
            return "BB";
        } else if (grade < 79 && grade >= 72) {
            return "CB";
        } else if (grade < 72 && grade >= 65) {
            return "CC";
        } else if (grade < 65 && grade >= 58) {
            return "DC";
        } else if (grade < 58 && grade >= 51) {
            return "DD";
        } else {
            return "FF";
        }
    }

    // Method to find the letter grade for a 10-point scale
    findLetterGradeFor10(grade) {
        if (grade <= 100 && grade >= 90) {
            return "AA";
        } else if (grade < 90 && grade >= 80) {
            return "BA";
        } else if (grade < 80 && grade >= 70) {
            return "BB";
        } else if (grade < 70 && grade >= 60) {
            return "CB";
        } else if (grade < 60 && grade >= 50) {
            return "CC";
        } else if (grade < 50 && grade >= 40) {
            return "DC";
        } else if (grade < 40 && grade >= 30) {
            return "DD";
        } else {
            return "FF";
        }
    }

    // Method to get an array of lecture names for the taken courses
    getLectureNames() {
        var lectureNames = [];

        // Loop through taken courses and add corresponding course names
        for (var i = 0; i < this.takenCourses.length; i++) {
            for (var j = 0; j < coursesArray.length; j++) {
                if (this.takenCourses[i] === coursesArray[j].courseId) {
                    lectureNames.push(coursesArray[j].courseName);
                }
            }
        }

        return lectureNames;
    }

    // Method to get an array of lecture grades for the taken courses
    getLectureGrades() {
        var lectureGrades = [];

        // Loop through grades and add individual midterm and final grades
        for (var i = 0; i < this.grades.length; i++) {
            lectureGrades.push(this.grades[i][0]);
            lectureGrades.push(this.grades[i][1]);
        }

        return lectureGrades;
    }
}
