// the alphabet as an array
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 
// array of animals for each letter
const animals = ['alligator','bilby','cheetah','dingo','echidna','flying fox','goose','hamster','iguana','jellyfish','koala','lion','magpie','narwhal','octopus','platypus','quoll','rosella','skink','tiger','ulysses butterfly','vervet monkey','wombat','x-ray tetra','yabby','zebra'];

// access text to speech through the Web Speech API
const synth = window.speechSynthesis; 

// speak the text that is passed in to this function using the web speech API
const speakText = function(text) {
    const speech = new SpeechSynthesisUtterance(text); // create new 'utterance'
    speech.rate = 1.5; // alter rate of speech
    // speech.voice = voices[5]; // set voice to 'Google UK English Female'
    synth.speak(speech); // speak the 'utterance'
};

// get the available voices after 50 ms (allow them to load first)
// let voices;
// setTimeout(() => {
//     voices = synth.getVoices();

// }, 50);

// declare variables for buttons
const letterAndSoundButton = document.querySelector("#letterAndSound"); 
const wordsStartingWithButton = document.querySelector("#wordsStartingWith");
const wordsRhymingWithButton = document.querySelector("#wordsRhymingWith");
const animalsButton = document.querySelector("#animals");
// declare variables for containers
const letterContainer = document.querySelector(".letterContainer"); 
const mainPageContainer = document.querySelector(".mainPageContainer"); 
const wordsStartingWithContainer = document.querySelector(".wordsStartingWith");
const wordsRhymingWithContainer = document.querySelector(".wordsRhymingWith");
const animalsContainer = document.querySelector(".animals");
const instructionsContainer = document.querySelector(".instructions");
const cat = document.querySelector("#cat");

// create variables to keep track of and alter the following
let selectedLetter = '';
let mainWord = '';
let matchingWords = []; 
let rhymingWords = []; 
let letters = []; 

// create a visible letter for each letter in the alphabet at the top of screen
alphabet.forEach( letter => {
    const letterDiv = document.createElement('div')
    letterDiv.className = 'letter'; 
    letterDiv.innerHTML = letter.toUpperCase();
    letterContainer.appendChild(letterDiv)
    })

// get all of the letters (divs) after they have been loaded
const letterDivs = document.querySelectorAll(".letter") 
setTimeout(() => {
    letterDivs.forEach(letter => { 
        letter.style.animation = "word 5s";
    })
}, 2000);

// left and right divs of the main display section
const leftLetterDiv = document.querySelector("#left") // holds upper and lowercase letter
const rightLetterDiv = document.querySelector("#right") // holds word example

// function to update the display with the words generated from the AJAX request
const updateWords = function(word, container) { 
    const wordDiv = document.createElement('div'); 
    wordDiv.className= "word"; 
    wordDiv.id = word.word; 
    wordDiv.innerHTML += `${word.word}`;
    container.appendChild(wordDiv) 
}

//populate all display pages when a letter is clicked
letterDivs.forEach((letter, index) => {
    letter.addEventListener('click', function(ev) {
        selectedLetter = alphabet[index]
        
        ev.target.className = 'letter selected'
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
        
        const letterArray = Array.from(letterDivs)
        let check = letterArray.every((letter) => letter.className === "letter selected")
        if (check) { 
            instructionsContainer.innerHTML += `<br><br>WELL DONE! You have completed every letter!`
            cat.style.display = "block";
            speakText('WELL DONE! You have completed every letter!')
        }

        // get one 3-letter word starting with the clicked letter, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?sp=${selectedLetter}??`) 
            .then( res => { 
                const wordDiv = document.createElement('div'); 
                wordDiv.className= "word"; 
                mainWord = `${res.data.slice(0,1)[0].word}`;
                wordsRhymingWithButton.innerHTML = `words rhyming with <strong>${mainWord}</strong>`
                wordDiv.innerHTML += mainWord;
                rightLetterDiv.appendChild(wordDiv) 

                // get words rhyming with the 'main word' example, and put them in the appropriate page
                axios.get(`https://api.datamuse.com/words?rel_rhy=${mainWord}`) 
                .then( res => { 
                    // get first 3 words from results
                    rhymingWords = res.data.slice(0,3) 
                    rhymingWords.forEach(word => { 
                        updateWords(word, wordsRhymingWithContainer); 
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
                updateWords(word, wordsStartingWithContainer); 
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
            console.log('flickr request error: ', err)
        })
    })
});

// generate an image from the provided photo details 
const generateImageUrl = (photo, size='q') => { 
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
}

// speak the text of each of the containers ('pages')
leftLetterDiv.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML[0]); 
})
rightLetterDiv.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
})
wordsStartingWithContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
})
wordsRhymingWithContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.innerHTML); 
})
animalsContainer.addEventListener('click', function(ev) { 
    speakText(ev.target.id); 
})

// 'change pages' and instructions in the UI display when each button is clicked
letterAndSoundButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "flex"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "none"

    instructionsContainer.innerHTML = `1. Parent selects a letter <br>
    2. Parent to say the sound of the letter aloud and child to repeat. Recite the main word shown on the screen for that letter. Child can click on any word and the program will say the word. Encourage child to repeat words and sounds. Use the word in a simple sentence with the child
    <br>3. Parent: "what are some words that start with (letter sound)? 
    <br>4. Click 'words starting with' button to move to next page`
})

wordsStartingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "block"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "none"

    instructionsContainer.innerHTML = `5. Parent and child say those words aloud, putting emphasis on the sound of the first letter
    <br>6. Parent: "what are some words that rhyme with (the main word)? Click 'words rhyming with' button to move to next page`
})

wordsRhymingWithButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "block"
    animalsContainer.style.display = "none"

    instructionsContainer.innerHTML = `7. Parent and child say those words aloud, putting emphasis on the sound of the words and how they rhyme. <br>Parent navigates to animal page. `
})

animalsButton.addEventListener('click', function(ev){ 
    mainPageContainer.style.display = "none"
    wordsStartingWithContainer.style.display = "none"
    wordsRhymingWithContainer.style.display = "none"
    animalsContainer.style.display = "block"

    instructionsContainer.innerHTML = `8. Parent: this animals name starts with (letter sound), which animal is it? Parent and child say name of animal, putting emphasis on the sound of the first letter
    <br>9. revisit any sections that the child did not understand or had trouble saying
    <br>10. repeat above steps for another letter (you can see which letters have already been viewed)`
})
