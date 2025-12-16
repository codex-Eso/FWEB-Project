import searchIcon from "../assets/Search.png"
import Stack from "react-bootstrap/Stack"
import { useEffect, useState } from "react";
const StudentHome = () => {
    const [books, setBooks] = useState({})
    const [allBooks, getBooks] = useState([])
    const [noOfBooks, getNumBooks] = useState(0)
    useEffect(() => {
        const getViewedBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/bookInventory`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                data = data.filter(u => u.studentId === "U2");
                setBooks(data[0]);
            } catch (e) {
                if (e === "Failed to get books! Try again later!") alert(e);
            }
        }
        const getAllBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/libraryData`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getBooks(data);
            } catch (e) {
                if (e === "Failed to get books! Try again later!") alert(e);
            }
        }
        getViewedBooks();
        getAllBooks();
    }, []);
    useEffect(() => {
        if (!books.booksIds) return;
        const bookCount = books.status.filter(book => book === "Viewed").length;
        getNumBooks(bookCount);
    })
    const viewedBooks = books.booksIds?.map((id, i) => {
        if (books.status[i] !== "Viewed") return null;
        const matchedBooks = allBooks.find(book => book.id === id);
        if (!matchedBooks) return null;
        return (
            <div className="ViewedBox" key={id}>
                <img src={matchedBooks.bookImage} />
            </div>
        );
    });
    return (
        <Stack className="Stacks">
            <div>
                <label htmlFor="searchBook">
                    <div id="searchBar">
                        <img src={searchIcon} width="30" height="30" />
                        <input placeholder="Search for library books..." id="searchBook"></input>
                    </div>
                </label>
            </div>
            <br />
            <div className="d-flex justify-content-start">
                <h3>Your Collection:</h3>
            </div>
            <br />
            <div className="d-flex align-items-center mb-2">
                <h4>Recently Viewed:</h4>
                {noOfBooks > 3 && <h4 className="text-decoration-underline ms-auto">View All</h4>}
            </div>
            <Stack className="viewBooks" direction="horizontal">
                {!viewedBooks && <div className="d-flex justify-content-center align-items-center w-100 mt-3 gap-3" direction="horizontal"><div className="spinner-grow"></div><div className="spinner-grow"></div><div className="spinner-grow"></div></div>}
                {viewedBooks}
            </Stack>
        </Stack>
    )
}

export default StudentHome