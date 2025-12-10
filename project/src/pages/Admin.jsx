import { useEffect } from "react";
import { useNavigate } from "react-router";

function Admin() {
    const acutalRole = localStorage.getItem("loginRole");
    const navigate = useNavigate();
    useEffect(() => {
        if (acutalRole !== "admin") {
            navigate("/")
            return;
        }
    }, [])
    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    )
}

export default Admin