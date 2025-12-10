import { useEffect } from "react";
import { useNavigate } from "react-router";

function Student() {
    const acutalRole = localStorage.getItem("loginRole");
    const navigate = useNavigate();
    useEffect(() => {
        if (acutalRole !== "student") {
            navigate("/")
            return;
        }
    }, [])
    return (
        <div>
            <h1>Student Page</h1>
        </div>
    )
}

export default Student