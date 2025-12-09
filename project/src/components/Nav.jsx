import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from "react-router"
import logo from "../assets/Logo.png"

const MyNavBar = () => {
    return (
        <Navbar className='my-nav-bar' variant='dark' expand="lg" fixed="top">
            <Container>
                <Navbar.Brand><img alt="" src={logo} width="70" height="60" /><br />TP Professor</Navbar.Brand>
                <Navbar.Toggle></Navbar.Toggle>
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link as={Link} to="/inventory">Your Books</Nav.Link>
                        <Nav.Link as={Link} to="/logs">Audit Log</Nav.Link>
                        <Nav.Link as={Link} to="/notification">Notification</Nav.Link>
                        <Nav.Link as={Link} to="/addBook">Add Book</Nav.Link>
                        <Nav.Link as={Link} to="/">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default MyNavBar