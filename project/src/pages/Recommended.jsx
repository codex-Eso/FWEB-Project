import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { overflow } from "../overflow"
import { Stack } from "react-bootstrap";

const Recommended = () => {
    const navigate = useNavigate();
    useEffect(() => { overflow(true) }, []);
    return (
        <Stack>
            <h3>Recommended Books</h3>
        </Stack>
    )
}

export default Recommended