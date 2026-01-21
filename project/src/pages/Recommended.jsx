import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { overflow } from "../overflow"
import { Spinner, Stack } from "react-bootstrap";

const Recommended = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, getLoading] = useState(false);
    useEffect(() => { overflow(true) }, []);
    useEffect(() => {
        const booksDisplay = async () => {
            getLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/recommended/${localStorage.getItem("userId")}`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                setBooks(data.titles);
            } catch (e) {
                console.log(e);
            } finally {
                getLoading(false);
            }
        }
        booksDisplay();
    }, [])
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
    }
    const viewedBooks = books.map(book => {
        return (
            <div id="bookInfo" onClick={() => navToBook(book.id)} className="ViewedBox" key={book.id}>
                <img src={book.bookImage} />
                <div className="d-flex flex-column text-start fs-5 ps-3 viewBookText">
                    <text>{book.title}</text>
                    <text>By {book.author}</text>
                    <text>{book.publisher}</text>
                    {book.availability && <text className="text-success">Available</text>}
                    {!book.availability && <text className="text-danger">Unavailable</text>}
                </div>
            </div>
        );
    });
    return (
        <Stack className="mt-3" gap={3}>
            <h2>Recommended Books</h2>
            <h5>Showcases the top 3 recommended books by AI</h5>
            {loading && (
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <br />
                    <Spinner animation="border" role="status" />
                    <br />
                    <span>Getting Recommendations...</span>
                </div>
            )}
            <br />
            <Stack gap={5} direction="horizontal" style={{ margin: "0px 20px" }}>
                {viewedBooks}
            </Stack>
        </Stack>
    )
}

export default Recommended