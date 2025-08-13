import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";

const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchBooks = async ({
  id = "",
  category = "",
  title = "",
  author = "",
  isbn = "",
  orderBy = "relevance",
  startIndex = 0,
  maxResults = 10,
  inlanguage = "en",
  applyFilter = true,
}) => {
  const queryParts = [];

  if (title.trim()) queryParts.push(`intitle:${title}`);
  if (category.trim()) queryParts.push(`subject:${category}`);
  if (author.trim()) queryParts.push(`inauthor:${author}`);
  if (isbn.trim()) queryParts.push(`isbn:${isbn}`);

  // Ensure we don't send an empty query
  const query = queryParts.length > 0 ? queryParts.join("+") : "harry potter"; // Default search term

  // console.log("Final API Query:", query);
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes`,
      {
        params: {
          q: query,
          inlanguage,
          startIndex,
          orderBy,
          maxResults,
          key: API_KEY,
        },
      }
    );
    const data = response.data;

    const fetchedBooks = data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "",
      availabilty: book.saleInfo.saleability.toLowerCase(),
      currency:
        book.saleInfo.listPrice?.amount !== 0
          ? book.saleInfo.listPrice?.currencyCode
            ? getSymbolFromCurrency(book.saleInfo.listPrice.currencyCode)
            : " "
          : "", // Get currency symbol if available
      price:
        book.saleInfo.listPrice?.amount !== undefined
          ? book.saleInfo.listPrice?.amount !== 0
            ? `${book.saleInfo.listPrice.amount}`
            : "Free eBook"
          : "See details for purchase options",
      image: book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : "https://placehold.co/170x220?text=Image%20Not%20Available", // Placeholder image if no cover available
      preview: book.volumeInfo.previewLink,
    }));
    // console.log(fetchedBooks);
    return { totalItems: response.data.totalItems, fetchedBooks };
  } catch (error) {
    throw new Error("Failed to fetch books: " + error.message);
  }
};
