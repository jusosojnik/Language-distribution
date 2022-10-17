import "../styles/Navbar.css"

function Navbar() {
    return (
        <ul className="Navbar">
          <a href="/"><li>Home</li></a>
          <a className={window.location.pathname === "/learn" && "selected"} href={window.location.pathname === "/learn" ? "#" : "learn"}><li>Learn</li></a>
          <a className={window.location.pathname === "/create" && "selected"} href={window.location.pathname === "/create" ? "#" : "create"}><li>Create</li></a>
          <a className={window.location.pathname === "/about" && "selected"} href={window.location.pathname === "/about" ? "#" : "about"}><li>About</li></a>
        </ul>
    );
}

export default Navbar;