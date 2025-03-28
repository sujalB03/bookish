import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../firebase/firebase"; // Firestore instance
export const addToLibrary = async (userId, libraryBook) => {
  try {
    const userLibraryRef = doc(db, "libraries", userId);

    // Add the book to the user's library
    await updateDoc(userLibraryRef, {
      books: arrayUnion(libraryBook),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        // If the document doesn't exist, create it with the first book
        await setDoc(userLibraryRef, {
          books: [libraryBook],
        });
      }
    });

    console.log("Book added to library successfully.");
  } catch (error) {
    console.error("Error adding book to library: ", error);
  }
};

export const fetchLibrary = async (userId) => {
  try {
    const userLibraryRef = doc(db, "libraries", userId);
    const librarySnapshot = await getDoc(userLibraryRef);

    if (librarySnapshot.exists()) {
      return librarySnapshot.data().books || [];
    } else {
      console.log("No library found for this user.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching library: ", error);
    return [];
  }
};
