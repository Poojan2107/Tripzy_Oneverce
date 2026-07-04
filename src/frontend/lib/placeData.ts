"use client";

export interface PlaceLocation {
  name: string;
  lat: number;
  lng: number;
}

const PLACE_DB: Record<string, PlaceLocation> = {
  // Goa
  "goa": { name: "Goa", lat: 15.4909, lng: 73.8278 },
  "panjim": { name: "Panjim", lat: 15.4909, lng: 73.8278 },
  "calangute beach": { name: "Calangute Beach", lat: 15.5442, lng: 73.7546 },
  "baga beach": { name: "Baga Beach", lat: 15.5584, lng: 73.7533 },
  "anjuna": { name: "Anjuna", lat: 15.5767, lng: 73.7378 },
  "anjuna flea market": { name: "Anjuna Flea Market", lat: 15.5767, lng: 73.7378 },
  "vagator beach": { name: "Vagator Beach", lat: 15.5973, lng: 73.7354 },
  "candolim": { name: "Candolim", lat: 15.5147, lng: 73.7689 },
  "palolem beach": { name: "Palolem Beach", lat: 15.0105, lng: 74.0241 },
  "chapora fort": { name: "Chapora Fort", lat: 15.5983, lng: 73.7347 },
  "fort aguada": { name: "Fort Aguada", lat: 15.4967, lng: 73.7719 },
  "basilica of bom jesus": { name: "Basilica of Bom Jesus", lat: 15.5006, lng: 73.9112 },
  "dudhsagar waterfalls": { name: "Dudhsagar Waterfalls", lat: 15.3175, lng: 74.3141 },
  "fontainhas": { name: "Fontainhas", lat: 15.4985, lng: 73.8274 },
  "butterfly beach": { name: "Butterfly Beach", lat: 15.0056, lng: 74.0094 },
  "cab de rama fort": { name: "Cab de Rama Fort", lat: 14.9981, lng: 73.9762 },
  "agonda beach": { name: "Agonda Beach", lat: 15.0485, lng: 73.9892 },
  "mapusa": { name: "Mapusa", lat: 15.5953, lng: 73.8100 },
  "ponda": { name: "Ponda", lat: 15.4017, lng: 74.0039 },

  // Rajasthan
  "rajasthan": { name: "Rajasthan", lat: 27.0238, lng: 74.2179 },
  "jaipur": { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  "udaipur": { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
  "jaisalmer": { name: "Jaisalmer", lat: 26.9157, lng: 70.9083 },
  "jodhpur": { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  "pushkar": { name: "Pushkar", lat: 26.4917, lng: 74.5511 },
  "ranthambore": { name: "Ranthambore", lat: 26.0173, lng: 76.5026 },
  "hawa mahal": { name: "Hawa Mahal", lat: 26.9239, lng: 75.8267 },
  "amber fort": { name: "Amber Fort", lat: 26.9854, lng: 75.8507 },
  "city palace udaipur": { name: "City Palace Udaipur", lat: 24.5766, lng: 73.6834 },
  "lake pichola": { name: "Lake Pichola", lat: 24.5720, lng: 73.6790 },

  // Varanasi
  "varanasi": { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
  "dashashwamedh ghat": { name: "Dashashwamedh Ghat", lat: 25.3067, lng: 83.0106 },
  "assi ghat": { name: "Assi Ghat", lat: 25.2883, lng: 83.0061 },
  "kashi vishwanath temple": { name: "Kashi Vishwanath Temple", lat: 25.3109, lng: 83.0106 },
  "sarnath": { name: "Sarnath", lat: 25.3780, lng: 83.0240 },

  // Kerala
  "kerala": { name: "Kerala", lat: 10.1632, lng: 76.6413 },
  "kochi": { name: "Kochi", lat: 9.9816, lng: 76.2993 },
  "munnar": { name: "Munnar", lat: 10.0889, lng: 77.0595 },
  "alleppey": { name: "Alleppey", lat: 9.4981, lng: 76.3388 },
  "thekkady": { name: "Thekkady", lat: 9.6031, lng: 77.1614 },
  "kovalam": { name: "Kovalam", lat: 8.4004, lng: 76.9787 },
  "varkala": { name: "Varkala", lat: 8.7333, lng: 76.7167 },
  "wayanad": { name: "Wayanad", lat: 11.6854, lng: 76.1320 },

  // Himachal
  "himachal": { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  "shimla": { name: "Shimla", lat: 31.1048, lng: 77.1734 },
  "manali": { name: "Manali", lat: 32.2432, lng: 77.1892 },
  "dharamshala": { name: "Dharamshala", lat: 32.2190, lng: 76.3234 },
  "mcleodganj": { name: "McLeodganj", lat: 32.2427, lng: 76.3243 },
  "kasol": { name: "Kasol", lat: 32.0100, lng: 77.3150 },
  "kullu": { name: "Kullu", lat: 31.9587, lng: 77.1088 },
  "dalhousie": { name: "Dalhousie", lat: 32.5522, lng: 75.9775 },
  "kheerganga": { name: "Kheerganga", lat: 31.9946, lng: 77.3486 },
  "bir": { name: "Bir", lat: 32.0449, lng: 76.7194 },

  // Ladakh
  "ladakh": { name: "Ladakh", lat: 34.1526, lng: 77.5771 },
  "leh": { name: "Leh", lat: 34.1526, lng: 77.5771 },
  "pangong tso": { name: "Pangong Tso", lat: 33.7230, lng: 78.7617 },
  "nubra valley": { name: "Nubra Valley", lat: 34.6802, lng: 77.5556 },
  "khardung la": { name: "Khardung La", lat: 34.2738, lng: 77.6046 },
  "tsomoriri": { name: "Tso Moriri", lat: 32.9008, lng: 78.3058 },

  // Delhi / Agra
  "delhi": { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  "new delhi": { name: "New Delhi", lat: 28.6142, lng: 77.2000 },
  "agra": { name: "Agra", lat: 27.1767, lng: 78.0081 },
  "taj mahal": { name: "Taj Mahal", lat: 27.1751, lng: 78.0421 },
  "red fort": { name: "Red Fort", lat: 28.6562, lng: 77.2410 },
  "qutub minar": { name: "Qutub Minar", lat: 28.5245, lng: 77.1855 },
  "india gate": { name: "India Gate", lat: 28.6129, lng: 77.2295 },
  "chandni chowk": { name: "Chandni Chowk", lat: 28.6573, lng: 77.2307 },

  // Mumbai
  "mumbai": { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  "gateway of india": { name: "Gateway of India", lat: 18.9220, lng: 72.8347 },
  "marine drive": { name: "Marine Drive", lat: 18.9430, lng: 72.8235 },
  "colaba": { name: "Colaba", lat: 18.9067, lng: 72.8147 },
  "juhu beach": { name: "Juhu Beach", lat: 19.0884, lng: 72.8262 },

  // Karnataka
  "hampi": { name: "Hampi", lat: 15.3350, lng: 76.4600 },
  "virupaksha temple": { name: "Virupaksha Temple", lat: 15.3351, lng: 76.4603 },
  "gokarna": { name: "Gokarna", lat: 14.5479, lng: 74.3190 },
  "mangalore": { name: "Mangalore", lat: 12.9141, lng: 74.8560 },
  "mysore": { name: "Mysore", lat: 12.2958, lng: 76.6394 },
  "coorg": { name: "Coorg", lat: 12.4244, lng: 75.7382 },
  "chikmagalur": { name: "Chikmagalur", lat: 13.3222, lng: 75.7740 },

  // Tamil Nadu
  "chennai": { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  "ooty": { name: "Ooty", lat: 11.4102, lng: 76.6950 },
  "kodaikanal": { name: "Kodaikanal", lat: 10.2381, lng: 77.4892 },
  "pondicherry": { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
  "mahabalipuram": { name: "Mahabalipuram", lat: 12.6269, lng: 80.1784 },
  "rameswaram": { name: "Rameswaram", lat: 9.2876, lng: 79.3129 },
  "kanyakumari": { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },

  // Northeast
  "cherrapunji": { name: "Cherrapunji", lat: 25.3004, lng: 91.6960 },
  "shillong": { name: "Shillong", lat: 25.5788, lng: 91.8933 },
  "kaziranga": { name: "Kaziranga", lat: 26.6504, lng: 93.3638 },
  "gangtok": { name: "Gangtok", lat: 27.3314, lng: 88.6138 },
  "darjeeling": { name: "Darjeeling", lat: 27.0360, lng: 88.2627 },

  // Gujarat
  "ahmedabad": { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  "kutch": { name: "Kutch", lat: 23.7337, lng: 69.8597 },
  "somnath": { name: "Somnath", lat: 20.9107, lng: 70.3742 },
  "dwarka": { name: "Dwarka", lat: 22.2442, lng: 68.9685 },
  "vadodara": { name: "Vadodara", lat: 22.3072, lng: 73.1812 },

  // Andaman
  "andaman": { name: "Andaman Islands", lat: 11.7401, lng: 92.6586 },
  "port blair": { name: "Port Blair", lat: 11.6234, lng: 92.7265 },
  "havelock island": { name: "Havelock Island", lat: 11.9729, lng: 93.0061 },
  "neil island": { name: "Neil Island", lat: 11.8333, lng: 93.0500 },

  // Uttarakhand
  "rishikesh": { name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
  "haridwar": { name: "Haridwar", lat: 29.9457, lng: 78.1642 },
  "nainital": { name: "Nainital", lat: 29.3918, lng: 79.4549 },
  "mussoorie": { name: "Mussoorie", lat: 30.4598, lng: 78.0642 },
  "jim corbett": { name: "Jim Corbett National Park", lat: 29.5333, lng: 78.7667 },
  "auli": { name: "Auli", lat: 30.5272, lng: 79.5669 },
  "valley of flowers": { name: "Valley of Flowers", lat: 30.7333, lng: 79.6333 },

  // West Bengal
  "kolkata": { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  "digha": { name: "Digha", lat: 21.6269, lng: 87.5079 },

  // Telangana
  "hyderabad": { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  "charminar": { name: "Charminar", lat: 17.3617, lng: 78.4747 },
};

export function findLocation(text: string): PlaceLocation | null {
  const lower = text.toLowerCase().trim();
  for (const [key, loc] of Object.entries(PLACE_DB)) {
    if (lower.includes(key)) return loc;
  }
  return null;
}

export function extractPlaces(text: string): PlaceLocation[] {
  const lower = text.toLowerCase();
  const found: PlaceLocation[] = [];
  const seen = new Set<string>();
  for (const [key, loc] of Object.entries(PLACE_DB)) {
    if (lower.includes(key) && !seen.has(key)) {
      seen.add(key);
      found.push(loc);
    }
  }
  return found;
}
