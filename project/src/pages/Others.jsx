const Others = () => {
    //to trigger scenarios, manually triggering overdue books also due to time constraint
    //get the book based on the id entered
    //note: case sensitive
    const overdue = async () => {
        const bookId = prompt("Enter the book id to be overdued:\n");
        let userBook = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${bookId}`);
        if (!userBook.ok) return alert("Failed to get book! Try again later!");
        userBook = await userBook.json();
        if (userBook.status === "Borrowed") {
            userBook.status = "Overdue";
            try {
                await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userBook)
                })
                alert("Overdue scenario triggered!");
                let getBook = await fetch(`http://localhost:5000/libraryBooks/${bookId}`);
                getBook = await getBook.json();
                let notification = new Object();
                notification.studentId = localStorage.getItem("userId");
                notification.message = `Dear Student, the library book, ${getBook.title}, is now officially overdued. Please return the book immediately back to the library to prevent more heavier overdue fees.`
                notification.messageTime = (new Date()).toISOString();
                notification.bookId = bookId;
                await fetch(`http://localhost:5000/notification`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(notification)
                })
                let adminNoti = new Object();
                adminNoti.auditTime = (new Date()).toISOString();
                adminNoti.bookISBN = getBook.identifier
                adminNoti.bookName = getBook.title
                adminNoti.actionName = "overdue"
                adminNoti.readLog = false
                let user = await fetch(`http://localhost:5000/users/${localStorage.getItem("userId")}`);
                user = await user.json();
                adminNoti.adminNo = user.username;
                await fetch(`http://localhost:5000/adminLogs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(adminNoti)
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            alert("Cannot proceed! Book is not currently in borrowed state!");
            return;
        }
    }
    const returned = async () => {
        const bookId = prompt("Enter the book id to be returned:\n");
        let userBook = await fetch(`http://localhost:5000/bookInventory/${localStorage.getItem("userId")}/${bookId}`);
        if (!userBook.ok) return alert("Failed to get book! Try again later!");
        userBook = await userBook.json();
        if (userBook.status === "Borrowed" || userBook.status === "Overdue") {
            userBook.status = "Returned";
            userBook.dueDate = "";
            try {
                await fetch(`http://localhost:5000/bookInventory/${userBook._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userBook)
                })
                const getUser = await fetch(`http://localhost:5000/users/${localStorage.getItem("userId")}`)
                if (!getUser.ok) throw new Error("Failed to get users! Try again later!");
                let user = await getUser.json();
                user.borrowed = user.borrowed - 1;
                await fetch(`http://localhost:5000/users/${localStorage.getItem("userId")}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });
                alert("Returned scenario triggered!");
                let getBook = await fetch(`http://localhost:5000/libraryBooks/${bookId}`);
                getBook = await getBook.json();
                let formData = new FormData();
                if (!getBook.availability) {
                    getBook.availability = true;
                    formData.append('availability', getBook.availability);
                }
                getBook.copies += 1;
                formData.append('copies', getBook.copies)
                await fetch(`http://localhost:5000/libraryBooks/${bookId}`, {
                    method: "PATCH",
                    body: formData
                });
                let notification = new Object();
                notification.studentId = localStorage.getItem("userId");
                notification.message = `Dear Student, the library book, ${getBook.title}, has now been returned!`
                notification.messageTime = (new Date()).toISOString();
                notification.bookId = bookId;
                await fetch(`http://localhost:5000/notification`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(notification)
                })
                let adminNoti = new Object();
                adminNoti.auditTime = (new Date()).toISOString();
                adminNoti.bookISBN = getBook.identifier
                adminNoti.bookName = getBook.title
                adminNoti.actionName = "returned"
                adminNoti.readLog = false
                await fetch(`http://localhost:5000/adminLogs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(adminNoti)
                })

            } catch (e) {
                console.log(e)
            }
        } else {
            alert("Cannot proceed! You currently do not have this book in your possession!");
            return;
        }
    }
    return (
        <div className="otherContainer">
            <button onClick={() => overdue()}>Overdue Book</button>
            <span className="mt-2 mb-2"></span>
            <button onClick={() => returned()}>Return Book</button>
        </div>
    )
}

export default Others
