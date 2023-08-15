
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

const synth = window.speechSynthesis;

// const { Configuration, OpenAIApi } = require("./openai");
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const speakText = function(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.5;
    synth.speak(speech);
};

const letterContainer = document.querySelector(".letterContainer")
const pictureContainer = document.querySelector(".pictureContainer")

alphabet.forEach( letter => {
    const letterDiv = document.createElement('div')
    // const audioDiv = document.createElement('audio')
    // audioDiv.src = `sounds/${letter}.wav`;
    // audioDiv.className = 'audio'; 
    // console.log(audioDiv)

    // letterDiv.innerHTML += audioDiv; 
    letterDiv.className = 'letter'; 
    letterDiv.innerHTML = letter;
    // letterDiv.appendChild(audioDiv) 
    letterContainer.appendChild(letterDiv)
    })

const letterDivs = document.querySelectorAll(".letter") 
const wordDivs = []; 

letterDivs.forEach((letter, index) => {
    letter.addEventListener('click', function() {
        speakText(alphabet[index]); 
        pictureContainer.innerHTML = ''

        const bigLetterDiv = document.createElement('div'); 
        bigLetterDiv.innerHTML = alphabet[index]
        pictureContainer.appendChild(bigLetterDiv)

        // get 3-letter words starting with the clicked letter, sorted by 'popularity'
        axios.get(`https://api.datamuse.com/words?sp=${alphabet[index]}??`) 
            .then( res => { 
                const matchingWords = res.data.slice(0,3)
                matchingWords.forEach(word => { 
                    const wordDiv = document.createElement('div'); 
                    wordDiv.className= "word"; 
                    wordDiv.id = word; 
                    wordDiv.innerHTML += `${word.word}`;
                    pictureContainer.appendChild(wordDiv) 
                    wordDivs.push(wordDiv);
                })
            })
    } )
});

pictureContainer.addEventListener('click', async function(ev) { 
    speakText(ev.target.innerHTML); 
    
    // const response = await openai.createImage({
    //     prompt: ev.target.innerHTML,
    //     n: 1,
    //     size: "300x300",
    //     });
    //     image_url = response.data.data[0].url;

    //     ev.target.innerHTML = ''; 
    //     const img = document.createElement('img')
    //     img.src = image_url
    //     ev.target.appendChild(img)

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

