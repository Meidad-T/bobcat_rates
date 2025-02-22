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
            // Update course numbers based on selected prefix
            const courseNumberInput = document.getElementById('courseNumber').value;
            if (courseNumberInput) {
                fetchCourseNumbers(prefix, courseNumberInput);
            }
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
    const prefix = document.getElementById('coursePrefix').value.trim().toUpperCase();

    if (input.length > 0 && prefix.length > 0) {
        // Fetch course numbers based on the selected prefix and number input
        fetchCourseNumbers(prefix, input);
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
            // Update course numbers based on selected prefix
            const courseNumberInput = document.getElementById('courseNumber').value;
            if (courseNumberInput) {
                fetchCourseNumbers(prefix, courseNumberInput);
            }
        };
        suggestionsDiv.appendChild(suggestionItem);
    });

    suggestionsDiv.style.display = 'block'; // Show all suggestions
}

// Function to close the dropdown if clicked outside
function closeDropdownOnClickOutside(event) {
    const suggestionsDiv = document.getElementById('prefixSuggestions');
    const coursePrefixInput = document.getElementById('coursePrefix');
    const numberSuggestionsDiv = document.getElementById('numberSuggestions');

    // Check if the click was outside the dropdown or the input fields
    if (!suggestionsDiv.contains(event.target) && event.target !== coursePrefixInput) {
        suggestionsDiv.style.display = 'none'; // Close prefix suggestions
    }
    if (!numberSuggestionsDiv.contains(event.target) && event.target !== document.getElementById('courseNumber')) {
        numberSuggestionsDiv.style.display = 'none'; // Close number suggestions
    }
}

// Attach event listeners to show all prefixes on focus
document.getElementById('coursePrefix').addEventListener('focus', showAllPrefixes);
document.getElementById('coursePrefix').addEventListener('input', handlePrefixInput);


// Attach event listener to course number input for handling number input
document.getElementById('courseNumber').addEventListener('input', handleNumberInput);

// Attach event listener to close dropdowns if clicked outside
document.addEventListener('click', closeDropdownOnClickOutside);
