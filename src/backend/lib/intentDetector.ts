export type Intent =
  | "NEW_TRIP"
  | "UPDATE_DAY"
  | "ADD_PLACE"
  | "REMOVE_PLACE"
  | "CHANGE_BUDGET"
  | "CHANGE_DURATION"
  | "CHANGE_HOTEL"
  | "CHANGE_RESTAURANT"
  | "ADD_ACTIVITY"
  | "REMOVE_ACTIVITY"
  | "CHANGE_TRANSPORT"
  | "CHANGE_TRAVEL_STYLE"
  | "ASK_QUESTION"
  | "GENERAL_CHAT"
  | "OTHER";

export type BudgetTier = "budget" | "mid" | "premium" | "luxury" | null;
export type TravelerType =
  | "solo"
  | "couple"
  | "family"
  | "friends"
  | "backpacker"
  | "senior"
  | "student"
  | "business"
  | null;

export interface DetectedContext {
  intent: Intent;
  destination: string;
  duration: number | null;
  budgetTier: BudgetTier;
  budgetAmount: number | null;
  travelerType: TravelerType;
  isFollowUp: boolean;
  currentMonth: string;
  extractedUrl?: string | null;
  extractedContent?: string | null;
}

const DESTINATION_PATTERNS: [RegExp, string][] = [
  [/goa/i, "Goa"],
  [/varanasi|banaras|kashi/i, "Varanasi"],
  [/kerala|god's\s*own\s*country/i, "Kerala"],
  [/udaipur|city\s*of\s*lakes/i, "Udaipur"],
  [/rajasthan/i, "Rajasthan"],
  [/himachal|manali|shimla|dharamshala|dalhousie/i, "Himachal"],
  [/ladakh|leh/i, "Ladakh"],
  [/delhi/i, "Delhi"],
  [/mumbai|bombay/i, "Mumbai"],
  [/jaipur|pink\s*city/i, "Jaipur"],
  [/agra|taj/i, "Agra"],
  [/kashmir|srinagar|gulmarg|pahalgam/i, "Kashmir"],
  [/andaman|port\s*blair|havelock/i, "Andaman"],
  [/munnar|wayanad|coorg/i, "Munnar"],
  [/hampi/i, "Hampi"],
  [/kutch|gujarat/i, "Kutch"],
  [/cherrapunji|shillong|meghalaya/i, "Cherrapunji"],
  [/jaisalmer|golden\s*city/i, "Jaisalmer"],
  [/rishikesh|haridwar|yoga|ashram/i, "Rishikesh"],
  [/bodh\s*gaya|bihar/i, "Bodh Gaya"],
  [/amritsar|golden\s*temple/i, "Amritsar"],
  [/pondicherry|puducherry/i, "Pondicherry"],
  [/chennai|madras/i, "Chennai"],
  [/bangalore|bengaluru/i, "Bangalore"],
  [/hyderabad/i, "Hyderabad"],
  [/kolkata|calcutta/i, "Kolkata"],
  [/darjeeling|siliguri/i, "Darjeeling"],
];

const TRAVELER_PATTERNS: [RegExp, TravelerType][] = [
  [/solo|alone|single|by\s*myself|just\s*me/i, "solo"],
  [/couple|honeymoon|romantic|two\s*of\s*us|partner|girlfriend|boyfriend|wife|husband/i, "couple"],
  [/family|kids|children|wife|husband|baby|toddler/i, "family"],
  [/friends|group\s*of|gang|buddies|crew/i, "friends"],
  [/backpacker|backpacking|hostel|dorm/i, "backpacker"],
  [/senior|elderly|parents|old\s*age/i, "senior"],
  [/student|college|hostel\s*life|budget/i, "student"],
  [/business|work\s*trip|corporate|conference|office/i, "business"],
];

const BUDGET_PATTERNS: [RegExp, BudgetTier][] = [
  [/(?:under|less\s*than|below|max)\s*(?:₹|rs\.?\s*)?(\d+[,]*\d*)/i, "budget"],
  [/(?:₹|rs\.?\s*)(\d+[,]*\d*)/i, null],
];

const DURATION_PATTERN = /(\d+)\s*(?:-|\s*to\s*)\s*(\d+)\s*days?|(\d+)\s*(?:-|\s*)\s*days?/i;

const IGNORED_WORDS = new Set([
  "plan", "plans", "pan", "trip", "trips", "road", "day", "days", "to", "in", "for", 
  "from", "with", "my", "our", "a", "an", "the", "go", "travel", "explore", "visit", 
  "itinerary", "itineraries", "stay", "hotel", "hotels", "budget", "cheapest", "cheap", 
  "luxury", "premium", "yes", "no", "ok", "okay", "please", "thanks", "thank", "hello", 
  "hi", "hey", "planning", "generator", "generate", "details", "info", "information",
  "and", "or", "but", "so", "make", "it", "more", "less", "do"
]);

function cleanPlaceName(name: string): string {
  let cleaned = name.replace(/\b(trip|plan|plans|pan|road|day|days|to|in|for|from|with|my|our|a|an|the|go|travel|explore|visit|itinerary|itineraries|stay|hotel|hotels|budget|cheapest|cheap|luxury|premium|yes|no|ok|okay|please|thanks|thank|hello|hi|hey|planning|generator|generate|details|info|information|and|or|but|so|make|it|more|less|do)\b/gi, "").trim();
  if (!cleaned) return "";

  if (/^\d+$/.test(cleaned) || cleaned.length <= 1 || IGNORED_WORDS.has(cleaned.toLowerCase())) {
    return "";
  }

  return cleaned
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function extractPlace(text: string, fallback = "Goa"): string {
  for (const [re, name] of DESTINATION_PATTERNS) {
    if (re.test(text)) return name;
  }

  const patterns = [
    /trip to\s+([a-z\s]+)/i,
    /go to\s+([a-z\s]+)/i,
    /travel to\s+([a-z\s]+)/i,
    /explore\s+([a-z\s]+)/i,
    /\d+\s*days?\s+(?:road\s+)?(?:trip\s+)?(?:to\s+)?([a-z\s]+)\s+trip/i,
    /\d+\s*days?\s+(?:road\s+)?(?:trip\s+)?(?:to|in|for)\s+([a-z\s]+)/i,
    /\d+\s*days?\s+(?:road\s+)?(?:trip\s+)?(?:to\s+)?([a-z\s]+)/i,
    /plan\s+(?:a\s+)?([a-z\s]+)\s+trip/i,
    /([a-z\s]+)\s+trip/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = cleanPlaceName(match[1]);
      if (cleaned) return cleaned;
    }
  }

  const words = text.trim().split(/\s+/);
  if (words.length <= 2 && !/trip|plan|hello|hi|thanks/i.test(text)) {
    const cleaned = cleanPlaceName(text);
    if (cleaned) return cleaned;
  }

  return fallback;
}

export function extractIntent(text: string, isFollowUp: boolean): Intent {
  const low = text.toLowerCase().trim();

  // GENERAL_CHAT: standard greetings/thanks
  if (/^(hi|hello|hey|greetings|thanks|thank you|ty|good morning|good evening|how's it going|how are you)\b/i.test(low)) {
    return "GENERAL_CHAT";
  }

  // NEW_TRIP
  if (!isFollowUp || /plan\s+(?:a\s+)?new\s+trip|start\s+(?:over|fresh|new)|generate\s+(?:a\s+)?new\s+itinerary|plan\s+(?:a\s+)?trip\s+to/i.test(low)) {
    return "NEW_TRIP";
  }

  // REMOVE_PLACE
  if (/\b(?:remove|delete|exclude|skip|don't\s+visit)\s+(?:place|destination|spot|beaches?|hotels?|restaurants?)/i.test(low) || /remove\s+(?:from\s+)?day\s+\d+/i.test(low)) {
    return "REMOVE_PLACE";
  }

  // ADD_PLACE
  if (/\b(?:add|include|insert|visit)\s+(?:place|destination|spot|beaches?)/i.test(low) || /\b(?:add|include|visit)\s+([a-z\s]+)\bto\b/i.test(low)) {
    return "ADD_PLACE";
  }

  // REMOVE_ACTIVITY
  if (/\b(?:remove|delete|skip|exclude|don't\s+do)\s+(?:water\s*sports|trek|hiking|rafting|safari|tour|activity|activities|ride|boating|sightseeing)/i.test(low)) {
    return "REMOVE_ACTIVITY";
  }

  // ADD_ACTIVITY
  if (/\b(?:add|include|do)\s+(?:water\s*sports|trek|hiking|rafting|safari|tour|activity|activities|ride|boating|sightseeing)/i.test(low) || /add\s+activity/i.test(low)) {
    return "ADD_ACTIVITY";
  }

  // UPDATE_DAY — must precede CHANGE_HOTEL/CHANGE_RESTAURANT so "on day N, change hotels" is classified as UPDATE_DAY
  if (/\b(?:update|change|modify|edit|redo|adjust)\s+day\s+\d+/i.test(low) || /\bon\s+day\s+\d+/i.test(low)) {
    return "UPDATE_DAY";
  }

  // CHANGE_HOTEL
  if (/\b(?:change|update|replace|different|other|recommend|suggest)\s+(?:[a-z]+\s+)?(?:hotels?|stay|accommodation|resorts?|guesthouse|hostels?)/i.test(low) || /stay\s+somewhere\s+else/i.test(low) || (/\b(?:hotels?|resorts?|hostels?|accommodation)\b/i.test(low) && (low.includes("change") || low.includes("other") || low.includes("different") || low.includes("stay") || low.includes("recommend") || low.includes("suggest")))) {
    return "CHANGE_HOTEL";
  }

  // CHANGE_RESTAURANT
  if (/\b(?:change|update|replace|different|other|recommend|suggest)\s+(?:[a-z]+\s+)?(?:restaurants?|cafes?|eatery|eateries|dining)/i.test(low) || (/\b(?:restaurants?|cafes?|eateries|eats?)\b/i.test(low) && (low.includes("change") || low.includes("other") || low.includes("different") || low.includes("food") || low.includes("recommend") || low.includes("suggest") || low.includes("dining")))) {
    return "CHANGE_RESTAURANT";
  }

  // CHANGE_BUDGET
  if (/\b(?:budget|cost|price|expensive|cheap|cheaper|luxury|increase|decrease|make\s+it|budget\s+limit|₹|rs\.?)\b/i.test(low) && (low.includes("budget") || low.includes("cheaper") || low.includes("expensive") || low.includes("cost") || low.includes("price") || /₹|rs/i.test(low))) {
    return "CHANGE_BUDGET";
  }

  // CHANGE_DURATION
  if (/\b(?:days|duration|length|extend|shorten|make\s+it|trip\s+for)\b/i.test(low) && (/\d+\s*days?/i.test(low) || low.includes("duration") || low.includes("days") || low.includes("extend") || low.includes("shorten"))) {
    return "CHANGE_DURATION";
  }

  // CHANGE_TRANSPORT
  if (/\b(?:car|cab|taxi|flight|plane|train|bus|bike|drive|transport|mode\s+of\s+travel|travel\s+by|go\s+by)\b/i.test(low)) {
    return "CHANGE_TRANSPORT";
  }

  // CHANGE_TRAVEL_STYLE
  if (/\b(?:luxury|relaxed|fast-paced|slow-paced|comfort|backpacking|adventure|honeymoon|family|style|theme|vibe)\b/i.test(low)) {
    return "CHANGE_TRAVEL_STYLE";
  }

  // ASK_QUESTION
  if (/^(what|how|where|when|why|who|is\s+it|can\s+we|do\s+we|should|any|are\s+there)\b/i.test(low) || low.includes("?") || low.includes("dress code") || low.includes("safe") || low.includes("weather") || low.includes("pack")) {
    return "ASK_QUESTION";
  }


  return "OTHER";
}

function extractTravelerType(text: string): TravelerType {
  for (const [re, type] of TRAVELER_PATTERNS) {
    if (re.test(text)) return type;
  }
  return null;
}

function extractBudget(text: string): { tier: BudgetTier; amount: number | null } {
  const amounts: number[] = [];

  const amountRegex = /(?:[₹₹]|inr|rs\.?\s*)(\d[\d,]*)/gi;
  let match: RegExpExecArray | null;
  while ((match = amountRegex.exec(text)) !== null) {
    amounts.push(parseInt(match[1].replace(/,/g, ""), 10));
  }

  const lakhMatch = text.match(/(\d+)\s*lakh/i);
  if (lakhMatch) amounts.push(parseInt(lakhMatch[1], 10) * 100000);

  const croreMatch = text.match(/(\d+)\s*crore/i);
  if (croreMatch) amounts.push(parseInt(croreMatch[1], 10) * 10000000);

  const kMatch = text.match(/(\d+)\s*k\b/i);
  if (kMatch) amounts.push(parseInt(kMatch[1], 10) * 1000);

  const thousandMatch = text.match(/(\d+)\s*thousand/i);
  if (thousandMatch) amounts.push(parseInt(thousandMatch[1], 10) * 1000);

  if (amounts.length > 0) {
    const maxAmount = Math.max(...amounts);
    let tier: BudgetTier;
    if (maxAmount < 10000) tier = "budget";
    else if (maxAmount < 25000) tier = "mid";
    else if (maxAmount < 50000) tier = "premium";
    else tier = "luxury";
    return { tier, amount: maxAmount };
  }

  if (/cheap|affordable|low\s*cost|save\s*money|tight\s*budget/i.test(text)) {
    return { tier: "budget", amount: null };
  }

  if (/luxury|premium|high\s*end|5\s*star|5star|lavish|opulent/i.test(text)) {
    return { tier: "luxury", amount: null };
  }

  return { tier: null, amount: null };
}

function extractDuration(text: string): number | null {
  const low = text.toLowerCase();

  if (/\b(?:one|single)[- ]day\b/i.test(low)) return 1;
  if (/\btwo[- ]day\b/i.test(low)) return 2;
  if (/\bthree[- ]day\b/i.test(low)) return 3;
  if (/\bfour[- ]day\b/i.test(low)) return 4;
  if (/\bfive[- ]day\b/i.test(low)) return 5;
  if (/\bsix[- ]day\b/i.test(low)) return 6;
  if (/\bseven[- ]day\b/i.test(low)) return 7;
  if (/\beight[- ]day\b/i.test(low)) return 8;
  if (/\bnine[- ]day\b/i.test(low)) return 9;
  if (/\bten[- ]day\b/i.test(low)) return 10;

  const rangeMatch = /(\d+)\s*(?:-|\s*to\s*)\s*(\d+)\s*days?/i.exec(text);
  if (rangeMatch) {
    return Math.max(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10));
  }

  const singleMatch = /(\d+)\s*(?:-|\s*)\s*days?/i.exec(text);
  if (singleMatch) {
    return parseInt(singleMatch[1], 10);
  }

  if (/\bweekend\b/i.test(low)) {
    return 2;
  }

  return null;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0].replace(/[.,;:!?)]$/, '') : null;
}

function inferDefaultDuration(text: string, destination: string): number {
  const lowText = text.toLowerCase();
  const lowDest = destination.toLowerCase();

  if (lowText.includes("weekend")) {
    return 2;
  }

  if (lowText.includes("road trip") || lowText.includes("roadtrip") || lowText.includes("bike trip")) {
    return 5;
  }

  const internationalPlaces = [
    "europe", "paris", "london", "dubai", "bali", "thailand", "singapore", 
    "switzerland", "maldives", "vietnam", "usa", "uk", "america", "japan", "tokyo",
    "italy", "rome", "spain", "barcelona", "greece", "turkey", "istanbul"
  ];
  const isInternational = internationalPlaces.some(p => lowDest.includes(p) || lowText.includes(p));
  if (isInternational) {
    return 8;
  }

  if (lowDest.includes("goa") || lowText.includes("goa")) {
    return 5;
  }

  return 3;
}

export function detectIntent(
  messages: { role: string; content: string }[],
  hasCurrentTrip = false
): DetectedContext {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMsg = userMessages[userMessages.length - 1]?.content || "";
  const allUserText = userMessages.map((m) => m.content).join(" ");

  const extractFromHistory = <T>(extractor: (text: string) => T | null): T | null => {
    for (let i = userMessages.length - 1; i >= 0; i--) {
      const val = extractor(userMessages[i].content);
      if (val !== null) return val;
    }
    return null;
  };

  const extractDestinationFromHistory = (): string => {
    for (let i = userMessages.length - 1; i >= 0; i--) {
      const place = extractPlace(userMessages[i].content, "");
      if (place) return place;
    }
    return "Goa";
  };

  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isFollowUp = hasCurrentTrip || userMessages.length > 1;
  const destination = extractDestinationFromHistory();
  let duration = extractFromHistory(extractDuration);
  
  if (duration === null) {
    const intent = extractIntent(lastMsg, isFollowUp);
    const isTripQuery = intent === "NEW_TRIP" || lastMsg.toLowerCase().includes("trip") || lastMsg.toLowerCase().includes("plan");
    if (isTripQuery) {
      duration = inferDefaultDuration(allUserText, destination);
    }
  }

  return {
    intent: extractIntent(lastMsg, isFollowUp),
    destination,
    duration,
    budgetTier: extractFromHistory((text) => extractBudget(text).tier),
    budgetAmount: extractFromHistory((text) => extractBudget(text).amount),
    travelerType: extractFromHistory(extractTravelerType),
    isFollowUp,
    currentMonth,
    extractedUrl: extractFromHistory(extractUrl),
  };
}
