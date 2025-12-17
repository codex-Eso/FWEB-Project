import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/Logo.png"

const NavStudent = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("loginRole");
        localStorage.removeItem("userId");
        navigate("/");
    }
    return (
        <Navbar className='my-nav-bar' variant='dark' expand="lg" fixed="top">
            <Container>
                <Navbar.Brand><img alt="" src={logo} width="70" height="60" /><br />TP Professor</Navbar.Brand>
                <Navbar.Toggle></Navbar.Toggle>
                <Navbar.Collapse>
                    <Nav className='me-auto'>
                        <Nav.Link as={NavLink} to="/student" end>Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/student/inventory">Your Books</Nav.Link>
                        <Nav.Link as={NavLink} to="/student/notification">Notification</Nav.Link>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavStudent