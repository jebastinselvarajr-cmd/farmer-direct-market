const EMOJI_MAP = [
  [['tomato', 'thakkali'], '🍅'],
  [['onion', 'vengayam'], '🧅'],
  [['carrot'], '🥕'],
  [['potato', 'urulai'], '🥔'],
  [['brinjal', 'eggplant', 'kathirikai'], '🍆'],
  [['banana', 'vazhai'], '🍌'],
  [['apple'], '🍎'],
  [['mango'], '🥭'],
  [['orange'], '🍊'],
  [['grape'], '🍇'],
  [['lemon'], '🍋'],
  [['coconut'], '🥥'],
  [['chilli', 'chili', 'pepper'], '🌶️'],
  [['corn'], '🌽'],
  [['garlic'], '🧄'],
  [['bean'], '🫘'],
  [['broccoli'], '🥦'],
  [['cucumber'], '🥒'],
  [['pumpkin'], '🎃'],
  [['watermelon'], '🍉'],
  [['pineapple'], '🍍'],
  [['strawberry'], '🍓'],
  [['spinach', 'cabbage', 'keerai', 'lettuce'], '🥬'],
  [['rice', 'wheat', 'paddy'], '🌾'],
  [['milk'], '🥛'],
  [['egg'], '🥚'],
  [['honey'], '🍯'],
];

export function getEmoji(name = '') {
  const n = name.toLowerCase();
  for (const [keywords, emoji] of EMOJI_MAP) {
    if (keywords.some((k) => n.includes(k))) return emoji;
  }
  return '🌱';
}