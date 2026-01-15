//used to display empty books
import Empty from "../assets/Empty.png"
const NoBooks = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <img src={Empty} width={150} />
            <br></br>
            <h4>Cannot Find Any Books</h4>
            <h5 style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => window.location.reload()}>Reload?</h5>
        </div>
    )
}

export default NoBooks