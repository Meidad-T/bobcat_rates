// Import Firestore instance from firebase_initialization.js
import { db } from './firebase_initialization.js';

// Function to search for professors based on the course
function findProfessorsForCourse() {
    const coursePrefix = document.getElementById('coursePrefix').value.trim().toUpperCase();
    const courseNumber = document.getElementById('courseNumber').value.trim();
    const resultDiv = document.getElementById('result');

    if (!coursePrefix || !courseNumber) {
        resultDiv.textContent = "Please enter both course prefix and number.";
        return;
    }

    // Combine prefix and number to form course ID
    const courseId = `${coursePrefix}_${courseNumber}`; // e.g., CS_1428
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

                // Check if the course is in the professor's courses array
                if (courses.includes(courseId)) {
                    professorsFound.push(professorData.name);
                }
            });

            // Display the result
            if (professorsFound.length > 0) {
                resultDiv.innerHTML = `<strong>Professors teaching ${courseId.replace('_', ' ')}:</strong><br>${professorsFound.join('<br>')}`;
            } else {
                resultDiv.textContent = `No professors found for the course: ${courseId.replace('_', ' ')}.`;
            }
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
            resultDiv.textContent = "An error occurred.";
        });
}

// Attach the function to the global window object
window.findProfessorsForCourse = findProfessorsForCourse;