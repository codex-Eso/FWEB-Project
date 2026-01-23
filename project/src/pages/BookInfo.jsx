import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import Stack from "react-bootstrap/esm/Stack";
import Close from "../assets/Close.png";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";
import { getRole } from "../checkLogin";
import { overflow } from "../overflow";
import { addAdminLog } from "../adminLog";

const BookInfo = () => {
    const { id } = useParams();
    const [book, actualBook] = useState({});
    const [actualUser, setUser] = useState({});
    const [bookState, setBookState] = useState(null);
    const [borrowedCount, setBorrowedCount] = useState(0);
    const [requestedCount, setRequestedCount] = useState(0);
    const navigate = useNavigate();
    const hasFetched = useRef(false);
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        overflow(false);
        const userData = async () => {
            const getUser = await fetch(`http://localhost:5000/users/${localStorage.getItem("userId")}`)
            if (!getUser.ok) throw new Error("Failed to get users! Try again later!");
            let user = await getUser.json();
            setUser(user);
            return user;
        }
        userData();
        const getBookInfo = async () => {
            try {
                const res = await fetch(`http://localhost:5000/libraryBooks/${id}`);
                if (!res.ok) throw new Error("Failed to get book! Try again later!");
                let data = await res.json();
                actualBook(data);
                return data;
            } catch (e) {
                navigate("error");
            }
        }
        getBookInfo()
        const getUserBooks = async () => {
            try {
                if (getRole() === "admin") {
                    let adminBooks = new Object();
                    adminBooks.bookId = id
                    let checkBook = await fetch(`http://localhost:5000/adminBooks/${id}`);
                    checkBook = await checkBook.json();
                    if (checkBook.message == "Book Exists!") {
                        await fetch(`http://localhost:5000/adminBooks/${id}`, {
                            method: "PATCH"
                        });
                    } else {
                        await fetch(`http://localhost:5000/adminBooks`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(adminBooks)
                        });
                    }
                } else if (getRole() === "student") {
                    //get the latest position of the book
                    const pos = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}`)
                    let getPos = await pos.json();
                    if (getPos == null) {
                        getPos = 0;
                    }
                    const res = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${id}`);
                    if (!res.ok) throw new Error("Failed to get books! Try again later!");
                    let data = await res.json();
                    let getUser = await userData();
                    let userUpdate = { ...getUser };
                    if (data !== null) {
                        data.position = parseInt(getPos) + 1;
                        await fetch(`http://localhost:5000/bookInventory/${data._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(data)
                        });
                        setBookState(data.status);
                    } else {
                        setBookState('Viewed');
                        let userBook = new Object();
                        userBook.studentId = localStorage.getItem("userId");
                        userBook.bookId = id;
                        userBook.status = 'Viewed';
                        userBook.dueDate = "";
                        userBook.position = parseInt(getPos) + 1;
                        await fetch(`http://localhost:5000/bookInventory`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userBook)
                        });
                        const bookData = await getBookInfo();
                        if (bookData.fiction == true) {
                            userUpdate.fictionCount = getUser.fictionCount + 1;
                        } else {
                            userUpdate.nonFictionCount = getUser.nonFictionCount + 1;
                        }
                        await fetch(`http://localhost:5000/users/${userUpdate._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userUpdate)
                        });
                    }
                    setBorrowedCount(userUpdate.borrowed);
                    setRequestedCount(userUpdate.requested);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getUserBooks();
    }, [])
    const action = (getAction) => {
        if (getRole() === "student") {
            if (book.location === "Closed Stacks" && getAction === "Borrow") {
                alert("Cannot proceed! Cannot borrow books from closed stacks!");
                return;
            }
            if (bookState === "Viewed" || bookState === "Cancelled" || bookState === "Returned") {
                if (getAction === "Borrow") {
                    if (!book.availability) {
                        alert("Cannot proceed! Book unavailable. Try again soon!");
                        return;
                    }
                    if (borrowedCount === 30) {
                        alert("Cannot proceed! You have exceeded your borrowing limits!");
                        return;
                    }
                    //prompt to enter ISBN
                    const checkISBN = prompt("To confirm borrowing, please enter the book's ISBN:\n");
                    if (checkISBN == book.identifier) {
                        const bookBorrowed = async () => {
                            const tdyDate = new Date();
                            let dueDate = new Date(tdyDate);
                            dueDate.setDate(tdyDate.getDate() + 28);
                            dueDate = dueDate.toISOString();
                            const res = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${id}`);
                            if (!res.ok) throw new Error("Failed to get books! Try again later!");
                            let userBook = await res.json();
                            userBook.status = "Borrowed";
                            userBook.dueDate = dueDate;
                            await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(userBook)
                            });
                            let userUpdate = { ...actualUser }
                            userUpdate.borrowed = actualUser.borrowed + 1;
                            await fetch(`http://localhost:5000/users/${userUpdate._id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(userUpdate)
                            });
                            const updatedBook = { ...book };
                            const formData = new FormData();
                            updatedBook.copies -= 1;
                            formData.append('copies', updatedBook.copies)
                            if (updatedBook.copies === 0) {
                                updatedBook.availability = false;
                                formData.append('availability', updatedBook.availability);
                            }
                            await fetch(`http://localhost:5000/libraryBooks/${book._id}`, {
                                method: "PATCH",
                                body: formData
                            });
                            actualBook(updatedBook);
                            let jsonData = new Object();
                            jsonData.studentId = localStorage.getItem("userId");
                            jsonData.message = `Dear Student, the library book, ${book.title}, has been successfully borrowed! Make sure to return the book back to the library after 4 weeks!`
                            jsonData.bookId = id;
                            await fetch(`http://localhost:5000/notification`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(jsonData)
                            });
                            setBookState("Borrowed");
                        }
                        bookBorrowed();
                        alert("Borrowed successfully!");
                    } else {
                        alert("Cannot proceed! Invalid ISBN!");
                    }
                } else if (getAction === "Request") {
                    if (requestedCount === 10) {
                        alert("Cannot proceed! You have exceeded your requesting limits!");
                        return;
                    }
                    const bookRequested = async () => {
                        const res = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${id}`);
                        if (!res.ok) throw new Error("Failed to get books! Try again later!");
                        let userBook = await res.json();
                        userBook.status = "Requested";
                        await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userBook)
                        });
                        let userUpdate = { ...actualUser }
                        userUpdate.requested = actualUser.requested + 1;
                        await fetch(`http://localhost:5000/users/${userUpdate._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(userUpdate)
                        });
                        let jsonData = new Object();
                        jsonData.studentId = localStorage.getItem("userId");
                        jsonData.message = `Dear Student, the library book, ${book.title}, has been successfully requested! Waiting might take a longer than a week if all available copies are taken.`
                        jsonData.bookId = id;
                        await fetch(`http://localhost:5000/notification`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(jsonData)
                        });
                        setBookState("Requested");
                        addAdminLog("requested", book.identifier, book.title, localStorage.getItem('userId'));
                    }
                    bookRequested();
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
        } else if (getRole() === "admin") {
            if (getAction === "Edit") {
                navigate(`/admin/editBook/${id}`)
            } else if (getAction === "Delete") {
                let confirmDeletion = prompt(`Confirm Deletion?\nEnter "Yes" to continue:`)
                if (confirmDeletion.toLowerCase() === "yes") {
                    const deletion = async () => {
                        try {
                            let bookISBN = book.identifier
                            let bookName = book.title
                            await fetch(`http://localhost:5000/libraryBooks/${book._id}`, {
                                method: "DELETE"
                            })
                            alert("Book deleted!")
                            navigate(-1);
                            addAdminLog("delete", bookISBN, bookName);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    deletion();
                } else {
                    alert("Deletion cancelled!")
                }
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
                {getRole() === "student" ? <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button onClick={() => { action("Borrow") }}>
                        Borrow
                    </button>
                    <button onClick={() => { action("Request") }}>
                        Request
                    </button>
                </Stack> : <Stack gap={3} direction="horizontal" className="mt-1 actionBtns">
                    <button onClick={() => { action("Edit") }}>
                        Edit
                    </button>
                    <button onClick={() => { action("Delete") }}>
                        Delete
                    </button>
                </Stack>}
            </div>
        </div>
    )
}

export default BookInfo