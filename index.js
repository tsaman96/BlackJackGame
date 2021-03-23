let blackJackGame = {
  'you': { 'scoreSpan': '#your-box-result', 'div': '#your-box', 'score': 0 },
  'dealer': { 'scoreSpan': '#dealer-box-result', 'div': '#dealer-box', 'score': 0 },
  'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
  'cardMaps': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'turnOver': false,
};

const YOU = blackJackGame['you']
const DEALER = blackJackGame['dealer']
const hitSound = new Audio('/home/tahera/Desktop/javascript crashcourse/static/sounds/swish.m4a')
const winSound = new Audio('/home/tahera/Desktop/javascript crashcourse/static/sounds/cash.mp3')
const lostSound = new Audio('/home/tahera/Desktop/javascript crashcourse/static/sounds/aww.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackhit);

document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackstand);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal);

function blackjackhit() {
  if (blackJackGame['isStand'] === false) {
    let card = randomCard();
    showCard(YOU, card);
    updateScore(card, YOU);
    showScore(YOU);
  }
}
function sleep(ms){
  return new Promise( resolve => setTimeout(resolve, ms));

}


 async function blackjackstand() {
  blackJackGame['isStand'] = true;
  while (DEALER['score'] < 15 &&  blackJackGame['isStand'] === true) {
    let card = randomCard();
    showCard(DEALER, card);
    updateScore(card, DEALER);
    //console.log(DEALER['score']);
    showScore(DEALER);
    await sleep(1000);
  }

  blackJackGame['turnOver'] = true;
  let winner = computeWinner();
  showResult(winner);

}

function blackjackdeal() {

  if (blackJackGame['turnOver'] === true) {
    blackJackGame['isStand'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    for (let i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector('#your-box-result').textContent = 0;
    document.querySelector('#dealer-box-result').textContent = 0;
    document.querySelector('#blackjack-result').textContent = 'lets play';

    document.querySelector('#your-box-result').style.color = '#ffffff';
    document.querySelector('#dealer-box-result').style.color = '#ffffff';
    document.querySelector('#blackjack-result').style.color = 'black';

    blackJackGame['turnOver'] = false;

  }
}


function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackJackGame['cards'][randomIndex];

}
function showCard(activePlayer, card) {
  if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `/home/tahera/Desktop/javascript crashcourse/static/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
  }
}


function updateScore(card, activePlayer) {

  if (card === 'A') {
    if (activePlayer['score'] + blackJackGame['cardMaps'][card][11] <= 21) {
      activePlayer['score'] + blackJackGame['cardMaps'][card][11];
    }
    else {
      activePlayer['score'] += blackJackGame['cardMaps'][card][1];
    }
  }
  else {
    activePlayer['score'] += blackJackGame['cardMaps'][card];

  }

}

function showScore(activePlayer) {
  if (activePlayer['score'] > 21) {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }
  else { document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']; }
}

function computeWinner() {
  let winner;
  if (YOU['score'] <= 21) {
    if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
      blackJackGame['wins']++;
      winner = YOU;
    }
    else if (YOU['score'] < DEALER['score']) {
      blackJackGame['losses']++;
      winner = DEALER;
    }
    else if (YOU['score'] === DEALER['score']) {
      blackJackGame['draws']++;
    }
  }
  else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
    blackJackGame['losses']++;
    winner = DEALER;
  }
  else if (YOU['score'] > 21 && DEALER['score'] > 21) {
    blackJackGame['draws']++;
  }
  console.log(blackJackGame);
  return winner;
}

function showResult(winner) {
  let message, messageColor;
  if (winner === YOU) {
    document.querySelector('#wins').textContent = blackJackGame['wins'];
    message = 'You Won!';
    messageColor = 'green';
    winSound.play();
  }
  else if (winner === DEALER) {
    document.querySelector('#losses').textContent = blackJackGame['losses'];
    message = 'You Lost!';
    messageColor = 'red';
    lostSound.play();
  } else {
    document.querySelector('#draws').textContent = blackJackGame['draws'];
    message = 'You Drew!';
    messageColor = 'black'
  }
  document.querySelector('#blackjack-result').textContent = message;
  document.querySelector('#blackjack-result').style.color = messageColor;
}