// Import Firestore and ranking function
import { db } from './firebase_initialization.js';
import { rankProfessors } from './ranking_system.js';

function findProfessorsForCourse() {
    const coursePrefix = document.getElementById('coursePrefix').value.trim().toUpperCase();
    const courseNumber = document.getElementById('courseNumber').value.trim();
    const resultDiv = document.getElementById('result');
    

    if (!coursePrefix || !courseNumber) {
        resultDiv.textContent = "Please enter both course prefix and number.";
        return;
    }

    const courseId = `${coursePrefix}_${courseNumber}`;
    console.log("Searching for course:", courseId);

    const professorsRef = db.collection('Schools')
                            .doc('texas_state_university')
                            .collection('Professors');

    professorsRef.get()
        .then((querySnapshot) => {
            let professorsList = [];

            querySnapshot.forEach((doc) => {
                const professorData = doc.data();
                console.log(`Fetched Professor Data:`, professorData);  // 👀 DEBUG HERE

                const courses = professorData.courses || [];

                if (courses.includes(courseId)) {
                    // Initialize counts
                    let loved = 0, liked = 0, hated = 0;

                    // Check if professor has ratings and the course exists inside the nested maps
                    if (professorData.ratings && professorData.ratings[courseId]) {
                        const courseRatings = professorData.ratings[courseId];
                        loved = courseRatings.loved ?? 0;
                        liked = courseRatings.liked ?? 0;
                        hated = courseRatings.hated ?? 0;
                    }

                    console.log(`Processed Ratings -> ${professorData.name}: Loved(${loved}), Liked(${liked}), Hated(${hated})`); // 👀 DEBUG

                    professorsList.push({
                        name: professorData.name,
                        loved: loved,
                        liked: liked,
                        hated: hated
                    });
                }
            });

            if (professorsList.length === 0) {
                resultDiv.textContent = `No professors found for ${courseId.replace('_', ' ')}.`;
                return;
            }

            // Rank the professors
            const rankedProfessors = rankProfessors(professorsList);

            // Generate HTML for sorted professor cards
            let professorCards = rankedProfessors.map((prof, index) => `
                <div class="professor-card">
                    <div class="rank">${index + 1}</div>
                    <div class="professor-info">
                        <div class="professor-name">${prof.name}</div>
                        <div class="professor-ratings">
                            ❤️ Loved: ${prof.loved} | 👍 Liked: ${prof.liked} | 💔 Hated: ${prof.hated}
                        </div>
                    </div>
                </div>
            `).join('');

            resultDiv.innerHTML = `<div class="professor-card-container">${professorCards}</div>`;
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
            resultDiv.textContent = "An error occurred.";
        });
}


window.findProfessorsForCourse = findProfessorsForCourse;
