const greetings = ["Hi", "Hey", "Howdy", "Hello", "Greetings", "Salutations"];

function getRandomGreeting() {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

module.exports = getRandomGreeting;
