// find_professors.js

// Import Firestore instance from firebase_initialization.js
import { db } from './firebase_initialization.js';

// Function to search for professors based on the course
function findProfessorsForCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const resultDiv = document.getElementById('result');

    if (!courseName) {
        resultDiv.textContent = "Please enter a course name.";
        return;
    }

    // Normalize course name: uppercase and add underscore if necessary
    const normalizedCourseName = courseName.replace(/\s+/g, '').toUpperCase();
    const courseId = normalizedCourseName.replace(/(\D)(\d)/g, '$1_$2'); // Adds underscore between letters and numbers
    console.log("Searching for course:", courseId); // Debugging log

    // Reference to the Professors collection in Firestore
    const professorsRef = db.collection('Schools')
                            .doc('texas_state_university') // Document (Texas State University)
                            .collection('Professors'); // Professors collection

    // Query all professors and filter by courses containing the searched course
    professorsRef.get()
        .then((querySnapshot) => {
            const professorsFound = [];
            querySnapshot.forEach((doc) => {
                const professorData = doc.data();
                const courses = professorData.courses || [];

                // Convert each course to lowercase and check if the courseId matches
                const normalizedCourses = courses.map(course => course.toLowerCase());

                // Check if the course is in the professor's courses array
                if (normalizedCourses.includes(courseId.toLowerCase())) {
                    professorsFound.push(professorData.name);
                }
            });

            // Display the result
            if (professorsFound.length > 0) {
                resultDiv.innerHTML = `<strong>Professors teaching ${courseName}:</strong><br>${professorsFound.join('<br>')}`;
            } else {
                resultDiv.textContent = `No professors found for the course: ${courseName}.`;
            }
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
            resultDiv.textContent = "An error occurred.";
        });
}

// Attach the function to the global window object
window.findProfessorsForCourse = findProfessorsForCourse;
