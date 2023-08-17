# final project - learning to read
## JSD final project

**Try it out here:** https://nickpgit.github.io/jsd-final-project/

**overview**
This app is designed to assist parents to teach pre-kinder children to read (and particular to develop 'emergent reading', the first stages of reading development). It aims to do this through: 

1. linking the sound of a letter with the letter itself
2. identifying and saying words that start with that letter, emphasizing the sound of the first letter
3. identifying words that rhyme with a particular word
4. identifying an animal whose name starts with the chosen letter
5. recognise the individual sounds in spoken words (phonemic awareness) . 

**How it works:** 
The app uses AJAX requests to obtain information about a clicked letter - including words that start with that letter, and rhyming words - to populate the UI accordingly. The app uses the Web Speech API to say any letter or word that is clicked. The app contains instructions for use in the grey instructions box at the bottom of the page.

**screenshots:** 
![main page](images/main.png)
![letter and sound](images/letter%20and%20sound.png)

**Technical hurdles:** 
- I originally used the flickr API to return images of each word when clicked, however the results were inconsistent and sometimes not appropriate, so I chose to remove this feature.
- the animal image obtained through the flickr API is sometimes not correct. I had trouble trying to find an appropriate API to get consistent images from, and also wasn't able to find one for drawings/cartoon pictures
- when deployed as a live site, the 'voice' of the speech API changes depending on the device. I tried to set the voice to 'UK female' to get an Australian-sounding accent. I removed setting the voice and instead let it default to 'US male' to ensure it says words correctly
- I struggled with overthinking the possibilities of what the app could do
- I was unable to find a way to make the app say the sounds of letters
- Unsure how to refactor the code for the nav button event listeners as it is quite long

**What I learned**
- I needed to have more definite plans for the app, to know exactly what it should do, before creating it. This will keep me on track and help me not get bogged down in the various directions I could take the app in 
- API results can be very inconsistent and sometimes the results data needs to be filtered. 

**Technology that we haven't covered in class:** 
The Web Speech API - I used this inbuilt browser API to 'say' the words or letters that were clicked. 

**future features** 
- find a way for the app to say the sounds of the letters, not just the name of the letter
- use speech recognition to check whether the child says the sound of the letter or says the word correctly 
- make this into an actual game, to make it more engaging, with cartoon characters, letters that move around the screen, allowing the child to interactively experiment with the sounds of letter, perhaps allowing them to join letters or sounds together to form new sounds and words. Make it self-guided by the child rather than directed by the parent 
- research the reading teaching methods further, to be more clear about exactly how the app should be used by parents to teach children, to aid learning
