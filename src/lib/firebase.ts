import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfqU86jc3ycXWjLQHf8V1PDZKbvz7TO80",
  authDomain: "bestprofessors-b58bf.firebaseapp.com",
  databaseURL: "https://bestprofessors-b58bf-default-rtdb.firebaseio.com",
  projectId: "bestprofessors-b58bf",
  storageBucket: "bestprofessors-b58bf.firebasestorage.app",
  messagingSenderId: "333924218376",
  appId: "1:333924218376:web:b91a2b270352a9a37d43bd",
  measurementId: "G-DPBYPGK7GV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Professor {
  name: string;
  courses: string[];
  ratings: {
    [courseId: string]: {
      loved: number;
      liked: number;
      hated: number;
    };
  };
}

export async function getProfessorsForCourse(prefix: string, number: string): Promise<Professor[]> {
  try {
    // Format the course ID (uppercase prefix + underscore + number)
    const courseId = `${prefix.toUpperCase()}_${number}`;
    console.log('Searching for course:', courseId);

    // Get all professors from the Professors collection
    const schoolRef = doc(db, 'Schools', 'texas_state_university');
    const professorsCollectionRef = collection(schoolRef, 'Professors');
    const professorsSnapshot = await getDocs(professorsCollectionRef);
    
    const professors: Professor[] = [];

    // Filter professors who teach this course and get their ratings
    for (const profDoc of professorsSnapshot.docs) {
      const profData = profDoc.data();
      
      // Get the courses array (handle both 'courses' and 'Courses' fields)
      const coursesArray = profData.courses || profData.Courses || [];
      
      // Case-insensitive search for the course
      if (coursesArray.some((course: string) => course.toUpperCase() === courseId.toUpperCase())) {
        professors.push({
          name: profDoc.id,
          courses: coursesArray,
          ratings: profData.ratings || {}
        });
      }
    }

    console.log(`Found ${professors.length} professors teaching ${courseId}`);

    // Sort professors by 'loved' count for this specific course
    return professors.sort((a, b) => {
      const aLoved = a.ratings[courseId]?.loved || 0;
      const bLoved = b.ratings[courseId]?.loved || 0;
      return bLoved - aLoved;
    });
  } catch (error) {
    console.error('Error fetching professors:', error);
    return [];
  }
}

export { db }; 