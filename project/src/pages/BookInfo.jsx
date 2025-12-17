import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Stack from "react-bootstrap/esm/Stack";
import Close from "../assets/Close.png";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";

const BookInfo = () => {
    const { id } = useParams();
    const [book, actualBook] = useState({});
    const [bookState, setBookState] = useState(null);
    const navigate = useNavigate();
    useEffect(() => { }, [id]);
    useEffect(() => {
        const getBookInfo = async () => {
            try {
                const res = await fetch(`http://localhost:5050/libraryData/${id}`);
                if (!res.ok) throw new Error("Failed to get book! Try again later!");
                let data = await res.json();
                actualBook(data);
            } catch (e) {
                if (e === "Failed to get book! Try again later!") alert(e);
            }
        }
        getBookInfo()
    })
    useEffect(() => {
        const getUserBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5050/bookInventory`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                data = data.filter(u => u.studentId === localStorage.getItem("userId"));
                const getBook = data[0].booksIds.indexOf(id);
                setBookState(data[0].status[getBook]);
            } catch (e) {
                if (e === "Failed to get books! Try again later!") alert(e);
            }
        }
        getUserBooks();
    })
    const action = (getAction) => {
        console.log(bookState)
        if (!book.availability) {
            alert("Cannot proceed! Book unavailable. Try again soon!");
            return;
        }
        if (book.location === "Closed Stacks" && getAction === "Borrow") {
            alert("Cannot proceed! Cannot borrow books from closed stacks!");
            return;
        }
        if (bookState === "Viewed" || bookState === "Cancelled" || bookState === "Returned") {
            if (getAction === "Borrow") {
                //prompt to enter ISBN
                const checkISBN = prompt("To confirm borrowing, please enter the book's ISBN:\n");
                if (checkISBN == book.identifier) {
                    alert("Borrowed successfully!");
                } else {
                    alert("Cannot proceed! Invalid ISBN!");
                }
            } else if (getAction === "Request") {
                alert("Requested successfully!");
            }
        } else {
            if (bookState === "Borrowed" || bookState === "Overdue") {
                alert("Cannot proceed! You still have the book in your possession!");
            } else if (bookState === "Requested") {
                alert("Cannot proceed! Book has already been requested!");
            } else if (bookState === "Collecting") {
                alert("Cannot proceed! The book is currently ready for your collection!");
            }
        }
    }
    return (
        <div className="fs-5 mt-3 bookInfo">
            <img id="exitBook" onClick={() => {
                navigate(-1);
            }} src={Close} width={30} height={30} />
            <Carousel slide={false}>
                <Carousel.Item>
                    <img className="displayImg" src={book.bookImage} />
                </Carousel.Item>
                {(book.location !== "Closed Stacks") ? <Carousel.Item>
                    <img className="displayImg" src={book.imgLocation} />
                </Carousel.Item> : null}
            </Carousel>
            <div className="d-flex flex-column ms-4 text-start info-text">
                <text>{book.title}</text>
                <text>By {book.author}</text>
                <text>{book.publisher}</text>
                <text>{book.location}</text>
                {book.availability ? <text>Available</text> : <text>Unavailable</text>}
                <text>Copies: {book.copies}</text>
                <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button onClick={() => { action("Borrow") }}>
                        Borrow
                    </button>
                    <button onClick={() => { action("Request") }}>
                        Request
                    </button>
                </Stack>
            </div>
        </div>
    )
}

export default BookInfo