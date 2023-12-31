// Fetching data from the 'students.json' file
fetch('students.json')
    .then(response => response.json()) // Parsing the JSON data from the response
    .then(data => {
        const students = data; // Storing the parsed data in a variable
        localStorage.setItem('students', JSON.stringify(students)); // Saving the data to the local storage
    })
    .catch(error => {
        console.error('Error fetching or parsing data:', error); // Handling any errors that occur during the fetch or parsing process
    });
