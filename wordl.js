const boxes = document.querySelectorAll(".box")
const ANSWER_LENGTH = 5;
const loadingDiv = document.querySelector('.loading');
// const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const ROUNDS = 6;
const winDiv = document.querySelector('.win');
const stupidDiv = document.querySelector('.stupid');
const lostDiv = document.querySelector('.lost');


async function type() {
  
  let guess = '';
  let currentRow = 0;
  let isLoading = true;

  
  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  const resObj = await res.json();
  const word = resObj.word;
  const wordParts = word.split("");
  let done = false;
  loading(false);
  isLoading = false;

  
    document.body.onload = addElement;

    function addElement() {
    const para = document.createElement("div");
    const newContent = document.createTextNode(`You lost :( The word was "${word}"`);
    para.appendChild(newContent);
    const currentDiv = document.getElementById("message-container");
    document.body.insertBefore(para, currentDiv)
    para.classList.add('win');
    para.classList.add('show');
    }
    

  function addLetter (letter) {
    if (guess.length < ANSWER_LENGTH) {
      // add letter to the end
      guess += letter;
    } else {
      // replace the last letter
      guess = guess.substring(0, guess.length - 1) + letter
    } 

    boxes[ANSWER_LENGTH * currentRow + guess.length - 1].innerText = letter;
    // adds letter into the box
  }

 
  function backspace() {
    if (guess.length <= 1) {
     guess = '';
   } else {
     guess = guess.substring(0, guess.length - 1)
   }

   
   boxes[ANSWER_LENGTH * currentRow + guess.length].innerText = '';
 }
  

  async function enter() {
    if (guess.length !== ANSWER_LENGTH) {
      //do nothing
      return;
    }

    isLoading = true;
    loading(true);

    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: guess })
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    loading(false);

    if (!validWord) {
      markInvalidWord();
      stupidDiv.classList.add('show');
      setTimeout( function() {
        stupidDiv.classList.remove('show');}, 3000);
      return;
    }
 

    const guessParts = guess.split("");
    const map = makeMap(wordParts);
    

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // correct mark
      if (guessParts[i] === wordParts[i]) {
        boxes[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--; 
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        boxes[currentRow * ANSWER_LENGTH + i].classList.add("correct");
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        boxes[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--; 
      } else {
        boxes[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }
    

    currentRow++;


   

    if (guess === word) {
      // you win
      winDiv.classList.add('show');
      
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      // alert (`You lost :( The word was "${word}"`)
      addElement();
      para.classList.add('show')
      done = true;
    }

  guess = '';
  }

  
  function markInvalidWord() {
    
   for (let i = 0; i < ANSWER_LENGTH; i++) {
      boxes[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
      
    setTimeout( function() {
      boxes[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
     }, 10);

 
  }
  }
  


  document.addEventListener("keydown", function handleKeyPress (event) {
    if (done || isLoading) {
      // do nothing 
      return;
    }
   
    const action = event.key;

    if (action === 'Enter') {
      enter();
    } else if (action === 'Backspace') {
      backspace();
    } else if (isLetter(action)) {
      event.preventDefault(); 
      addLetter(action) }
    else {
      // do nothing
    }
})
}


function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}


function loading(isLoading) {
  loadingDiv.classList.toggle('show', isLoading);
}


function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}


type();


const rulesDiv = document.querySelector('.rules');
const question = document.getElementById('question');


function rules() {
  question.addEventListener('mouseover', function() {
        rulesDiv.classList.add('display');
      })


    
  question.addEventListener('mouseleave', function() {
        rulesDiv.classList.remove('display');
      })
}

rules();

