import { MAX_ANSWER_LENGTH } from '../utils/limits';

// Comprehensive category dictionary and taxonomy verification engine for ScatterBrain

export const SLANG_BLACKLIST = new Set([
  'lol', 'lmao', 'rofl', 'omg', 'idk', 'tbh', 'imo', 'imho', 'wtf', 'brb', 'btw', 'fyi',
  'asap', 'asdf', 'qwerty', 'haha', 'hahaha', 'hehe', 'hehehe', 'yes', 'no', 'nah',
  'yep', 'nope', 'test', 'thing', 'stuff', 'none', 'nothing', 'idk', 'dunno', 'plz',
  'pls', 'thx', 'thanks', 'cool', 'nice', 'good', 'bad', 'okay', 'ok', 'yo', 'sup',
]);

// Curated database of valid items across categories
export const CATEGORY_DATABASE: Record<string, string[]> = {
  body_part: [
    'abdomen', 'ankle', 'arm', 'armpit', 'appendix', 'artery',
    'back', 'belly', 'bicep', 'bladder', 'blood', 'bone', 'brain', 'breast', 'brow', 'buttocks',
    'calf', 'cheek', 'chest', 'chin', 'clavicle', 'collarbone', 'colon', 'cornea', 'cranium',
    'diaphragm', 'ear', 'earlobe', 'elbow', 'esophagus', 'eye', 'eyebrow', 'eyelash', 'eyelid',
    'face', 'femur', 'fibula', 'finger', 'fingernail', 'foot', 'forearm', 'forehead',
    'gallbladder', 'groin', 'gum', 'gut',
    'hair', 'hand', 'head', 'heart', 'heel', 'hip', 'humerus',
    'intestine', 'iris', 'jaw', 'joint', 'jugular',
    'kidney', 'knee', 'kneecap', 'knuckle',
    'larynx', 'leg', 'ligament', 'limb', 'lip', 'liver', 'lobe', 'lumbar', 'lung',
    'mandible', 'molar', 'mouth', 'muscle',
    'nail', 'navel', 'neck', 'nerve', 'nose', 'nostril',
    'ovary', 'palate', 'palm', 'pancreas', 'patella', 'pelvis', 'pharynx', 'pupil',
    'radius', 'rib', 'ribcage',
    'scalp', 'scapula', 'shin', 'shoulder', 'skeleton', 'skin', 'skull', 'sole', 'spine', 'spleen', 'stomach',
    'teeth', 'tendon', 'thigh', 'throat', 'thumb', 'tibia', 'toe', 'toenail', 'tongue', 'tonsil', 'tooth', 'torso', 'trachea',
    'ulna', 'ureter', 'urethra', 'uterus', 'uvula',
    'vein', 'vertebra', 'vocal cord', 'waist', 'wrist',
  ],
  animal: [
    'alligator', 'alpaca', 'ant', 'anteater', 'antelope', 'ape', 'armadillo',
    'baboon', 'badger', 'bat', 'bear', 'beaver', 'bee', 'beetle', 'bison', 'boar', 'buffalo', 'butterfly',
    'camel', 'canary', 'cat', 'caterpillar', 'cheetah', 'chicken', 'chimpanzee', 'chinchilla', 'clam', 'cobra', 'cougar', 'cow', 'coyote', 'crab', 'crocodile', 'crow',
    'deer', 'dingo', 'dog', 'dolphin', 'donkey', 'dove', 'dragonfly', 'duck',
    'eagle', 'eel', 'elephant', 'elk', 'emu',
    'falcon', 'ferret', 'finch', 'flamingo', 'fox', 'frog',
    'gazelle', 'gecko', 'gerbil', 'giraffe', 'goat', 'goose', 'gorilla', 'guinea pig',
    'hamster', 'hare', 'hawk', 'hedgehog', 'heron', 'hippopotamus', 'horse', 'hyena',
    'iguana', 'impala', 'jackal', 'jaguar', 'jellyfish',
    'kangaroo', 'koala', 'komodo dragon',
    'lemur', 'leopard', 'lion', 'lizard', 'llama', 'lobster', 'lynx',
    'meerkat', 'mole', 'monkey', 'moose', 'mosquito', 'mouse', 'mule',
    'newt', 'octopus', 'opossum', 'ostrich', 'otter', 'owl', 'ox',
    'panda', 'panther', 'parrot', 'peacock', 'pelican', 'penguin', 'pig', 'pigeon', 'platypus', 'polar bear', 'porcupine', 'possum',
    'quail', 'rabbit', 'raccoon', 'ram', 'rat', 'raven', 'reindeer', 'rhinoceros',
    'salamander', 'salmon', 'scorpion', 'seagull', 'seahorse', 'seal', 'shark', 'sheep', 'shrimp', 'skunk', 'sloth', 'snail', 'snake', 'sparrow', 'spider', 'squid', 'squirrel', 'starfish', 'swan',
    'tapir', 'tiger', 'toad', 'tortoise', 'toucan', 'trout', 'turkey', 'turtle',
    'viper', 'vulture', 'walrus', 'wasp', 'weasel', 'whale', 'wolf', 'wolverine', 'wombat',
    'yak', 'zebra',
  ],
  country: [
    'afghanistan', 'albania', 'algeria', 'andorra', 'angola', 'argentina', 'armenia', 'australia', 'austria', 'azerbaijan',
    'bahamas', 'bahrain', 'bangladesh', 'barbados', 'belarus', 'belgium', 'belize', 'benin', 'bhutan', 'bolivia', 'bosnia', 'botswana', 'brazil', 'brunei', 'bulgaria',
    'cambodia', 'cameroon', 'canada', 'chile', 'china', 'colombia', 'congo', 'costa rica', 'croatia', 'cuba', 'cyprus', 'czech republic', 'czechia',
    'denmark', 'djibouti', 'dominica', 'dominican republic',
    'ecuador', 'egypt', 'el salvador', 'estonia', 'eswatini', 'ethiopia',
    'fiji', 'finland', 'france',
    'gabon', 'gambia', 'georgia', 'germany', 'ghana', 'greece', 'grenada', 'guatemala', 'guinea', 'guyana',
    'haiti', 'honduras', 'hungary',
    'iceland', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy',
    'jamaica', 'japan', 'jordan',
    'kazakhstan', 'kenya', 'kuwait', 'kyrgyzstan',
    'laos', 'latvia', 'lebanon', 'lesotho', 'liberia', 'libya', 'liechtenstein', 'lithuania', 'luxembourg',
    'madagascar', 'malawi', 'malaysia', 'maldives', 'mali', 'malta', 'mauritania', 'mauritius', 'mexico', 'micronesia', 'moldova', 'monaco', 'mongolia', 'montenegro', 'morocco', 'mozambique', 'myanmar',
    'namibia', 'nauru', 'nepal', 'netherlands', 'new zealand', 'nicaragua', 'niger', 'nigeria', 'north korea', 'north macedonia', 'norway',
    'oman', 'pakistan', 'palau', 'palestine', 'panama', 'papua new guinea', 'paraguay', 'peru', 'philippines', 'poland', 'portugal',
    'qatar', 'romania', 'russia', 'rwanda',
    'samoa', 'san marino', 'saudi arabia', 'senegal', 'serbia', 'seychelles', 'sierra leone', 'singapore', 'slovakia', 'slovenia', 'somalia', 'south africa', 'south korea', 'spain', 'sri lanka', 'sudan', 'suriname', 'sweden', 'switzerland', 'syria',
    'taiwan', 'tajikistan', 'tanzania', 'thailand', 'togo', 'tonga', 'trinidad and tobago', 'tunisia', 'turkey', 'turkmenistan', 'tuvalu',
    'uganda', 'ukraine', 'united arab emirates', 'united kingdom', 'united states', 'uruguay', 'uzbekistan',
    'vanuatu', 'vatican city', 'venezuela', 'vietnam', 'yemen', 'zambia', 'zimbabwe',
  ],
  fruit: [
    'apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blueberry', 'boysenberry',
    'cantaloupe', 'cherry', 'clementine', 'coconut', 'cranberry', 'currant',
    'date', 'dragonfruit', 'durian', 'elderberry', 'fig', 'grape', 'grapefruit', 'guava', 'honeydew',
    'jackfruit', 'kiwi', 'kumquat', 'lemon', 'lime', 'lingonberry', 'longan', 'loquat', 'lychee',
    'mandarin', 'mango', 'mulberry', 'nectarine', 'orange', 'papaya', 'passionfruit', 'peach', 'pear', 'persimmon', 'pineapple', 'plantain', 'plum', 'pomegranate', 'pomelo',
    'quince', 'raspberry', 'starfruit', 'strawberry', 'tangerine', 'ugli fruit', 'watermelon',
  ],
  vegetable: [
    'artichoke', 'arugula', 'asparagus', 'beet', 'beetroot', 'bell pepper', 'broccoli', 'brussels sprout',
    'cabbage', 'carrot', 'cauliflower', 'celery', 'chard', 'collard greens', 'corn', 'cucumber',
    'eggplant', 'fennel', 'garlic', 'ginger', 'green bean', 'kale', 'leek', 'lentil', 'lettuce', 'lima bean',
    'mushroom', 'okra', 'onion', 'parsnip', 'pea', 'pepper', 'potato', 'pumpkin',
    'radish', 'rhubarb', 'rutabaga', 'shallot', 'spinach', 'squash', 'sweet potato', 'tomato', 'turnip', 'yam', 'zucchini',
  ],
  color: [
    'amber', 'amethyst', 'apricot', 'aqua', 'aquamarine', 'azure',
    'beige', 'black', 'blue', 'bronze', 'brown', 'burgundy',
    'cerulean', 'charcoal', 'chartreuse', 'chocolate', 'cobalt', 'copper', 'coral', 'cream', 'crimson', 'cyan',
    'denim', 'emerald', 'fuchsia', 'gold', 'golden', 'gray', 'green',
    'indigo', 'ivory', 'jade', 'khaki', 'lavender', 'lemon', 'lilac', 'lime',
    'magenta', 'maroon', 'mauve', 'mint', 'mustard', 'navy', 'navy blue',
    'ochre', 'olive', 'orange', 'orchid', 'peach', 'periwinkle', 'pink', 'platinum', 'plum', 'purple',
    'red', 'rose', 'ruby', 'rust', 'saffron', 'salmon', 'sapphire', 'scarlet', 'silver', 'slate', 'tan', 'teal', 'turquoise',
    'ultramarine', 'vermilion', 'violet', 'white', 'yellow',
  ],
  sport: [
    'archery', 'badminton', 'baseball', 'basketball', 'biathlon', 'bobsleigh', 'boxing',
    'canoeing', 'cricket', 'curling', 'cycling', 'darts', 'diving', 'dodgeball',
    'fencing', 'figure skating', 'football', 'golf', 'gymnastics',
    'handball', 'hockey', 'ice hockey', 'judo', 'karate', 'kayaking',
    'lacrosse', 'luge', 'marathon', 'motocross', 'motorcycling', 'mountaineering',
    'netball', 'paddle tennis', 'paintball', 'polo',
    'rowing', 'rugby', 'sailing', 'skateboarding', 'skiing', 'snowboarding', 'soccer', 'squash', 'surfing', 'swimming',
    'table tennis', 'taekwondo', 'tennis', 'track and field', 'triathlon',
    'volleyball', 'water polo', 'weightlifting', 'wrestling',
  ],
  profession: [
    'accountant', 'actor', 'actress', 'architect', 'artist', 'astronaut', 'astronomer', 'author',
    'baker', 'banker', 'barber', 'bartender', 'biologist', 'blacksmith', 'bricklayer', 'butcher',
    'carpenter', 'chef', 'chemist', 'clerk', 'coach', 'dentist', 'detective', 'doctor', 'driver',
    'electrician', 'engineer', 'farmer', 'firefighter', 'fisherman', 'florist',
    'gardener', 'geologist', 'hairdresser', 'historian', 'illustrator',
    'janitor', 'journalist', 'judge', 'lawyer', 'librarian', 'lifeguard', 'locksmith',
    'mechanic', 'miner', 'musician', 'nurse', 'optometrist', 'painter', 'pharmacist', 'photographer', 'physician', 'pilot', 'plumber', 'police', 'policeman', 'politician', 'priest', 'professor', 'programmer',
    'reporter', 'sailor', 'scientist', 'sculptor', 'singer', 'soldier', 'surgeon',
    'tailor', 'teacher', 'technician', 'therapist', 'veterinarian', 'vet', 'waiter', 'waitress', 'welder', 'writer',
  ],
  instrument: [
    'accordion', 'bagpipe', 'banjo', 'bass', 'bassoon', 'bongo', 'bugle',
    'cello', 'clarinet', 'cornet', 'cymbal', 'didgeridoo', 'drum',
    'flute', 'french horn', 'guitar', 'harmonica', 'harp', 'harpsichord',
    'lute', 'lyre', 'mandolin', 'marimba', 'oboe', 'ocarina', 'organ',
    'piano', 'piccolo', 'recorder', 'saxophone', 'sitar', 'synthesizer',
    'tambourine', 'timpani', 'trombone', 'trumpet', 'tuba', 'ukulele', 'viola', 'violin', 'xylophone', 'zither',
  ],
  capital: [
    'abu dhabi', 'abuja', 'accra', 'addis ababa', 'amman', 'amsterdam', 'ankara', 'antananarivo', 'apia', 'ashgabat', 'asmara', 'astana', 'asuncion', 'athens',
    'baghdad', 'baku', 'bamako', 'bangkok', 'bangui', 'banjul', 'bastia', 'beijing', 'beirut', 'belgrade', 'berlin', 'bern', 'bishkek', 'bogota', 'brasilia', 'bratislava', 'brazzaville', 'bridgetown', 'brussels', 'bucharest', 'budapest', 'buenos aires',
    'cairo', 'canberra', 'caracas', 'castries', 'chisinau', 'colombo', 'conakry', 'copenhagen',
    'dakar', 'damascus', 'dhaka', 'dili', 'djibouti', 'dodoma', 'doha', 'dublin', 'dushanbe',
    'freetown', 'gaborone', 'georgetown', 'guatemala city',
    'hanoi', 'harare', 'havana', 'helsinki', 'honiara',
    'islamabad', 'jakarta', 'jerusalem', 'juba',
    'kabul', 'kampala', 'kathmandu', 'khartoum', 'kigali', 'kingston', 'kinshasa', 'kuala lumpur', 'kuwait city', 'kyiv',
    'la paz', 'libreville', 'lilongwe', 'lima', 'lisbon', 'ljubljana', 'lome', 'london', 'luanda', 'lusaka', 'luxembourg',
    'madrid', 'majuro', 'malabo', 'male', 'managua', 'manama', 'manila', 'maputo', 'maseru', 'minsk', 'mogadishu', 'monaco', 'monrovia', 'montevideo', 'moroni', 'moscow', 'muscat',
    'nairobi', 'nassau', 'naypyidaw', 'n\'djamena', 'new delhi', 'niamey', 'nicosia', 'nouakchott', 'nukualofa', 'oslo', 'ottawa',
    'panama city', 'paramaribo', 'paris', 'phnom penh', 'podgorica', 'port louis', 'port moresby', 'port-au-prince', 'prague', 'praia', 'pretoria', 'pristina', 'pyongyang',
    'quito', 'rabat', 'reykjavik', 'riga', 'riyadh', 'rome', 'roseau',
    'san jose', 'san marino', 'san salvador', 'sanaa', 'santiago', 'santo domingo', 'sarajevo', 'seoul', 'singapore', 'skopje', 'sofia', 'stockholm', 'suva',
    'taipei', 'tallinn', 'tashkent', 'tbilisi', 'tegucigalpa', 'tehran', 'thimphu', 'tirana', 'tokyo', 'tripoli', 'tunis',
    'ulaanbaatar', 'vaduz', 'valletta', 'vatican city', 'victoria', 'vienna', 'vientiane', 'vilnius',
    'warsaw', 'washington', 'washington dc', 'wellington', 'windhoek',
    'yaounde', 'yerevan', 'zagreb',
  ],
  element: [
    'actinium', 'aluminum', 'americium', 'antimony', 'argon', 'arsenic', 'astatine',
    'barium', 'berkelium', 'beryllium', 'bismuth', 'bohrium', 'boron', 'bromine',
    'cadmium', 'calcium', 'californium', 'carbon', 'cerium', 'cesium', 'chlorine', 'chromium', 'cobalt', 'copernicium', 'copper', 'curium',
    'darmstadtium', 'dubnium', 'dysprosium',
    'einsteinium', 'erbium', 'europium',
    'fermium', 'flerovium', 'fluorine', 'francium',
    'gadolinium', 'gallium', 'germanium', 'gold',
    'hafnium', 'hassium', 'helium', 'holmium', 'hydrogen',
    'indium', 'iodine', 'iridium', 'iron',
    'krypton', 'lanthanum', 'lawrencium', 'lead', 'lithium', 'livermorium', 'lutetium',
    'magnesium', 'manganese', 'meitnerium', 'mendelevium', 'mercury', 'molybdenum', 'moscovium',
    'neodymium', 'neon', 'neptunium', 'nickel', 'nihonium', 'niobium', 'nitrogen', 'nobelium',
    'oganesson', 'osmium', 'oxygen',
    'palladium', 'phosphorus', 'platinum', 'plutonium', 'polonium', 'potassium', 'praseodymium', 'promethium', 'protoactinium',
    'radium', 'radon', 'rhenium', 'rhodium', 'roentgenium', 'rubidium', 'ruthenium', 'rutherfordium',
    'samarium', 'scandium', 'seaborgium', 'selenium', 'silicon', 'silver', 'sodium', 'strontium', 'sulfur',
    'tantalum', 'technetium', 'tellurium', 'tennessine', 'terbium', 'thallium', 'thorium', 'thulium', 'tin', 'titanium', 'tungsten',
    'uranium', 'vanadium', 'xenon', 'ytterbium', 'yttrium', 'zinc', 'zirconium',
  ],
  flower: [
    'anemone', 'aster', 'azalea', 'begonia', 'buttercup', 'camellia', 'carnation', 'chrysanthemum', 'clover', 'crocus',
    'daffodil', 'dahlia', 'daisy', 'dandelion', 'edelweiss', 'forget-me-not', 'freesia', 'gardenia', 'geranium', 'gladiolus',
    'hibiscus', 'hyacinth', 'hydrangea', 'iris', 'jasmine', 'lavender', 'lilac', 'lily', 'lotus', 'lupine',
    'magnolia', 'marigold', 'morning glory', 'narcissus', 'orchid', 'pansy', 'peony', 'petunia', 'poppy', 'primrose',
    'rose', 'snapdragon', 'sunflower', 'tulip', 'violet', 'water lily', 'zinnia',
  ],
  bird: [
    'albatross', 'blackbird', 'bluejay', 'canary', 'cardinal', 'chickadee', 'crane', 'crow', 'cuckoo',
    'dove', 'duck', 'eagle', 'egret', 'falcon', 'finch', 'flamingo', 'goose', 'gull', 'hawk', 'heron', 'hummingbird',
    'ibis', 'jay', 'kingfisher', 'kiwi', 'lark', 'loon', 'lorikeet', 'lovebird', 'magpie', 'mallard', 'mockingbird',
    'nightingale', 'ostrich', 'owl', 'parakeet', 'parrot', 'peacock', 'pelican', 'penguin', 'pheasant', 'pigeon', 'puffin',
    'quail', 'raven', 'robin', 'seagull', 'sparrow', 'starling', 'stork', 'swallow', 'swan', 'toucan', 'turkey', 'vulture', 'woodpecker',
  ],
  food: [
    'apple', 'bacon', 'bagel', 'bread', 'burger', 'burrito', 'cake', 'cheese', 'chicken', 'cookie', 'curry',
    'donut', 'dumpling', 'egg', 'falafel', 'fish', 'fries', 'hotdog', 'ice cream', 'lasagna', 'lobster',
    'meatball', 'nachos', 'noodles', 'omelette', 'pancake', 'pasta', 'pie', 'pizza', 'quesadilla', 'ramen', 'rice',
    'salad', 'sandwich', 'sausage', 'soup', 'steak', 'sushi', 'taco', 'toast', 'waffle',
  ],
  clothing: [
    'apron', 'belt', 'blazer', 'blouse', 'boots', 'cap', 'cardigan', 'coat', 'dress', 'gloves', 'hat', 'hoodie',
    'jacket', 'jeans', 'jumper', 'kimono', 'leggings', 'mittens', 'pants', 'poncho', 'robe', 'sandals', 'scarf',
    'shirt', 'shoes', 'shorts', 'skirt', 'slippers', 'socks', 'suit', 'sweater', 'swimsuit', 'tie', 'tights',
    'trousers', 't-shirt', 'underwear', 'vest',
  ],
  river: [
    'amazon', 'colorado', 'congo', 'danube', 'ebro', 'elbe', 'euphrates', 'ganges', 'hudson', 'indus',
    'lena', 'loire', 'mackenzie', 'mekong', 'mississippi', 'missouri', 'niger', 'nile', 'ob', 'orinoco',
    'parana', 'potomac', 'rhine', 'rhone', 'rio grande', 'saint lawrence', 'seine', 'tagus', 'thames', 'tiber', 'tigris',
    'ural', 'volga', 'yangtze', 'yellow river', 'yenisei', 'yukon', 'zambezi',
  ],
  videogame: [
    'apex legends', 'assassin\'s creed', 'bioshock', 'call of duty', 'celeste', 'cyberpunk', 'dark souls', 'destiny',
    'diablo', 'doom', 'dota', 'elden ring', 'fallout', 'final fantasy', 'fortnite', 'god of war', 'grand theft auto',
    'halo', 'half-life', 'hollow knight', 'league of legends', 'mario', 'minecraft', 'overwatch', 'pac-man', 'pokemon',
    'portal', 'red dead redemption', 'resident evil', 'roblox', 'skyrim', 'sonic', 'street fighter', 'super mario',
    'tetris', 'the legend of zelda', 'the witcher', 'tomb raider', 'uncharted', 'valorant', 'world of warcraft',
  ],
  famous_person: [
    'abraham lincoln', 'albert einstein', 'alexander the great', 'aristotle', 'barack obama', 'beyonce', 'bill gates',
    'cleopatra', 'cristiano ronaldo', 'charles darwin', 'elvis presley', 'george washington', 'isaac newton', 'julius caesar',
    'leonardo da vinci', 'lionel messi', 'ludwig van beethoven', 'mahatma gandhi', 'michael jackson', 'muhammad ali',
    'nelson mandela', 'napoleon bonaparte', 'oprah winfrey', 'queen elizabeth', 'steve jobs', 'taylor swift', 'vincent van gogh',
    'william shakespeare', 'walt disney', 'wolfgang amadeus mozart',
  ],
};

function computeLevenshtein(a: string, b: string): number {
  const s1 = a.trim().toLowerCase().slice(0, MAX_ANSWER_LENGTH);
  const s2 = b.trim().toLowerCase().slice(0, MAX_ANSWER_LENGTH);
  const dp: number[][] = Array.from({ length: s1.length + 1 }, () =>
    Array(s2.length + 1).fill(0)
  );

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[s1.length][s2.length];
}

function lookupCategory(categoryId: string): string[] | undefined {
  // Own-property check: ids like "__proto__"/"constructor" must never reach Object.prototype.
  return Object.prototype.hasOwnProperty.call(CATEGORY_DATABASE, categoryId)
    ? CATEGORY_DATABASE[categoryId]
    : undefined;
}

export function getSampleAnswer(categoryId: string, targetLetter: string): string {
  const dbList = lookupCategory(categoryId);
  const char = targetLetter.toUpperCase();
  if (Array.isArray(dbList)) {
    const matching = dbList.filter((item) => item.toUpperCase().startsWith(char));
    if (matching.length > 0) {
      const pick = matching[0];
      return pick.charAt(0).toUpperCase() + pick.slice(1);
    }
  }
  return `${char}...`;
}

// Check if a word is valid for a category, grading spelling accuracy and providing correct answers
export function verifyCategoryAnswer(
  categoryId: string,
  rawAnswer: string,
  targetLetter: string
): {
  isValid: boolean;
  score: number;
  message: string;
  correctedSpelling: string | null;
  correctAnswer: string | null;
} {
  const trimmed = String(rawAnswer ?? '').trim().slice(0, MAX_ANSWER_LENGTH);
  const clean = trimmed.toLowerCase();
  const upperTarget = targetLetter.trim().toUpperCase();
  const categoryLabel = categoryId.replace('_', ' ');
  const sampleAnswer = getSampleAnswer(categoryId, upperTarget);

  // 1. Empty check
  if (!clean) {
    return {
      isValid: false,
      score: 0,
      message: `Mind went blank? A correct answer would be: "${sampleAnswer}".`,
      correctedSpelling: null,
      correctAnswer: sampleAnswer,
    };
  }

  // 2. Starting letter check
  const firstLetter = clean.charAt(0).toUpperCase();
  if (firstLetter !== upperTarget) {
    return {
      isValid: false,
      score: 0,
      message: `Starts with "${firstLetter}", but target letter is "${upperTarget}". Correct answer: "${sampleAnswer}".`,
      correctedSpelling: null,
      correctAnswer: sampleAnswer,
    };
  }

  // 3. Length sanity check
  if (clean.length < 2) {
    return {
      isValid: false,
      score: 0,
      message: `Too short to be a valid ${categoryLabel}! Correct answer: "${sampleAnswer}".`,
      correctedSpelling: null,
      correctAnswer: sampleAnswer,
    };
  }

  // 4. Slang / internet acronym check
  // Exception: 'league of legends' can be 'lol' ONLY if category is videogame
  if (SLANG_BLACKLIST.has(clean)) {
    if (categoryId === 'videogame' && (clean === 'lol' || clean === 'cod' || clean === 'gta' || clean === 'wow')) {
      const fullTitle =
        clean === 'lol'
          ? 'League of Legends'
          : clean === 'cod'
          ? 'Call of Duty'
          : clean === 'gta'
          ? 'Grand Theft Auto'
          : 'World of Warcraft';
      return {
        isValid: true,
        score: 8, // slight deduction for abbreviation instead of full title
        message: `Accepted gaming abbreviation for "${fullTitle}" (8/10 pts).`,
        correctedSpelling: fullTitle,
        correctAnswer: fullTitle,
      };
    }

    return {
      isValid: false,
      score: 0,
      message: `"${trimmed.toUpperCase()}" is internet slang, not a ${categoryLabel}! Correct answer: "${sampleAnswer}".`,
      correctedSpelling: null,
      correctAnswer: sampleAnswer,
    };
  }

  // 5. Database check with spelling distance scoring
  const dbList = lookupCategory(categoryId);
  if (Array.isArray(dbList)) {
    // 5a. Exact match -> Full 10 points
    const exactMatch = dbList.find((item) => item.toLowerCase() === clean);
    if (exactMatch) {
      const proper = exactMatch.charAt(0).toUpperCase() + exactMatch.slice(1);
      return {
        isValid: true,
        score: 10,
        message: `Spot on! Perfect spelling: "${proper}" (+10 pts).`,
        correctedSpelling: proper !== trimmed ? proper : null,
        correctAnswer: proper,
      };
    }

    // 5b. Word boundary match (e.g. "blue whale" in animal)
    const partialMatch = dbList.find(
      (item) => item.includes(clean) || clean.includes(item)
    );
    if (partialMatch && clean.length >= 3) {
      const proper = partialMatch.charAt(0).toUpperCase() + partialMatch.slice(1);
      return {
        isValid: true,
        score: 10,
        message: `Accepted! "${proper}" matches ${categoryLabel} (+10 pts).`,
        correctedSpelling: proper,
        correctAnswer: proper,
      };
    }

    // 5c. Closest spelling search among category items starting with target letter
    const matchingLetterItems = dbList.filter((item) =>
      item.toUpperCase().startsWith(upperTarget)
    );

    let bestItem: string | null = null;
    let minDistance = 999;

    for (const item of matchingLetterItems) {
      const dist = computeLevenshtein(clean, item.toLowerCase());
      if (dist < minDistance) {
        minDistance = dist;
        bestItem = item;
      }
    }

    // Minor typo (1 letter difference e.g. "elefant", "aple", "leppord") -> 8 points
    if (bestItem && minDistance === 1) {
      const proper = bestItem.charAt(0).toUpperCase() + bestItem.slice(1);
      return {
        isValid: true,
        score: 8,
        message: `Good recall! Minor spelling error (-2 pts). Correct spelling: "${proper}".`,
        correctedSpelling: proper,
        correctAnswer: proper,
      };
    }

    // Moderate typo (2 letters difference e.g. "crocadile") -> 6 points
    if (bestItem && minDistance === 2 && clean.length >= 5) {
      const proper = bestItem.charAt(0).toUpperCase() + bestItem.slice(1);
      return {
        isValid: true,
        score: 6,
        message: `Close spelling attempt (-4 pts). Correct spelling: "${proper}".`,
        correctedSpelling: proper,
        correctAnswer: proper,
      };
    }

    // For strict taxonomy categories, if not in DB and distance > 2, reject with correct answer
    const strictCategories = ['body_part', 'country', 'element', 'capital', 'color', 'planet'];
    if (strictCategories.includes(categoryId)) {
      return {
        isValid: false,
        score: 0,
        message: `"${trimmed}" is not a recognized ${categoryLabel}. Correct answer: "${sampleAnswer}".`,
        correctedSpelling: null,
        correctAnswer: sampleAnswer,
      };
    }
  }

  // 6. Heuristics for open-ended categories (famous person, etc.)
  if (/^[a-z\s'-]+$/i.test(trimmed)) {
    const vowels = (clean.match(/[aeiouy]/g) || []).length;
    if (clean.length >= 4 && vowels === 0) {
      return {
        isValid: false,
        score: 0,
        message: `"${trimmed}" is not a recognized word. Correct answer: "${sampleAnswer}".`,
        correctedSpelling: null,
        correctAnswer: sampleAnswer,
      };
    }

    const formatted = clean.charAt(0).toUpperCase() + clean.slice(1);
    return {
      isValid: true,
      score: 10,
      message: `Accepted! "${formatted}" for ${categoryLabel} (+10 pts).`,
      correctedSpelling: formatted !== trimmed ? formatted : null,
      correctAnswer: formatted,
    };
  }

  return {
    isValid: false,
    score: 0,
    message: `"${trimmed}" is not recognized for ${categoryLabel}. Correct answer: "${sampleAnswer}".`,
    correctedSpelling: null,
    correctAnswer: sampleAnswer,
  };
}
