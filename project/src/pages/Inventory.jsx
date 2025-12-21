import { overflow } from "../overflow"
import { useEffect } from "react";
const Inventory = () => {
    useEffect(() => { overflow(false) }, []);
    return (
        <div>
            <h1>Inventory</h1>
        </div>
    )
}

export default Inventory
