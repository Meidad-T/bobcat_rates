interface DeveloperChoice {
  name: string;
  courses: string[] | 'all';  // 'all' means recommended for all courses
}

export const developerChoices: DeveloperChoice[] = [
  {
    name: "Jill Seaman",
    courses: ["CS_1428", "CS_2308"]
  },
  {
    name: "Rick King",
    courses: ["CS_2318"]
  },
  {
    name: "Roberto Barrero",
    courses: "all"  // Recommended for all math courses
  },
  {
    name: "Ted Lehr",
    courses: ["CS_3354", "CS_3398"]
  }
];

/**
 * Checks if a professor is a developer's choice for a specific course
 * @param professorName The name of the professor to check
 * @param courseId The course ID in the format "PREFIX_NUMBER" (e.g., "CS_1428")
 * @returns boolean indicating if the professor is a developer's choice for this course
 */
export function isDeveloperChoice(professorName: string, courseId: string): boolean {
  const choice = developerChoices.find(c => c.name.toLowerCase() === professorName.toLowerCase());
  if (!choice) return false;

  // If the professor is recommended for all courses of their department
  if (choice.courses === 'all') {
    // For Roberto Barrero, check if it's a math course
    if (choice.name === "Roberto Barrero") {
      return courseId.startsWith("MATH_");
    }
    return true;
  }

  // Otherwise, check if the specific course is in their recommended list
  return choice.courses.includes(courseId);
} 