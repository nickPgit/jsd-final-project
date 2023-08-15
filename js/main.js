
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] // the alphabet as an array
const sounds = ['æ ā ah ā-uh uh' ]

const synth = window.speechSynthesis; // create instance of window.speechSynthesis to enable text to speech
let selectedLetter = '';

// speak the text that is passed in to the function using the web speech API
const speakText = function(text) {
    const speech = new SpeechSynthesisUtterance(text); // create a new 'utterance' of speech using the text that is passed into the function
    speech.rate = 0.5; // slow down rate of speech
    synth.speak(speech); 
};

// *** TEST for sounds of letters ***
speakText('hello');

// declare variables for buttons
const letterAndSoundButton = document.querySelector("#letterAndSound"); // 'main page' button
const wordsStartingWithButton = document.querySelector("#wordsStartingWith");
const wordsRhymingWithButton = document.querySelector("#wordsRhymingWith");
// declare variables for containers
const letterContainer = document.querySelector(".letterContainer"); // container for all of the letters of the alphabet at the top of the initial page 
const mainPageContainer = document.querySelector(".mainPageContainer"); // 
const wordsStartingWithContainer = document.querySelector(".wordsStartingWith");
const wordsRhymingWithContainer = document.querySelector(".wordsRhymingWith");

let mainWord = '';
let matchingWords = []; 
let rhymingWords = []; 

alphabet.forEach( letter => {
    const letterDiv = document.createElement('div')
    letterDiv.className = 'letter'; 
    letterDiv.innerHTML = letter.toUpperCase();
    letterContainer.appendChild(letterDiv)
    })

const letterDivs = document.querySelectorAll(".letter") 
const wordDivs = []; 

const leftLetterDiv = document.querySelector("#left")
const rightLetterDiv = document.querySelector("#right")

letterDivs.forEach((letter, index) => {
    letter.addEventListener('click', function() {
        selectedLetter = alphabet[index]
        speakText(selectedLetter); 
        leftLetterDiv.innerHTML = ''
        rightLetterDiv.innerHTML = ''
        wordsStartingWithContainer.innerHTML = ''
        wordsRhymingWithContainer.innerHTML = ''

        const bigLetterDiv = document.createElement('div'); 
        bigLetterDiv.innerHTML = selectedLetter.toUpperCase() + " " + selectedLetter
        leftLetterDiv.appendChild(bigLetterDiv)

        // get one 3-letter wordstarting with the clicked letter, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?sp=${selectedLetter}??`) 
            .then( res => { 
                const wordDiv = document.createElement('div'); 
                wordDiv.className= "word"; 
                mainWord = `${res.data.slice(0,1)[0].word}`;
                wordDiv.innerHTML += mainWord;
                rightLetterDiv.appendChild(wordDiv) 
                wordDivs.push(wordDiv);
            })
        
        // get 3-letter words starting with the clicked letter, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?sp=${selectedLetter}??`) 
        .then( res => { 
            matchingWords = res.data.slice(0,3)
            matchingWords.forEach(word => { 
                const wordDiv = document.createElement('div'); 
                wordDiv.className= "word"; 
                wordDiv.id = word.word; 
                wordDiv.innerHTML += `${word.word[0]}${word.word[1]}${word.word[2]}`;
                wordsStartingWithContainer.appendChild(wordDiv) 
                wordDivs.push(wordDiv);
            })
        })

        // get words rhyming with the main word, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?rel_rhy=${mainWord}`) 
        .then( res => { 
            wordsRhymingWithContainer.innerHTML = `words that rhyme with: ${mainWord}`
            rhymingWords = res.data.slice(0,3)
            rhymingWords.forEach(word => { 
                const wordDiv = document.createElement('div'); 
                wordDiv.className= "word"; 
                wordDiv.id = word.word; 
                wordDiv.innerHTML += `${word.word}`;
                wordsRhymingWithContainer.appendChild(wordDiv) 
                wordDivs.push(wordDiv);
            })
        })
        .catch(err => { 
            console.log('error: ', err)
        })
    })
});


mainPageContainer.addEventListener('click', async function(ev) { 
    speakText(ev.target.innerHTML); 
    
    axios.get('https://www.flickr.com/services/rest/', {
        params: { 
            method: 'flickr.photos.search',
            text: `${ev.target.innerHTML}`,
            format: 'json',
            nojsoncallback: 1, 
            api_key: '2f5ac274ecfac5a455f38745704ad084',
            safe_search: 1,
            privacy_filter: 1,
            sort: "interestingness-desc"
        }
    })
        .then(res => { 
            console.log(res.data)
            const picture = ev.target
            const img = document.createElement('img')
            img.src = generateImageUrl(res.data.photos.photo[0])
            picture.appendChild(img)
        })
        .catch(err => { 
            console.log('error: ', err)
        })
})

const generateImageUrl = (photo, size='q') => { 
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
}

wordsStartingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "block"
    wordsRhymingWithContainer.style.display = "none"

})

letterAndSoundButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "flex"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "none"
})

wordsRhymingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "block"


})