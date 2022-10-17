import "../styles/Button.css"

function Button({text, func}) {
    return (
        <button className="Button" onClick={func}>{text}</button>
    );
}

export default Button;