// the alphabet as an array
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 

const animals = ['alligator','bilby','cheetah','dingo','echidna','flying fox','goose','hamster','iguana','jellyfish','koala','lion','magpie','narwhal','octopus','platypus','quoll','rosella','skink','tiger','ulysses butterfly','vervet monkey','wombat','x-ray tetra','yabby','zebra'];

// speechSynthesis const to access text to speech
const synth = window.speechSynthesis; 

// speak the text that is passed in to this function using the web speech API
const speakText = function(text) {
    const speech = new SpeechSynthesisUtterance(text); // create a new 'utterance'
    speech.rate = 0.8; // alter rate of speech
    speech.voice = voices[5]; // select voice
    synth.speak(speech); // speak the utterance
};

// get the available voices after 50 ms (allow them to load)
let voices; 
setTimeout(() => {
    voices = synth.getVoices()
}, 50);

// declare variables for buttons
const letterAndSoundButton = document.querySelector("#letterAndSound"); 
const wordsStartingWithButton = document.querySelector("#wordsStartingWith");
const wordsRhymingWithButton = document.querySelector("#wordsRhymingWith");
const animalsButton = document.querySelector("#animals");
// declare variables for containers
const letterContainer = document.querySelector(".letterContainer"); // for the alphabet
const mainPageContainer = document.querySelector(".mainPageContainer"); 
const wordsStartingWithContainer = document.querySelector(".wordsStartingWith");
const wordsRhymingWithContainer = document.querySelector(".wordsRhymingWith");
const animalsContainer = document.querySelector(".animals");

// create variables to keep track of and alter the following
let selectedLetter = '';
let mainWord = '';
let matchingWords = []; 
let rhymingWords = []; 

// create a visible letter for each letter in the alphabet at the top of screen
alphabet.forEach( letter => {
    const letterDiv = document.createElement('div')
    letterDiv.className = 'letter'; 
    letterDiv.innerHTML = letter.toUpperCase();
    letterContainer.appendChild(letterDiv)
    })

// get all of the letters (divs)
const letterDivs = document.querySelectorAll(".letter") 
// keep track of all the words 
const wordDivs = []; 
const viewedLetters = []

// left and right divs of the main display section
const leftLetterDiv = document.querySelector("#left") // holds upper and lowercase 
const rightLetterDiv = document.querySelector("#right") // holds word example

//populate all display pages when a letter is clicked
letterDivs.forEach((letter, index) => {
    letter.addEventListener('click', function(ev) {
        selectedLetter = alphabet[index]
        ev.target.className = 'letter selected'
        viewedLetters.push(selectedLetter)
        speakText(selectedLetter); 
        leftLetterDiv.innerHTML = ''
        rightLetterDiv.innerHTML = ''
        wordsStartingWithContainer.innerHTML = ''
        wordsStartingWithButton.innerHTML = `words starting with <strong>${selectedLetter.toUpperCase()}</strong>`
        wordsRhymingWithContainer.innerHTML = ''
        
        animalsContainer.innerHTML = ''

        const bigLetterDiv = document.createElement('div'); 
        bigLetterDiv.innerHTML = selectedLetter.toUpperCase() + " " + selectedLetter
        leftLetterDiv.appendChild(bigLetterDiv)

        // get one 3-letter word starting with the clicked letter, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?sp=${selectedLetter}??`) 
            .then( res => { 
                const wordDiv = document.createElement('div'); 
                wordDiv.className= "word"; 
                mainWord = `${res.data.slice(0,1)[0].word}`;
                wordsRhymingWithButton.innerHTML = `words rhyming with <strong>${mainWord}</strong>`
                wordDiv.innerHTML += mainWord;
                rightLetterDiv.appendChild(wordDiv) 
                wordDivs.push(wordDiv);

                // get words rhyming with the main word, and put them in the appropriate page
                axios.get(`https://api.datamuse.com/words?rel_rhy=${mainWord}`) 
                .then( res => { 
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
                    console.log('wordsRhymingWith error: ', err)
                })
            })
            .catch(err => { 
                console.log('main page error: ', err)
            })

        // get 3-letter words starting with the clicked letter, and put them in the appropriate page
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
        .catch(err => { 
            console.log('wordsStartingWith error: ', err)
        })
        // get picture of animal and append to animals display page
        axios.get('https://www.flickr.com/services/rest/', {
            params: { 
                method: 'flickr.photos.search',
                text: `${animals[index]}`,
                format: 'json',
                nojsoncallback: 1, 
                api_key: '2f5ac274ecfac5a455f38745704ad084',
                safe_search: 1,
                privacy_filter: 1,
                sort: "interestingness-desc"
            }
        })
        .then(res => { 
            // console.log(res.data)
            const img = document.createElement('img')
            img.className = 'animal'
            img.id = animals[index]
            img.src = generateImageUrl(res.data.photos.photo[0])
            animalsContainer.appendChild(img)
        })
        .catch(err => { 
            console.log('error: ', err)
        })
    })
});


mainPageContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
    
    // axios.get('https://www.flickr.com/services/rest/', {
    //     params: { 
    //         method: 'flickr.photos.search',
    //         text: `${ev.target.innerHTML}`,
    //         format: 'json',
    //         nojsoncallback: 1, 
    //         api_key: '2f5ac274ecfac5a455f38745704ad084',
    //         safe_search: 1,
    //         privacy_filter: 1,
    //         sort: "interestingness-desc"
    //     }
    // })
    //     .then(res => { 
    //         console.log(res.data)
    //         const picture = ev.target
    //         const img = document.createElement('img')
    //         img.src = generateImageUrl(res.data.photos.photo[0])
    //         picture.appendChild(img)
    //     })
        // .catch(err => { 
        //     console.log('error: ', err)
        // })
})

// speak the text of each of the containers ('pages')
wordsStartingWithContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
})
wordsRhymingWithContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
})
animalsContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.id); 
})

// generate an image from the provided photo details 
const generateImageUrl = (photo, size='q') => { 
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
}

// 'change pages' of the UI display when each button is clicked
wordsStartingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "block"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "none"
})

letterAndSoundButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "flex"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "none"
})

wordsRhymingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "block"
    animalsContainer.style.display = "none"
})

animalsButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "block"
})