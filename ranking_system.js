// ranking_system.js

export function rankProfessors(professors) {
    // Create a new array with score calculation
    let rankedProfessors = professors.map(prof => ({
        ...prof, // Keep original loved, liked, hated
        score: (3 * prof.loved) + (2 * prof.liked) - (1 * prof.hated) // Compute score
    }));

    // Sort in descending order (best to worst)
    rankedProfessors.sort((a, b) => b.score - a.score);

    return rankedProfessors;
}
