import { useEffect } from "react"
import { overflow } from "../overflow"
const AuditLog = () => {
    useEffect(() => { overflow(false) }, []);
    return (
        <div>
            <h1>Audit Log</h1>
        </div>
    )
}

export default AuditLog
