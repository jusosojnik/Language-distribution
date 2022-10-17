import "../styles/FileSelect.css"

function FileSelect({text, func}) {
    return (
        <>
            <label htmlFor="files" className="file-input-label">{text}</label>
            <input id="files" type='file' className="file-input" accept="text/plain" onChange={e => func(e.target.files[0])}/>
        </>
    );
}

export default FileSelect;