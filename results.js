// results.js

// Function to get URL parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        coursePrefix: params.get('coursePrefix'),
        courseNumber: params.get('courseNumber')
    };
}

// Function to display results
function displayResults() {
    const { coursePrefix, courseNumber } = getQueryParams();
    const resultsDiv = document.getElementById('results');

    // Here you would typically fetch results based on the coursePrefix and courseNumber
    // For demonstration, we'll just display the parameters
    resultsDiv.innerHTML = `<p>Course Prefix: ${coursePrefix}</p>
                            <p>Course Number: ${courseNumber}</p>`;
}

// Function to go back to the previous page
function goBack() {
    window.history.back();
}

// Call displayResults on page load
window.onload = displayResults;