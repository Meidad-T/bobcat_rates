// This file handles the dynamic course suggestions dropdown

function showSuggestions() {
    const courseName = document.getElementById('courseName').value.trim();
    const suggestionsDiv = document.getElementById('suggestions');

    if (!courseName) {
        suggestionsDiv.style.display = 'none'; // Hide if no input
        return;
    }

    // Normalize input
    const normalizedCourseName = courseName.replace(/\s+/g, '').toUpperCase();

    // Query courses that match the text entered so far
    const coursesRef = db.collection('Schools')
                        .doc('texas_state_university') // Document (Texas State University)
                        .collection('Courses'); // Assuming there's a 'Courses' collection

    coursesRef.where('courseName', '>=', normalizedCourseName)
              .where('courseName', '<=', normalizedCourseName + '\uf8ff') // To match all courses starting with the input
              .get()
              .then((querySnapshot) => {
                  const suggestions = [];
                  querySnapshot.forEach((doc) => {
                      const courseData = doc.data();
                      const courseId = courseData.courseId;
                      const fullName = courseData.fullName; // Assuming you have a 'fullName' field for each course

                      // Display the course ID (without _) and the full course name
                      suggestions.push({
                          courseId: courseId.replace('_', ''),
                          fullName: fullName
                      });
                  });

                  // Display suggestions
                  if (suggestions.length > 0) {
                      suggestionsDiv.style.display = 'block';
                      suggestionsDiv.innerHTML = suggestions.map((suggestion) =>
                          `<div class="suggestion-item" onclick="selectCourse('${suggestion.courseId}')">
                            ${suggestion.courseId} - ${suggestion.fullName}
                          </div>`
                      ).join('');
                  } else {
                      suggestionsDiv.style.display = 'none';
                  }
              })
              .catch((error) => {
                  console.error("Error fetching suggestions: ", error);
              });
}

function selectCourse(courseId) {
    document.getElementById('courseName').value = courseId; // Set the input value to the selected course
    showSuggestions(); // Hide the suggestions
    findProfessorsForCourse(); // Search for professors teaching the selected course
}
