import { db } from './firebase_initialization.js';

// Function to fetch course numbers based on the selected prefix and number input
export function fetchCourseNumbers(prefix, numberInput) {
    const numberSuggestionsDiv = document.getElementById('numberSuggestions');
    numberSuggestionsDiv.innerHTML = ''; // Clear previous suggestions

    // Reference to the Courses collection within the Texas State University document
    const coursesRef = db.collection('Schools')
                          .doc('texas_state_university')
                          .collection('Courses'); // Accessing the Courses collection

    coursesRef.get().then((querySnapshot) => {
        const courseNumbers = [];
        querySnapshot.forEach((doc) => {
            const courseId = doc.id; // Assuming the document ID is the course ID (e.g., CS_1428)
            if (courseId.startsWith(prefix)) {
                const courseNumber = courseId.split('_')[1]; // Extract the number part
                const courseData = doc.data(); // Get the document data
                const courseName = courseData.name; // Assuming the course name is stored in a field called 'name'
                if (courseNumber.startsWith(numberInput)) {
                    courseNumbers.push({ number: courseNumber, name: courseName });
                }
            }
        });

        // Create suggestions for course numbers
        if (courseNumbers.length > 0) {
            courseNumbers.forEach(course => {
                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = `${course.number} | ${course.name}`;
                suggestionItem.onclick = () => {
                    document.getElementById('courseNumber').value = course.number;
                    numberSuggestionsDiv.style.display = 'none';
                };
                numberSuggestionsDiv.appendChild(suggestionItem);
            });
            numberSuggestionsDiv.style.display = 'block'; // Show suggestions
        } else {
            // Show message if no courses are found
            const noCoursesMessage = document.createElement('div');
            noCoursesMessage.textContent = `No courses found for ${prefix} ${numberInput}.`;
            noCoursesMessage.style.color = 'red'; // Optional: style the message
            numberSuggestionsDiv.appendChild(noCoursesMessage);
            numberSuggestionsDiv.style.display = 'block'; // Show message
        }
    }).catch((error) => {
        console.error("Error fetching course numbers: ", error);
    });
}
