// Using the Fetch API to retrieve data from the 'courses.json' file
fetch('courses.json')
    .then(response => response.json()) // Parsing the response data as JSON
    .then(data => {
        // Storing the parsed courses data in a variable
        const courses = data;

        // Saving the courses data to the local storage as a JSON string
        localStorage.setItem('courses', JSON.stringify(courses));
    });
