export type Intent =
  | "trip_planning"
  | "hotel_recommendation"
  | "food_guide"
  | "budget_planning"
  | "weekend_getaway"
  | "honeymoon"
  | "family_trip"
  | "solo_backpacking"
  | "luxury_travel"
  | "adventure_travel"
  | "pilgrimage"
  | "road_trip"
  | "seasonal_advice"
  | "packing_help"
  | "transport_info"
  | "hidden_gems"
  | "local_culture"
  | "travel_safety"
  | "url_understanding";

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
  /** URL extracted from the user message, if any */
  extractedUrl?: string | null;
}

const INTENT_PATTERNS: [RegExp, Intent][] = [
  [/^https?:\/\/[^\s]+|paste\s*(?:this|the)\s*(?:link|url)|check\s*(?:out|this)\s*(?:link|url)|here['']s\s*(?:a|the)\s*(?:link|url)|found\s*(?:this|a)\s*(?:article|post|video|blog)/i, "url_understanding"],
  [/honeymoon|romantic\s*getaway|couple\s*retreat/i, "honeymoon"],
  [/weekend|short\s*trip|quick\s*getaway|2\s*day/i, "weekend_getaway"],
  [/family\s*trip|kids|children|family\s*vacation/i, "family_trip"],
  [/solo\s*trip|solo\s*backpack|backpacking|backpacker/i, "solo_backpacking"],
  [/luxury|5\s*star|premium|lavish|high\s*end|5star/i, "luxury_travel"],
  [/adventure|trekking|trek|hiking|rafting|paragliding|camping|bungee/i, "adventure_travel"],
  [/pilgrimage|temple|mandir|spiritual|darshan|yatra|pilgrim/i, "pilgrimage"],
  [/road\s*trip|self\s*drive|road\s*travel|driving/i, "road_trip"],
  [/budget\s*trip|budget\s*plan(?:ning)?|tight\s*budget|limited\s*budget|cheap|affordable|low\s*cost|save\s*money|best\s*value/i, "budget_planning"],
  [/hotels?|accommodation|stay|where\s*to\s*stay|resort|lodging/i, "hotel_recommendation"],
  [/food|cuisine|eat|restaurant|dining|street\s*food|what\s*to\s*eat/i, "food_guide"],
  [/weather|season|monsoon|climate|best\s*time|when\s*to\s*visit|forecast/i, "seasonal_advice"],
  [/pack|bring|essentials|what\s*to\s*(pack|wear|bring)/i, "packing_help"],
  [/transport|reach|flight|train|bus|how\s*to\s*(get|reach)|airport/i, "transport_info"],
  [/hidden|offbeat|secret|off\s*the\s*beaten|gem|undiscovered/i, "hidden_gems"],
  [/culture|local\s*customs?|tradition|etiquette|local\s*life/i, "local_culture"],
  [/safe|safety|emergency|scam|avoid|danger|warning/i, "travel_safety"],
];

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
  [/ darjeeling|siliguri/i, "Darjeeling"],
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

function extractPlace(text: string, fallback = "Goa"): string {
  for (const [re, name] of DESTINATION_PATTERNS) {
    if (re.test(text)) return name;
  }

  // Fall back to natural language regex patterns to extract custom places
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

  // Single or double word queries
  const words = text.trim().split(/\s+/);
  if (words.length <= 2 && !/trip|plan|hello|hi|thanks/i.test(text)) {
    const cleaned = cleanPlaceName(text);
    if (cleaned) return cleaned;
  }

  return fallback;
}

const IGNORED_WORDS = new Set([
  "plan", "plans", "pan", "trip", "trips", "road", "day", "days", "to", "in", "for", 
  "from", "with", "my", "our", "a", "an", "the", "go", "travel", "explore", "visit", 
  "itinerary", "itineraries", "stay", "hotel", "hotels", "budget", "cheapest", "cheap", 
  "luxury", "premium", "yes", "no", "ok", "okay", "please", "thanks", "thank", "hello", 
  "hi", "hey", "planning", "generator", "generate", "details", "info", "information",
  "and", "or", "but", "so", "make", "it", "more", "less", "do"
]);

function cleanPlaceName(name: string): string {
  // Remove common travel keywords
  let cleaned = name.replace(/\b(trip|plan|plans|pan|road|day|days|to|in|for|from|with|my|our|a|an|the|go|travel|explore|visit|itinerary|itineraries|stay|hotel|hotels|budget|cheapest|cheap|luxury|premium|yes|no|ok|okay|please|thanks|thank|hello|hi|hey|planning|generator|generate|details|info|information|and|or|but|so|make|it|more|less|do)\b/gi, "").trim();
  if (!cleaned) return "";

  // Reject if it is just a number, single character, or in the ignored set
  if (/^\d+$/.test(cleaned) || cleaned.length <= 1 || IGNORED_WORDS.has(cleaned.toLowerCase())) {
    return "";
  }

  // Capitalize first letters of each word
  return cleaned
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function extractIntent(text: string): Intent {
  for (const [re, intent] of INTENT_PATTERNS) {
    if (re.test(text)) return intent;
  }
  return "trip_planning";
}

function extractTravelerType(text: string): TravelerType {
  for (const [re, type] of TRAVELER_PATTERNS) {
    if (re.test(text)) return type;
  }
  return null;
}

function extractBudget(text: string): { tier: BudgetTier; amount: number | null } {
  const amounts: number[] = [];

  // Phase 1: Find explicit amounts with currency prefixes
  const amountRegex = /(?:[₹₹]|inr|rs\.?\s*)(\d[\d,]*)/gi;
  let match: RegExpExecArray | null;
  while ((match = amountRegex.exec(text)) !== null) {
    amounts.push(parseInt(match[1].replace(/,/g, ""), 10));
  }

  // Phase 2: Indian number words (lakh, crore, thousand, k)
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

  // Phase 3: Quality keywords (no explicit amount found)
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

  // 1. Explicit word-based durations
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

  // 2. Range match with digit (e.g. 3 to 5 days, 3-5 days)
  const rangeMatch = /(\d+)\s*(?:-|\s*to\s*)\s*(\d+)\s*days?/i.exec(text);
  if (rangeMatch) {
    return Math.max(parseInt(rangeMatch[1], 10), parseInt(rangeMatch[2], 10));
  }

  // 3. Single match with digit (supporting hyphen before day, e.g. 7-day, 10 day)
  const singleMatch = /(\d+)\s*(?:-|\s*)\s*days?/i.exec(text);
  if (singleMatch) {
    return parseInt(singleMatch[1], 10);
  }

  // 4. Weekend/getaway detection
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

  // Check if weekend is mentioned
  if (lowText.includes("weekend")) {
    return 2;
  }

  // Check if road trip is mentioned
  if (lowText.includes("road trip") || lowText.includes("roadtrip") || lowText.includes("bike trip")) {
    return 5;
  }

  // Check if international trip destinations
  const internationalPlaces = [
    "europe", "paris", "london", "dubai", "bali", "thailand", "singapore", 
    "switzerland", "maldives", "vietnam", "usa", "uk", "america", "japan", "tokyo",
    "italy", "rome", "spain", "barcelona", "greece", "turkey", "istanbul"
  ];
  const isInternational = internationalPlaces.some(p => lowDest.includes(p) || lowText.includes(p));
  if (isInternational) {
    return 8; // default to 8 days (7-10 range)
  }

  // Specific Goa Leisure Trip defaults to 5 days
  if (lowDest.includes("goa") || lowText.includes("goa")) {
    return 5;
  }

  // Default City Trip -> 3 days
  return 3;
}

export function detectIntent(
  messages: { role: string; content: string }[]
): DetectedContext {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastMsg = userMessages[userMessages.length - 1]?.content || "";
  const allUserText = userMessages.map((m) => m.content).join(" ");

  // Helper to extract a value scanning from latest to oldest user messages
  const extractFromHistory = <T>(extractor: (text: string) => T | null): T | null => {
    for (let i = userMessages.length - 1; i >= 0; i--) {
      const val = extractor(userMessages[i].content);
      if (val !== null) return val;
    }
    return null;
  };

  // Special extraction for destination to ensure we walk backwards
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

  const destination = extractDestinationFromHistory();
  let duration = extractFromHistory(extractDuration);
  
  // If no explicit duration found, apply smart defaults for trip planning intents
  if (duration === null) {
    const intent = extractIntent(lastMsg);
    const isTripQuery = intent === "trip_planning" || intent === "weekend_getaway" || intent === "honeymoon" || intent === "family_trip" || intent === "solo_backpacking" || intent === "luxury_travel" || intent === "adventure_travel" || intent === "pilgrimage" || intent === "road_trip";
    if (isTripQuery || lastMsg.toLowerCase().includes("trip") || lastMsg.toLowerCase().includes("plan")) {
      duration = inferDefaultDuration(allUserText, destination);
    }
  }

  return {
    intent: extractIntent(lastMsg),
    destination,
    duration,
    budgetTier: extractFromHistory((text) => extractBudget(text).tier),
    budgetAmount: extractFromHistory((text) => extractBudget(text).amount),
    travelerType: extractFromHistory(extractTravelerType),
    isFollowUp: userMessages.length > 1,
    currentMonth,
    extractedUrl: extractFromHistory(extractUrl),
  };
}
