import { useEffect } from "react"
import { overflow } from "../overflow"

const Notification = () => {
    useEffect(() => { overflow(false) }, []);
    return (
        <div>
            <h1>Notification</h1>
        </div>
    )
}

export default Notification
