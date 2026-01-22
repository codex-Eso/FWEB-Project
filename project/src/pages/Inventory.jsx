import { overflow } from "../overflow"
import { useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack"
import { useNavigate } from "react-router-dom";
import NoBooks from "../components/NoBooks";
import Close from "../assets/Close.png"
import { addAdminLog } from "../adminLog";
/*
All books (recently viewed)
Borrowed
+ Overdue (with due date)
Requested (user can cancel request)
Collecting (with due date)
Cancelled
*/
const formatDueDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-SG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
const Inventory = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(true) }, []);
    const [actualUser, setUser] = useState({});
    const [state, setState] = useState("All");
    const [books, getBooks] = useState([]);
    const [allBooks, getAllBooks] = useState([]);
    const [availableCheck, setAvailableCheck] = useState(false);
    const [unavailableCheck, setUnavailableCheck] = useState(false);
    let displayBooks;
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
    }
    useEffect(() => {
        const userData = async () => {
            const getUser = await fetch(`http://localhost:5000/users/${localStorage.getItem("userId")}`)
            if (!getUser.ok) throw new Error("Failed to get users! Try again later!");
            let user = await getUser.json();
            setUser(user);
        }
        userData();
    }, [])
    useEffect(() => {
        const bookInventory = async () => {
            try {
                const res = await fetch(`http://localhost:5000/bookInventory?studentId=${localStorage.getItem("userId")}`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getBooks(data);
            } catch (e) {
                console.log(e);
            }
        }
        const libraryBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5000/libraryBooks`);
                if (!res.ok) throw new Error("Failed to get books! Try again later!");
                let data = await res.json();
                getAllBooks(data);
            } catch (e) {
                console.log(e);
            }
        }
        libraryBooks();
        bookInventory();
        document.querySelectorAll("h5").forEach(h5 => {
            h5.style.color = "black";
        })
        document.getElementById(state).style.color = "#E53935";
    }, [state, books])
    const cancelRequest = async (id, title) => {
        const res = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${id}`);
        if (!res.ok) throw new Error("Failed to get books! Try again later!");
        let userBook = await res.json();
        userBook.status = "Cancelled";
        try {
            await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userBook)
            });
            let userUpdate = { ...actualUser }
            userUpdate.requested = actualUser.requested - 1;
            await fetch(`http://localhost:5000/users/${actualUser._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userUpdate)
            });
            let jsonData = new Object();
            jsonData.studentId = localStorage.getItem("userId");
            jsonData.message = `Dear Student, the library book, ${title}, has been successfully cancelled!`
            jsonData.bookId = id;
            await fetch(`http://localhost:5000/notification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });
            alert("Request cancelled!");
            getBooks(userBook);
            let bookInfo = await fetch(`http://localhost:5000/libraryBooks/${id}`)
            bookInfo = await bookInfo.json();
            addAdminLog("cancelled", bookInfo.identifier, bookInfo.title, localStorage.getItem("userId"));
            let adminNoti = await fetch(`http://localhost:5000/adminLogs`);
            adminNoti = await adminNoti.json();
            //fix the bug where it deletes the wrong audit log, now it is fixed to delete the previously requested book by the user
            adminNoti = adminNoti.reverse().find(n => n.userId == localStorage.getItem("userId") && n.actionName == "requested" && n.bookISBN == bookInfo.identifier);
            await fetch(`http://localhost:5000/adminLogs/${adminNoti._id}`, {
                method: "DELETE"
            })
        } catch (e) {
            console.log(e);
        }
    }
    const renew = async (id, title) => {
        try {
            //due to complexity, I will not be adding the logic for letting 1 renew per book only            
            let userBook = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${id}`);
            userBook = await userBook.json();
            let getDate = new Date(userBook.dueDate);
            getDate.setDate(getDate.getDate() + 3);
            userBook.dueDate = getDate;
            await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userBook)
            })
            alert("Renewed successfully!");
            let jsonData = new Object();
            jsonData.studentId = localStorage.getItem("userId");
            jsonData.message = `Dear Student, the library book, ${title}, has been successfully renewed! Enjoy 3 more days with the book!`
            jsonData.bookId = id;
            await fetch(`http://localhost:5000/notification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });
        } catch (e) {
            console.log(e)
        }
    }
    const bookMap = Object.fromEntries(allBooks.map(b => [b.id, b]));
    displayBooks = books
        .map(({ bookId, status, dueDate }) => ({
            id: bookId,
            status,
            dueDate,
            details: bookMap[bookId]
        }))
        .filter(book => {
            if (!book.details) return false;
            if (state !== "All" && book.status !== state) return false;
            if (availableCheck && unavailableCheck) return true;
            if (availableCheck && !book.details.availability) return false;
            if (unavailableCheck && book.details.availability) return false;
            return true;
        })
        .map(book => {
            const { details } = book;
            return (
                <div
                    id="bookInfo"
                    onClick={() => navToBook(details.id)}
                    className="ViewedBox"
                    key={book.id}
                    style={{ position: "relative" }}
                >
                    <img src={details.bookImage} />
                    <div className="d-flex flex-column text-start fs-6 ps-3 stats">
                        {book.status === "Requested" && (
                            <img
                                id="request"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelRequest(details.id, details.title);
                                }}
                                src={Close}
                                width={40}
                                height={40}
                                style={{ objectFit: "contain" }}
                            />
                        )}
                        <span>{details.title}</span>
                        <span>By {details.author}</span>
                        {details.availability ? (
                            <span className="text-success">Available</span>
                        ) : (
                            <span className="text-danger">Unavailable</span>
                        )}
                        <span>Status: {book.status}</span>
                        {book.status === "Borrowed" && (
                            <>
                                <span>Return By: {formatDueDate(book.dueDate)}</span>
                                <button
                                    onClick={(e) => {
                                        renew(book.id, details.title);
                                        e.stopPropagation();
                                    }}
                                    className="mt-1"
                                >
                                    Renew
                                </button>
                            </>
                        )}
                        {book.status === "Collecting" && (
                            <span>Collect By: {formatDueDate(book.dueDate)}</span>
                        )}
                        {book.status === "Overdue" && (
                            <span className="text-danger">
                                Return By: {formatDueDate(book.dueDate)}
                            </span>
                        )}
                    </div>
                </div>
            );
        });
    return (
        <Stack className="Stacks" direction="horizontal">
            <div className="mb-auto">
                <h5 id="All" type="button" onClick={() => { setState("All"); }} className="mt-3 d-flex justify-content-start">All</h5>
                <h5 id="Borrowed" type="button" onClick={() => { setState("Borrowed"); }} className="mt-3 d-flex justify-content-start">Borrowed</h5>
                <h5 id="Requested" type="button" onClick={() => { setState("Requested"); }} className="mt-3 d-flex justify-content-start">Requested</h5>
                <h5 id="Collecting" type="button" onClick={() => { setState("Collecting"); }} className="mt-3 d-flex justify-content-start">Collecting</h5>
                <h5 id="Returned" type="button" onClick={() => { setState("Returned"); }} className="mt-3 d-flex justify-content-start">Returned</h5>
                <h5 id="Overdue" type="button" onClick={() => { setState("Overdue"); }} className="mt-3 d-flex justify-content-start">Overdue</h5>
                <h5 id="Cancelled" type="button" onClick={() => { setState("Cancelled"); }} className="mt-3 d-flex justify-content-start">Cancelled</h5>
                <h5 className="mt-3 d-flex justify-content-start">Filter By:</h5>
                <label className="d-flex align-items-center" for="available">
                    <input type="checkbox" id="available" name="available" onChange={(e) => setAvailableCheck(e.target.checked)} /> <span className=" ms-1 d-inline">Available</span>
                </label>
                <label className="d-flex align-items-center" for="unavailable">
                    <input type="checkbox" id="unavailable" name="unavailable" onChange={(e) => setUnavailableCheck(e.target.checked)} /> <span className=" ms-1 d-inline">Unavailable</span>
                </label>
            </div>
            <div className="bookInventory ms-5 my-3">
                {displayBooks}
                {(!displayBooks || displayBooks.length === 0) && (<div style={{ marginLeft: "25rem" }}><NoBooks /></div>)}
            </div>
        </Stack>
    )
}

export default Inventory