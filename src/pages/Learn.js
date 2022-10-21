import Navbar from "../components/Navbar";
import FileSelect from "../components/FileSelect";
import { useState, useEffect } from "react";
import "../styles/App.css"
import Button from "../components/Button";

function Learn() {
    let fileReader;
    const [words, setWords] = useState([]);
    const [translations, setTranslations] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [count, setCount] = useState(0);
    const [numOfWords, setNumOfWords] = useState(0);
    const [score, setScore] = useState(0);
    const [word, setWord] = useState("");
    const [translation, setTranslation] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [hint, setHint] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [wordToTranslation, setWordToTranslation] = useState(true);

    function changeCount(e, increase) {
        var x = count
        if (increase) {
            if (x < numOfWords) {
                setCount((x + 1));
                if (wordToTranslation) {
                    setWord(words[x + 1]);
                    setTranslation(translations[x + 1]);
                } else {
                    setWord(translations[x + 1]);
                    setTranslation(words[x + 1]);
                }
                setHint(false);
            }
        } else {
            if (x > 0) {
                setCount((x - 1));
                if (wordToTranslation) {
                    setWord(words[x - 1]);
                    setTranslation(translations[x - 1]);
                } else {
                    setWord(translations[x - 1]);
                    setTranslation(words[x - 1]);
                }
                setHint(false);
            }
        }
        e.preventDefault();
    }

    function changeWordToTranslation(e){
        if (!wordToTranslation) {
            setWord(words[count]);
            setTranslation(translations[count]);
        } else {
            setWord(translations[count]);
            setTranslation(words[count]);
        }
        setWordToTranslation(!wordToTranslation)
        e.preventDefault();
    }

    function processFile(content) {
        var words = [];
        var translations = [];
        for (var i = 0; i < content.length; i++) {
            words.push(content[i].split(" - ")[0]);
            translations.push(content[i].split(" - ")[1]);
        }

        setScore(0);
        setCount(0);
        setWord(words[count]);
        setTranslation(translations[count]);
        setWords(words);
        setTranslations(translations);
        setNumOfWords(words.length);
    }

    function handleFileRead(e) {
        const content = fileReader.result;
        processFile(content.replace( /\n/g, "@.?@@@" ).split("@.?@@@"));
    }

    function handleFileChosen(file) {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        setLoaded(true);
    }

    function handleChange(value) {
        setInputValue(value);
        if (value == translation) {
            var x = score;
            setScore((x + 1));
            var words2 = words;
            var translations2 = translations;
            if (wordToTranslation) {
                words2.splice(words2.indexOf(word), 1);
                translations2.splice(translations2.indexOf(translation), 1);
            } else {
                words2.splice(words2.indexOf(translation), 1);
                translations2.splice(translations2.indexOf(word), 1);
            }
            setWords(words2);
            setTranslations(translations2);
            if (wordToTranslation) {
                setWord(words2[count]);
                setTranslation(translations2[count]);
            } else {
                setWord(translations2[count]);
                setTranslation(words2[count]);
            }
            setInputValue("");
            setHint(false);
        }
    }

    function showHint() {
        var h = hint
        setHint(!h);
    }

    function giveUp() {
        setGameOver(true);
    }

    return (
        <div className="App">
            <header>
                <Navbar/>
            </header>
            <div className="App-container">
                {loaded && <div className="learn">
                    <div className="word-bar">
                        <div className="hint">
                            <label htmlFor="words">{word}</label>
                            <span className="translation">
                                {hint && <span>
                                    {translation}
                                </span>}
                                <Button text={"Give Up"} func={giveUp}></Button>
                                <Button text={"?"} func={showHint}></Button>
                            </span>
                        </div>
                        <div>
                            <input id="words" type="text" value={inputValue} onChange={e => handleChange(e.target.value.toLowerCase())}/>
                            <span className="counter">
                                {score} / {numOfWords}
                            </span>
                            <Button text={"<"} func={e => changeCount(e, false)}/>
                            <Button text={">"} func={e => changeCount(e, true)}/>
                        </div>  
                    </div>
                </div>}
                {loaded && <Button text={"🔁"} func={e => changeWordToTranslation(e)}/>}
                <FileSelect text={"UPLOAD FILE"} func={handleFileChosen}/>
                {(gameOver && words.length > 1) && <div className="histogram-container">
                        {wordToTranslation ? words.map((word, index) => (
                                <p>{word + " - " + translations[index]}</p>
                        )) :
                        words.map((word, index) => (
                            <p>{translations[index] + " - " + word}</p>
                        ))
                        }
                </div>}
            </div>
        </div>
    );
}

export default Learn;