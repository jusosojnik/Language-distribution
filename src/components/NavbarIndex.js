import "../styles/NavbarIndex.css"

function NavbarIndex() {
    return (
        <ul className="NavbarIndex">
          <a className="selected" href="#"><li>Home</li></a>
          <a href="learn"><li>Learn</li></a>
          <a href="create"><li>Create</li></a>
          <a href="about"><li>About</li></a>
        </ul>
    );
}

export default NavbarIndex;