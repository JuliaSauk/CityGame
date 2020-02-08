const dictionary = require('./Dictionary');

module.exports = class Cities {

  startNewGame() {
    this.dictionary = JSON.parse(JSON.stringify(dictionary));
    this.lastAnswer = '';
    Object.values(dictionary).reduce((result, item) => {
      return result.concat(item.cities)
      }, [])
  }

  makeAMove(sInput, fCallback) {
    if (!this.lastAnswer) {
      this.startNewGame();
      this.lastAnswer = 'Chernigiv';
      fCallback(['Welcome to Cities game', 'You need to name a city which starts with the last letter of my city. If you do not know such a city - type \'!\'.', 'But be honest... Don\'t enter just random words and don\'t repeat cities.',
        'I will start with: ' + this.lastAnswer]);
      return;
    }

    let sReturn = '';
    const lastLetter = sInput.charAt(sInput.length - 1);
    const firstLetter = sInput.charAt(0).toLowerCase();
    const lastAnswerLastLetter = this.lastAnswer.charAt(this.lastAnswer.length - 1);

    // user does not know the city name
    if (sInput === '!') {
      this.startNewGame();
      return setTimeout(() => {
        fCallback(['You lose, foolish man']);
      }, 3000);
    }

    // user`s city name does not start with the last letter of
    if (lastAnswerLastLetter !== firstLetter) {
      this.startNewGame();
      return setTimeout(() => {
        fCallback(['Don`t lie to me, you lose.']);
      }, 3000);
    }

    let possibleAnswers = this.dictionary[lastLetter];
    console.log('possibleAnswers: ', possibleAnswers);
    if (possibleAnswers.lastIndex === possibleAnswers.cities.length) {
      // user has won
      this.startNewGame();
      sReturn = 'Congrats, you won... We can try one more time.';
    } else {
      const newLastAnswer = possibleAnswers.cities[possibleAnswers.lastIndex];
      const newLastIndex = possibleAnswers.lastIndex + 1;
      sReturn = 'My answer is: ' + newLastAnswer;
      possibleAnswers.lastIndex = newLastIndex;
      this.dictionary[lastLetter] = possibleAnswers;
      this.lastAnswer = newLastAnswer;
    }

    setTimeout(() => {
      fCallback([sReturn]);
    }, 3000);
  }
};
