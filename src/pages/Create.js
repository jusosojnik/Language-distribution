import Navbar from "../components/Navbar";
import "../styles/App.css"
import { useState, useEffect } from "react";
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Button from "../components/Button";
import FileSelect from "../components/FileSelect";

function Create() {
    let fileReader;
    const [histogram, setHistogram] = useState([]);
    const [options, setOptions] = useState([])
    const [from, setFrom] = useState("en");
    const [to, setTo] = useState("en");
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false)

    async function createHistogram(words) {
        var uniqueWords = [];
        var hist = []

        setStatus(0);
        setLoading(true);
        
        for (var i = 0; i < words.length; i++) {
            var word = words[i].replace(/[^a-z0-9']/gi, '').toLowerCase();
            if (!uniqueWords.includes(word)) {
                if (word != '') {
                    uniqueWords.push(word);
                    hist.push([word, 1, "???"]);
                }
            } else {
                hist[uniqueWords.indexOf(word)][1]++;
            }
        }

        var uniqueWordsString = "";
        var translatedWords = "";
        var i = 0;
        while (i < uniqueWords.length) {
            uniqueWordsString = "";
            for (var j = 0; j < 100; j++) {
                uniqueWordsString += uniqueWords[i++] + "\n";
                if (i == uniqueWords.length) break;
            }
            setStatus(Math.round((i / uniqueWords.length) * 100) / 100);
            const result = await translate(uniqueWordsString);
            translatedWords += result;
        }

        var translation = translatedWords.split(/\r?\n/)
        for (var i = 0; i < hist.length; i++) {
                hist[i][2] = translation[i].toLowerCase();;
        }
        
        hist = hist.sort(function(a,b) {
            return b[1] - a[1];
        });

        setHistogram(hist);
        setLoading(false);
    }

    function handleFileRead(e) {
        const content = fileReader.result;
        createHistogram(content.replace( /\n/g, " " ).split( " " ));
    }

    function handleFileChosen(file) {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
    }

    function downloadTxtFile() {
        const element = document.createElement("a");
        var content = "";
        for (var i = 0; i < histogram.length; i++) {
            content += (histogram[i][0] + " - " + histogram[i][2] + "\n");
        }
        const file = new Blob([content], {
            type: "text/plain"
        });
        element.href = URL.createObjectURL(file);
        element.download = "histogram.txt";
        document.body.appendChild(element);
        element.click();
    }

    function translate(input) {
        const params=new URLSearchParams();
        params.append('q', input);
        params.append('source', from);
        params.append('target', to);
        params.append('api_key','xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

        return new Promise((resolve, reject) => {
            axios.post('https://libretranslate.de/translate',params,{
                headers:{'accept':'application/json',
                'Content-Type':'application/x-www-form-urlencoded'},
            }).then(res=>{
                resolve(res.data.translatedText)
            }).catch (err => {
                resolve("NaN");
            })
        })
        
      };

      useEffect(() => {
        axios.get("https://libretranslate.de/languages",{headers:{'accept':'application/json'}}).then(res=>{
          setOptions(res.data)
        })
      }, [])

    return (
        <div className="App">
            <header>
                <Navbar/>
            </header>
            <div className="App-container">
                <div className="language">
                    <div>
                        From ({from}):
                        <select onChange={e=>setFrom(e.target.value)}>
                        {options.map(opt=><option key={opt.code} value={opt.code}>{opt.name}</option>)}
                        </select>
                    </div>

                    <div>
                        To ({to}):
                        <select onChange={e=>setTo(e.target.value)}>
                        {options.map(opt=><option key={opt.code} value={opt.code}>{opt.name}</option>)}
                        </select>
                    </div>
                </div>

                <FileSelect text={"CREATE HISTOGRAM"} func={handleFileChosen}/>

                <div className="histogram-container">
                        {histogram.map(text => (
                            <p>{text[0] + " - " + text[2]}</p>
                        ))}
                </div>
                {loading && <div style={{ width: 150, height: 150 }}>
                    <CircularProgressbar value={status} maxValue={1} text={`${(status * 100).toFixed(0)}%`} styles={buildStyles({
                        pathColor: 'white',
                        textColor: 'white',
                        trailColor: 'black'
                    })}/>
                </div>}
                {histogram.length > 0 && <Button func={downloadTxtFile} text={"DOWNLOAD"}/>}
            </div>
        </div>
    );
}

export default Create;