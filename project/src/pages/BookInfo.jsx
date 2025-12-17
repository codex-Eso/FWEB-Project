import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Stack from "react-bootstrap/esm/Stack";
import Close from "../assets/Close.png";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";

const BookInfo = () => {
    const { id } = useParams();
    const [book, actualBook] = useState({});
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
    return (
        <div className="fs-5 mt-3 bookInfo">
            <img id="exitBook" onClick={() => {
                navigate(-1);
            }} src={Close} width={30} height={30} />
            <Carousel slide={false}>
                <Carousel.Item>
                    <img className="displayImg" src={book.bookImage} />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="displayImg" src={book.imgLocation} />
                </Carousel.Item>
            </Carousel>
            <div className="d-flex flex-column ms-4 text-start info-text">
                <text>{book.title}</text>
                <text>By {book.author}</text>
                <text>{book.publisher}</text>
                <text>ISBN: {book.identifier}</text>
                <text>{book.location}</text>
                {book.availability ? <text>Available</text> : <text>Unavailable</text>}
                <text>Copies: {book.copies}</text>
                <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button>
                        Borrow
                    </button>
                    <button>
                        Request
                    </button>
                </Stack>
            </div>
        </div>
    )
}

export default BookInfo