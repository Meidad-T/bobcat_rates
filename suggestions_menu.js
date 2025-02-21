import { fetchCourseNumbers } from './course_number_suggestions.js';

// Array of available course prefixes
const coursePrefixes = ['CS', 'MATH', 'ENG', 'BIO', 'PHYS'];

// Function to handle input and show suggestions for course prefixes
function handlePrefixInput(event) {
    const input = event.target.value.trim().toUpperCase();
    const suggestionsDiv = document.getElementById('prefixSuggestions');

    // Clear previous suggestions
    suggestionsDiv.innerHTML = '';

    // Filter prefixes based on input
    const filteredPrefixes = coursePrefixes.filter(prefix => prefix.startsWith(input));

    // Create suggestion items
    filteredPrefixes.forEach(prefix => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = prefix;
        suggestionItem.onclick = () => {
            document.getElementById('coursePrefix').value = prefix;
            suggestionsDiv.style.display = 'none';
            fetchCourseNumbers(prefix); // Fetch course numbers for the selected prefix
        };
        suggestionsDiv.appendChild(suggestionItem);
    });

    // Show or hide suggestions based on whether we found any
    suggestionsDiv.style.display = filteredPrefixes.length > 0 ? 'block' : 'none';
}

// Function to handle input for course numbers
function handleNumberInput(event) {
    const input = event.target.value.trim();
    const suggestionsDiv = document.getElementById('numberSuggestions');

    if (input.length > 0) {
        const filteredNumbers = Array.from(suggestionsDiv.children).filter(item => 
            item.textContent.startsWith(input)
        );

        // Clear previous suggestions
        suggestionsDiv.innerHTML = '';

        filteredNumbers.forEach(item => {
            item.style.display = 'block'; // Show matching numbers
            suggestionsDiv.appendChild(item); // Re-add matching items
        });

        // Show suggestions if there are any
        suggestionsDiv.style.display = filteredNumbers.length > 0 ? 'block' : 'none';
    } else {
        suggestionsDiv.style.display = 'none'; // Hide suggestions if input is empty
    }
}

// Function to show all prefixes when the input is focused
function showAllPrefixes() {
    const suggestionsDiv = document.getElementById('prefixSuggestions');
    suggestionsDiv.innerHTML = ''; // Clear previous suggestions

    coursePrefixes.forEach(prefix => {
        const suggestionItem = document.createElement('div');
        suggestionItem.textContent = prefix;
        suggestionItem.onclick = () => {
            document.getElementById('coursePrefix').value = prefix;
            suggestionsDiv.style.display = 'none';
            fetchCourseNumbers(prefix); // Fetch course numbers for the selected prefix
        };
        suggestionsDiv.appendChild(suggestionItem);
    });

    suggestionsDiv.style.display = 'block'; // Show all suggestions
}

// Attach event listeners to show all prefixes on focus
document.getElementById('coursePrefix').addEventListener('focus', showAllPrefixes);