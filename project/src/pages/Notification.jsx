import { useEffect, useState } from "react"
import { overflow } from "../overflow"
import { useNavigate } from "react-router-dom";

/*
HEAVY NOTE: ORIGINALLY I WANTED TO ADDED NOTIFICATIONS FOR OVERDUE/BOOK DUE SOON
BUT I WILL NOT BE ADDING THOSE FUNCTIONALITIES, HENCE NO NOTIFICATIONS FOR THOSE
DUE TO TIME CONSTRAINT (OVERDUE/RETURNED IS NOW MAINLY FOR SHOWCASING ONLY WITH NOT MUCH FUNCTIONALITY)
*/

const Notification = () => {
    const navigate = useNavigate();
    const [notification, getNotification] = useState([]);
    const formatDueDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString("en-SG", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    useEffect(() => {
        overflow(true)
        const notifications = async () => {
            try {
                const res = await fetch(`http://localhost:5000/notification/${localStorage.getItem("userId")}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to get notifications! Try again later!");
                }
                let data = await res.json();
                getNotification(data);
            } catch (e) {
                console.error(e);
            }
        };
        notifications();
    }, []);
    const navToBook = (id) => {
        navigate(`/student/book/${id}`);
    };
    const notifcationDisplay = notification.slice().reverse().map((n) => {
        return (
            <>
                <div
                    onClick={() => { navToBook(n.bookId); }}
                    className="notifications"
                    type="button"
                    key={n.id}
                >
                    <h5>{formatDueDate(n.createdAt)}</h5>
                    <span>{n.message}</span>
                </div>
                <div className="mb-3"></div>
            </>
        );
    });
    return (
        <div>
            <h2 className="mb-3">Your Notifications</h2>
            {notification.length === 0 ? (
                <>
                    <span className="mt-3 d-flex justify-content-center align-items-center">No New Notifications!</span>
                </>
            ) : (
                <span className="notiBox">{notifcationDisplay}</span>
            )}
        </div>
    );
};

export default Notification;