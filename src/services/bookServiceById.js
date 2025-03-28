import axios from "axios";
const API_KEY = process.env.REACT_APP_API_KEY;
export const fetchBookById = async ({ id, filter = "paid-ebooks" }) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      {
        params: {
          key: API_KEY,
        },
      }
    );
    const bookData = response.data;

    // If fetching by ID, data is a single object
    return bookData;
  } catch (error) {
    console.log(error.response.status);
    if (error.response.status === 429) {
      console.error("Quota exceeded for Google Books API.");
      throw new Error(
        "API quota exceeded. Please try again later or contact support if the issue persists."
      );
    } else {
      throw new Error("Failed to fetch books: " + error.message);
    }
  }
};
