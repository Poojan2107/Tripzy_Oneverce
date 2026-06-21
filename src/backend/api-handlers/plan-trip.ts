import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { rankDestinations } from "../services/recommender";
import { getGeminiApiKey } from "../lib/gemini";
import { checkRateLimit } from "../lib/rate-limit";

function getBaseOfflineItinerary(destName: string, lat: number, lng: number, budget: string) {
  const name = destName.toLowerCase();
  
  if (name.includes("varanasi")) {
    return [
      {
        day: "Day 1",
        title: "Subah-e-Banaras Sunset & Aarti Rituals",
        description: "Arrive in Varanasi and check into your boutique heritage Haveli overlooking the Ganges. At dusk, board a private wooden bajra boat for a sunset cruise. Witness the spectacular Ganga Aarti ritual at Dashashwamedh Ghat from the water as oil lamps illuminate the sacred river.",
        activities: [
          "Check-in at premium heritage Haveli",
          "Private sunset bajra boat cruise",
          "Witness the Ganga Aarti at Dashashwamedh Ghat"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Sunrise Boat Ride & Alleyway Lore",
        description: "Rise at 5:00 AM for a quiet sunrise boat ride to witness morning bathing rituals and prayers. Afterwards, join a local scholar for a walking tour through the labyrinthine alleys of the old city, discovering hidden shrines and sampling piping-hot Kachori Sabzi and saffron-infused Lassi.",
        activities: [
          "Sunrise rowing boat ride on the Ganges",
          "Alleyway guided walk with local scholar",
          "Breakfast tasting of Kachori Sabzi and Blue Lassi"
        ],
        latitude: lat + 0.002,
        longitude: lng - 0.003
      },
      {
        day: "Day 3",
        title: "Sarnath Stupa & Silk Weaving Quarter",
        description: "Drive to Sarnath for a quiet morning among the ancient Buddhist stupas and deer park where the Buddha first taught. Return to the old city and wander through the silk weaving quarter, watching master weavers at handlooms producing Banarasi silk that has clothed royalty for centuries.",
        activities: [
          "Sarnath Buddhist stupa excursion",
          "Silk weaving guild demonstration",
          "Evening boat ride with clay lamp offering"
        ],
        latitude: lat + 0.034,
        longitude: lng + 0.015
      },
      {
        day: "Day 4",
        title: "Ghat Walk & Culinary Farewell",
        description: "A final morning walk along the entire stretch of the Ganges ghats, passing textile dyers, flower sellers, and yoga practitioners. End at a century-old kitchen for a private cooking lesson in making Banarasi chai, stuffed parathas, and the iconic Malaiyyo dessert.",
        activities: [
          "Full ghat walking tour from Assi to Manikarnika",
          "Street food crawl with local guide",
          "Private Banarasi cooking class"
        ],
        latitude: lat - 0.003,
        longitude: lng + 0.005
      }
    ];
  }
  
  if (name.includes("kerala")) {
    return [
      {
        day: "Day 1",
        title: "Embarkation & Backwater Cruise",
        description: "Arrive in Alleppey and board your private, handcrafted luxury Kettuvallam (houseboat) made of bamboo poles and coconut fiber. Glide through the serene backwaters of Vembanad Lake, passing coconut groves and small local villages as your personal chef prepares traditional fish curry and red rice.",
        activities: [
          "Board custom Kettuvallam houseboat",
          "Slow cruise on Vembanad backwaters",
          "Traditional lunch on banana leaves"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Canoe Exploration & Toddy Shop Walk",
        description: "De-board for a narrow canoe excursion down the tiny canals inaccessible to houseboats. Witness coir-weaving and clam shell harvesting. At noon, take a guided walk to a local toddy shop to sample fermented coconut sap and spicy local delicacies.",
        activities: [
          "Narrow-canal canoe rowing tour",
          "Coir-weaving village craft demonstration",
          "Toddy shop spicy lunch tasting"
        ],
        latitude: lat + 0.004,
        longitude: lng + 0.002
      },
      {
        day: "Day 3",
        title: "Spice Plantation Walk & Temple Visit",
        description: "Journey inland to a family-run spice estate where pepper vines, cardamom, and nutmeg grow in dense tropical shade. Walk through the plantation with a farmer, then visit a small riverside temple before returning to the houseboat for a sunset cruise past Chinese fishing nets.",
        activities: [
          "Guided spice plantation walk",
          "Temple visit with local priest",
          "Sunset cruise past Chinese fishing nets"
        ],
        latitude: lat + 0.008,
        longitude: lng - 0.004
      },
      {
        day: "Day 4",
        title: "Kumarakom Sanctuary & Village Cycle Tour",
        description: "Cycle through narrow village lanes lined with coconut trees to the Kumarakom Bird Sanctuary. Spot kingfishers, herons, and egrets. Stop at a local toddy shop for fresh coconut water. End with a traditional Kerala sadya feast served on a banana leaf.",
        activities: [
          "Village cycle tour through backwater hamlets",
          "Birdwatching at Kumarakom sanctuary",
          "Traditional sadya banana leaf lunch"
        ],
        latitude: lat - 0.006,
        longitude: lng + 0.008
      }
    ];
  }

  if (name.includes("hampi")) {
    return [
      {
        day: "Day 1",
        title: "Sacred Ruins & Tungabhadra Sunset",
        description: "Arrive at the boulder-strewn sanctuary of Hampi. Check in at your eco-boutique resort on the Anegundi side. Spend the afternoon exploring the massive Virupaksha Temple complex. Cross the Tungabhadra River in a traditional circular coracle boat and hike up Hemakuta Hill for a breathtaking sunset.",
        activities: [
          "Check-in at clay eco-resort",
          "Guided tour of Virupaksha Temple",
          "Sunset hike and coracle boat crossing"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Royal Enclosure & Boulder Wilderness Trail",
        description: "Set out on rented bicycles or electric buggies to explore the majestic Stone Chariot at Vittala Temple and the Lotus Mahal inside the Royal Enclosure. In the late afternoon, take a bouldering walk with a local naturalist guide to spot rare birds and watch the sunset from Malyavanta Hill.",
        activities: [
          "Bicycle ride to Vittala Stone Chariot",
          "Explore Lotus Mahal and Elephant Stables",
          "Sunset bouldering trail and birdwatching"
        ],
        latitude: lat - 0.005,
        longitude: lng + 0.004
      }
    ];
  }

  if (name.includes("jaisalmer")) {
    return [
      {
        day: "Day 1",
        title: "Golden Fort Trail & Haveli Architecture",
        description: "Arrive in the Golden City of Jaisalmer. Check in at a restored sandstone Haveli inside the living Jaisalmer Fort. Wander the narrow streets to admire the intricate carvings of Patwon-ki-Haveli and Nathmal-ki-Haveli, learning about the ancient spice route trade history.",
        activities: [
          "Check-in at Fort Sandstone Haveli",
          "Walking tour of Jaisalmer Living Fort",
          "Admire Patwon-ki-Haveli stone screens"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Thar Desert dunes & Folk Music Under the Stars",
        description: "Drive out to the Sam Sand Dunes in the afternoon. Embark on a slow camel safari as the sun dips below the horizon, painting the sands in rich crimson and gold. Spend the evening at a desert camp listening to Rajasthani Manganiyar folk musicians under a clear desert sky.",
        activities: [
          "Jeep drive to Sam sand dunes",
          "Camel ride during sunset",
          "Manganiyar folk music & desert camp dinner"
        ],
        latitude: lat - 0.08,
        longitude: lng + 0.07
      },
      {
        day: "Day 3",
        title: "Kuldhara Ghost Village & Desert Hike",
        description: "Drive to the abandoned medieval village of Kuldhara, an entire settlement deserted overnight 200 years ago. Explore the crumbling sandstone havelis in silence. Then hike a short trail to the Amar Sagar stepwell for a peaceful picnic among ancient architecture.",
        activities: [
          "Kuldhara abandoned village exploration",
          "Amar Sagar stepwell picnic",
          "Sunset at Vyas Chhatri cenotaphs"
        ],
        latitude: lat - 0.025,
        longitude: lng + 0.012
      },
      {
        day: "Day 4",
        title: "Bada Bagh & Rajasthani Cooking Class",
        description: "Morning visit to Bada Bagh, a garden complex with royal cenotaphs where sandstone domes seem to float above the desert floor. Return to the fort for a hands-on Rajasthani cooking class — learn to make dal baati churma and ker sangri in a family kitchen.",
        activities: [
          "Bada Bagh cenotaph sunrise visit",
          "Rajasthani cooking class in family home",
          "Farewell camel cart ride through the fort"
        ],
        latitude: lat + 0.015,
        longitude: lng - 0.008
      }
    ];
  }

  if (name.includes("ladakh")) {
    return [
      {
        day: "Day 1",
        title: "Altitude Acclimatization & Monastery Walk",
        description: "Arrive in Leh (3,500m) and spend the day resting to acclimatize to the thin air. In the evening, take a slow walk to the Shanti Stupa for panoramic views of the Leh valley and the Indus River, breathing in the crisp mountain air.",
        activities: [
          "Check-in at Leh organic resort",
          "Acclimatization rest with butter tea",
          "Sunset walk to Shanti Stupa"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Monastery Trail & Hall of Fame",
        description: "Visit the Thiksey Monastery, a twelve-story complex resembling the Potala Palace. Observe the morning prayer chants of young monks. Continue to Hemis Monastery, hidden in a mountain gorge, to view its ancient scroll paintings and sacred relics.",
        activities: [
          "Attend morning prayers at Thiksey Monastery",
          "Explore Hemis Monastery museum",
          "Scenic mountain pass photo walk"
        ],
        latitude: lat + 0.012,
        longitude: lng + 0.018
      },
      {
        day: "Day 3",
        title: "Khardung La Pass & Nubra Valley",
        description: "Drive to the Khardung La Pass, one of the highest motorable passes in the world at 18,380 feet. Descend into the Nubra Valley and ride a double-humped Bactrian camel across the white sand dunes. Visit a Tibetan refugee settlement for handwoven pashmina demonstrations.",
        activities: [
          "Khardung La Pass summit stop",
          "Bactrian camel ride at Nubra sand dunes",
          "Tibetan refugee settlement walk"
        ],
        latitude: lat + 0.065,
        longitude: lng - 0.032
      },
      {
        day: "Day 4",
        title: "Pangong Lake Expedition",
        description: "An early morning drive along the Indus River to the stunning Pangong Tso lake, sitting at 14,270 feet. The lake's turquoise and deep blue waters shift colors through the day. Picnic on the shore, spot migratory birds, and return to Leh along the Chang La pass.",
        activities: [
          "Scenic drive along Indus River gorge",
          "Pangong Tso lakeside picnic",
          "Chang La pass photo stop on return"
        ],
        latitude: lat - 0.042,
        longitude: lng + 0.088
      }
    ];
  }

  if (name.includes("udaipur")) {
    return [
      {
        day: "Day 1",
        title: "Lake Pichola Cruise & City Palace Walk",
        description: "Arrive in the city of lakes, Udaipur. Check in at your lakefront heritage hotel. Explore the majestic City Palace, a blend of Rajasthani and Mughal styles. In the evening, take a solar-powered boat cruise on Lake Pichola, gliding past the illuminated Lake Palace.",
        activities: [
          "Check-in at Lakefront Heritage Hotel",
          "Guided tour of Udaipur City Palace",
          "Sunset boat cruise on Lake Pichola"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Sajjangarh Monsoon Peak & Jag Mandir",
        description: "Visit Jag Mandir island palace for a quiet morning tea. In the afternoon, drive up the winding roads to Sajjangarh (Monsoon Palace) perched high on a hill, offering stunning sunset views of Udaipur's lakes and the surrounding Aravalli hills.",
        activities: [
          "Jag Mandir island stroll",
          "Drive to Sajjangarh Monsoon Palace",
          "Traditional Rajasthani thali dinner"
        ],
        latitude: lat - 0.015,
        longitude: lng + 0.01
      }
    ];
  }

  if (name.includes("goa")) {
    return [
      {
        day: "Day 1",
        title: "Old Goa Portuguese Trail & Spice Walk",
        description: "Arrive in Goa. Skip the crowds and check into a restored Indo-Portuguese mansion in South Goa. Visit Old Goa to see the historic Basilica of Bom Jesus. In the afternoon, walk through a tropical spice plantation, tasting fresh vanilla and cinnamon.",
        activities: [
          "Check-in at South Goa heritage mansion",
          "Visit Basilica of Bom Jesus in Old Goa",
          "Guided tropical spice plantation lunch tour"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Secluded South Beaches & Cliff Sunset",
        description: "Spend a quiet morning at the pristine, pine-fringed Galgibaga beach (nesting ground of Olive Ridley turtles). In the evening, hike up Cabo de Rama fort cliffs to watch the sun set over the vast, calm Arabian Sea.",
        activities: [
          "Morning swim at Galgibaga beach",
          "Explore Cabo de Rama fort ruins",
          "Cliff-top sunset picnic and local feni tasting"
        ],
        latitude: lat - 0.02,
        longitude: lng - 0.01
      }
    ];
  }

  if (name.includes("taj") || name.includes("agra")) {
    return [
      {
        day: "Day 1",
        title: "Agra Fort History & Marble Inlay",
        description: "Arrive in Agra. Visit the massive red sandstone Agra Fort, walking through its royal pavilions where Shah Jahan spent his final days. In the evening, visit a local workshop to watch descendants of Taj artisans perform delicate Pietra Dura marble inlay work.",
        activities: [
          "Check-in at view-optimized hotel",
          "Guided historical walk of Agra Fort",
          "Marble inlay craft workshop visit"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Sunrise Taj Mahal & Mehtab Bagh golden hour",
        description: "Enter the Taj Mahal at 5:30 AM to witness the white marble change from soft pink to radiant gold as the sun rises. Learn about the symmetrical Islamic architecture. In the late afternoon, cross the Yamuna River to Mehtab Bagh garden for a serene view of the Taj during sunset.",
        activities: [
          "Sunrise guided tour of the Taj Mahal",
          "Breakfast at a rooftop terrace overlooking the dome",
          "Sunset photography from Mehtab Bagh gardens"
        ],
        latitude: lat - 0.004,
        longitude: lng + 0.008
      }
    ];
  }

  if (name.includes("kashmir") || name.includes("srinagar")) {
    return [
      {
        day: "Day 1",
        title: "Dal Lake Arrival & Shikara Cruise",
        description: "Arrive in Srinagar and transfer to a heritage wooden houseboat moored on Dal Lake. Spend the afternoon drifting across the lake on a shaded shikara, passing floating gardens and lotus blooms. Visit the floating vegetable market and watch vendors trade fresh produce from carved wooden boats.",
        activities: [
          "Check-in at heritage Dal Lake houseboat",
          "Shikara cruise through floating gardens",
          "Sunset over the Pir Panjal range"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Mughal Gardens & Alpine Meadow Trek",
        description: "Visit the three majestic Mughal gardens — Shalimar Bagh, Nishat Bagh, and Chashme Shahi — each built by Mughal emperors with terraced lawns and cascading fountains. In the afternoon, drive to Pahalgam for a gentle pony trek through pine forests and wildflower meadows along the Lidder River.",
        activities: [
          "Guided morning tour of Mughal Gardens",
          "Pony trek through Pahalgam meadows",
          "Kashmiri Wazwan dinner at local homestay"
        ],
        latitude: lat - 0.03,
        longitude: lng + 0.02
      }
    ];
  }

  if (name.includes("munnar")) {
    return [
      {
        day: "Day 1",
        title: "Spice Hills Arrival & Tea Plantation Walk",
        description: "Arrive in Munnar and check into a colonial-era tea bungalow perched on rolling green hills. Take a guided walk through the sprawling Tata Tea plantations, where workers pluck the finest leaves by hand. Visit the Tea Museum to learn about the region's tea-growing heritage dating back to the British Raj.",
        activities: [
          "Check-in at heritage tea bungalow",
          "Guided walk through tea plantations",
          "Tea Museum heritage tour"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Eravikulam National Park & Echo Point",
        description: "Rise early and head to Eravikulam National Park to spot the endangered Nilgiri Tahr in its natural habitat. Trek through misty shola grasslands to the summit of Anamudi Peak. In the afternoon, visit Echo Point on the reservoir for a serene boat ride surrounded by rolling green hills.",
        activities: [
          "Wildlife spotting at Eravikulam National Park",
          "Trek through shola grasslands",
          "Boat ride at Echo Point reservoir"
        ],
        latitude: lat + 0.015,
        longitude: lng - 0.01
      }
    ];
  }

  if (name.includes("kutch")) {
    return [
      {
        day: "Day 1",
        title: "White Desert Arrival & Handicraft Trail",
        description: "Arrive in Bhuj and drive to the Great Rann of Kutch. Check into a traditional Bhunga (circular mud hut) resort. Visit the local villages of Hodka and Dhordo to witness master craftspeople creating intricate mirror-work embroidery, leatherwork, and pottery — traditions passed down through generations.",
        activities: [
          "Check-in at traditional Bhunga resort",
          "Village craft trail through Hodka and Dhordo",
          "Sunset over the white salt desert"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Rann Utsav & Desert Campfire Music",
        description: "Spend the morning exploring the vast white salt desert — a surreal landscape stretching to the horizon. Visit the Kala Dungar (Black Hill) for panoramic views of the Rann. In the evening, experience a traditional Kutchi folk music performance around a desert campfire under a canopy of stars.",
        activities: [
          "Morning walk across the salt flats",
          "Kala Dungar viewpoint and panoramic photos",
          "Kutchi folk music and campfire dinner"
        ],
        latitude: lat + 0.04,
        longitude: lng + 0.03
      }
    ];
  }

  if (name.includes("cherrapunji") || name.includes("meghalaya")) {
    return [
      {
        day: "Day 1",
        title: "Living Root Bridges & Waterfall Trail",
        description: "Arrive in Cherrapunji, one of the wettest places on Earth. Trek down into the lush valley to discover the ancient living root bridges — intricate aerial bridges woven from the roots of rubber trees by the Khasi people over centuries. Visit the thundering Nohkalikai Falls, plunging 340m into a turquoise pool.",
        activities: [
          "Check-in at eco-lodge with valley views",
          "Trek to double-decker living root bridge",
          "View Nohkalikai Falls at golden hour"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Sacred Forests & Mawsmai Cave",
        description: "Explore the Mawsmai limestone caves, a network of illuminated caverns filled with stunning stalactite and stalagmite formations. Walk through the sacred groves of Mawphlang — virgin forests protected by Khasi tribal customs for centuries, where ancient moss-covered monoliths stand among giant ferns.",
        activities: [
          "Guided cave exploration at Mawsmai",
          "Walk through Mawphlang sacred forest",
          "Local Khasi lunch with traditional rice beer"
        ],
        latitude: lat - 0.02,
        longitude: lng + 0.015
      }
    ];
  }

  if (name.includes("andaman")) {
    return [
      {
        day: "Day 1",
        title: "Cellular Jail & Coral Island Arrival",
        description: "Arrive in Port Blair and visit the historic Cellular Jail — a colonial penitentiary that now stands as a national memorial. Take a ferry to the pristine Havelock Island (Swaraj Dweep), where stretches of powdery white sand are fringed by emerald-green forests and crystal-clear turquoise waters.",
        activities: [
          "Guided tour of Cellular Jail",
          "Ferry crossing to Havelock Island",
          "Sunset stroll on Radhanagar Beach"
        ],
        latitude: lat,
        longitude: lng
      },
      {
        day: "Day 2",
        title: "Snorkeling Reefs & Beach Relaxation",
        description: "Spend the morning snorkeling at Elephant Beach, where vibrant coral gardens teem with clownfish, parrotfish, and sea anemones. After lunch, relax on the award-winning Radhanagar Beach — Asia's best beach — with its soft white sand and calm, impossibly clear waters shaded by fragrant pine trees.",
        activities: [
          "Snorkeling session at Elephant Beach coral reef",
          "Lunch at beachfront seafood shack",
          "Relaxation and swimming at Radhanagar Beach"
        ],
        latitude: lat + 0.02,
        longitude: lng - 0.01
      }
    ];
  }

  // General fallback
  return [
    {
      day: "Day 1",
      title: "Arrival & Orientation Walk",
      description: `Welcome to ${destName}! Check in at your boutique accommodation, rest, and join your guide for a sunset stroll.`,
      activities: [
        `Check-in at premium boutique lodge`,
        "Taste regional street delights",
        "Sunset view over scenic rivers/cliffs"
      ],
      latitude: lat,
      longitude: lng
    },
    {
      day: "Day 2",
      title: "Boutique Local Highlights",
      description: `Immerse yourself in the local heritage, visiting cultural sanctuaries and tasting specialties.`,
      activities: [
        "Morning guided walk with a historian",
        "Lunch at a Michelin-reviewed terrace bistros",
        "Traditional evening performance and dinner"
      ],
      latitude: lat + 0.003,
      longitude: lng + 0.005
    },
    {
      day: "Day 3",
      title: "Hidden Trails & Local Craft Villages",
      description: `Venture beyond ${destName}'s main quarter to discover quieter trails and artisan workshops. Visit a local craft village to see traditional techniques passed down through generations.`,
      activities: [
        "Artisan village walking tour",
        "Traditional craft demonstration",
        "Lunch at a family-run homestay"
      ],
      latitude: lat - 0.006,
      longitude: lng + 0.009
    },
    {
      day: "Day 4",
      title: "Sunrise Vistas & Farewell Feast",
      description: `Wake early for a sunrise view over ${destName}'s landscape. Return for a final tasting walk through the local market — pickles, sweets, and fresh chai. Depart with handcrafted souvenirs.`,
      activities: [
        "Sunrise viewpoint hike or walk",
        "Local market tasting tour",
        "Farewell lunch with regional specialties"
      ],
      latitude: lat + 0.004,
      longitude: lng - 0.007
    }
  ];
}

function getOfflineItinerary(destName: string, lat: number, lng: number, budget: string, duration: number) {
  const baseDays = getBaseOfflineItinerary(destName, lat, lng, budget);
  const itinerary = [];
  for (let i = 0; i < duration; i++) {
    const baseDay = baseDays[i % baseDays.length];
    const cycle = Math.floor(i / baseDays.length);
    itinerary.push({
      day: `Day ${i + 1}`,
      title: baseDay.title,
      description: baseDay.description,
      activities: baseDay.activities,
      latitude: baseDay.latitude + (cycle * 0.012),
      longitude: baseDay.longitude - (cycle * 0.012)
    });
  }
  return itinerary;
}

function buildOfflineResponse(finalDest: any, destination: string, budget: string, tripDuration: number, matchDetails: any) {
  const fallbackDestName = finalDest ? finalDest.name : (destination || "Varanasi");
  const fallbackLat = finalDest?.latitude || 25.3176;
  const fallbackLng = finalDest?.longitude || 82.9739;

  // Destination-aware cost multipliers
  const destNameLower = fallbackDestName.toLowerCase();
  const costMultiplier = destNameLower.includes('ladakh') || destNameLower.includes('kashmir') || destNameLower.includes('andaman') ? 1.4 : destNameLower.includes('jaisalmer') || destNameLower.includes('kerala') || destNameLower.includes('udaipur') ? 1.2 : destNameLower.includes('goa') || destNameLower.includes('munnar') || destNameLower.includes('cherrapunji') ? 0.9 : 1.0;
  const baseTransit = budget === 'Luxury' ? 25000 : budget === 'Medium' ? 12000 : 5000;
  const baseStay = budget === 'Luxury' ? 80000 : budget === 'Medium' ? 25000 : 8000;
  const baseFood = budget === 'Luxury' ? 30000 : budget === 'Medium' ? 15000 : 6000;
  const totalCost = Math.round((baseTransit + baseStay + baseFood) * costMultiplier);

  return {
    itinerary: getOfflineItinerary(fallbackDestName, fallbackLat, fallbackLng, budget, tripDuration),
    costs: {
      transit: Math.round(baseTransit * costMultiplier),
      stay: Math.round(baseStay * costMultiplier),
      food: Math.round(baseFood * costMultiplier),
      total: totalCost
    },
    weather: {
      temperature: "22°C - 26°C",
      conditions: "Pleasant & Clear"
    },
    nearbyPlaces: [
      {
        name: "Historic Heritage Quarter",
        distance: "2km",
        description: "An ancient enclave rich in classical vernacular architecture."
      }
    ],
    destinationId: finalDest?.id || undefined,
    recommendationScore: matchDetails?.score || 85,
    recommendationReasoning: matchDetails?.reasoning || "Selected based on matching travel styles and budget guides.",
    matchedFactors: matchDetails?.matchedFactors || {
      budget: true,
      style: true,
      energy: true,
      season: true,
      companion: true
    }
  };
}

export async function POST(req: Request) {
  try {
    if (!(await checkRateLimit(req))) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      destination, 
      fromLocation, 
      fromDate, 
      toDate, 
      budget, 
      journeyMode, 
      travelStyle, 
      interests, 
      guests, 
      companion,
      travelPace,
      experience 
    } = await req.json();

    // 1. Calculate trip duration in days
    let tripDuration = 5;
    if (fromDate && toDate) {
      try {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) tripDuration = diffDays;
      } catch (err) {
        console.error("Failed to calculate trip duration:", err);
      }
    }

    // 2. Determine travel month
    let travelMonth = undefined;
    if (fromDate) {
      try {
        const dateObj = new Date(fromDate);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        travelMonth = months[dateObj.getMonth()];
      } catch (err) {
        console.error("Failed to parse travel month:", err);
      }
    }

    // 3. Call the scoring engine
    const scoredDestinations = await rankDestinations({
      budget,
      duration: tripDuration,
      travelStyle,
      interests,
      companion,
      guests,
      preferredRegion: destination || undefined,
      experience,
      month: travelMonth
    });

    let finalDest = null;
    let matchDetails = null;

    if (scoredDestinations.length > 0) {
      // Find direct text match first if queried
      if (destination) {
        const exactMatch = scoredDestinations.find(
          (r) =>
            r.destination.name.toLowerCase().includes(destination.toLowerCase()) ||
            r.destination.city.toLowerCase().includes(destination.toLowerCase()) ||
            r.destination.country.toLowerCase().includes(destination.toLowerCase())
        );
        if (exactMatch) {
          finalDest = exactMatch.destination;
          matchDetails = exactMatch;
        }
      }

      // Default to highest scored destination
      if (!finalDest) {
        finalDest = scoredDestinations[0].destination;
        matchDetails = scoredDestinations[0];
      }
    }

    // 4. Fallback mock response if no Gemini API Key is configured
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      const offlineResponse = buildOfflineResponse(finalDest, destination, budget, tripDuration, matchDetails);
      return new Response(JSON.stringify(offlineResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Construct prompt injecting DB destination context (RAG)
    const destName = finalDest ? finalDest.name : destination;
    const destDesc = finalDest ? finalDest.description : "A beautiful travel spot.";
    const centerLat = finalDest?.latitude || 20;
    const centerLng = finalDest?.longitude || 0;

    const prompt = `
      Create an immersive, premium day-by-day travel itinerary for a trip to ${destName}.
      
      Destination Knowledge Base Context:
      - Description: ${destDesc}
      - Country: ${finalDest?.country || 'N/A'}
      - Region: ${finalDest?.region || 'N/A'}
      - Baseline Coordinates: Latitude ${centerLat}, Longitude ${centerLng}
      
      Preferences:
      - Starting Location: ${fromLocation}
      - Dates: ${fromDate} to ${toDate}
      - Budget Tier: ${budget}
      - Travel Style: ${travelStyle}
      - Key Interests: ${interests}
      - Travelers: ${guests}
      - Travel Pace: ${travelPace}
      
      Matched Recommendation Engine Telemetry:
      - Match Score: ${matchDetails?.score || 85}/100
      - Match Reasoning: ${matchDetails?.reasoning || 'N/A'}
      
      Cultural Context & Alignment Guidelines:
      - If ${destName} is an Indian destination (e.g. Varanasi, Taj Mahal, Ladakh, Goa, Udaipur, Kerala, Hampi, Jaisalmer), ensure the day-by-day description uses extremely rich, local, culturally immersive terminology (e.g. Backwaters, Haveli, Aarti, Toddy shops, Manganiyar folk musicians, coracle boats, bouldering trails). Avoid generic tourist descriptions.
      - Create highly authentic, detailed day-by-day logs with coordinate offsets of 0.001 to 0.05 around the baseline coordinates (Latitude: ${centerLat}, Longitude: ${centerLng}) for mapping, ensuring each day has slightly different coordinates representing specific spots.
      - Estimate realistic expenses in INR matching the budget level (Explorer, Curated Comfort, Floating Oases).
      
      Requirements:
      1. Provide a day-by-day itinerary (Day 1, Day 2, etc.) matching the travel dates and pace.
      2. For each day, provide the latitude and longitude coordinate points representing the highlight activity. Crucial: Make sure coordinates are geolocated reasonably around the destination center with offsets of 0.001 to 0.05, rather than returning the center exactly every day.
      3. Provide a realistic cost breakdown in INR matching the budget tier.
      4. Predict general weather for these dates at the destination.
      5. Suggest nearby places/attractions within a 10km radius.
    `;

    try {
      const result = await generateObject({
        model: google("gemini-1.5-flash"),
        schema: z.object({
          itinerary: z.array(z.object({
            day: z.string().describe("E.g., Day 1, Day 2"),
            title: z.string().describe("Title for the day's theme"),
            description: z.string().describe("Detailed description of activities"),
            activities: z.array(z.string()).describe("List of specific spots or activities"),
            latitude: z.number().describe("Latitude coordinate for mapping this day's main spot"),
            longitude: z.number().describe("Longitude coordinate for mapping this day's main spot")
          })),
          costs: z.object({
            transit: z.number().describe("Estimated transit cost in INR"),
            stay: z.number().describe("Estimated accommodation cost in INR"),
            food: z.number().describe("Estimated food & activities cost in INR"),
            total: z.number().describe("Total estimated cost in INR")
          }),
          weather: z.object({
            temperature: z.string().describe("E.g., 24°C - 28°C"),
            conditions: z.string().describe("E.g., Sunny, Partly Cloudy")
          }),
          nearbyPlaces: z.array(z.object({
            name: z.string(),
            distance: z.string().describe("Distance from main destination, e.g., 5km"),
            description: z.string()
          }))
        }),
        prompt: prompt,
      });

      const finalResponse = {
        ...result.object,
        destinationId: finalDest?.id || undefined,
        recommendationScore: matchDetails?.score || 85,
        recommendationReasoning: matchDetails?.reasoning || "Selected based on matching travel styles and budget guides.",
        matchedFactors: matchDetails?.matchedFactors || {
          budget: true,
          style: true,
          energy: true,
          season: true,
          companion: true
        }
      };

      return new Response(JSON.stringify(finalResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (aiError) {
      console.warn("Gemini API call failed. Executing offline fallback itinerary:", aiError);
      const offlineResponse = buildOfflineResponse(finalDest, destination, budget, tripDuration, matchDetails);
      return new Response(JSON.stringify(offlineResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error("Trip Planning Route Error:", error);
    const userMessage = "We couldn't complete your itinerary right now. Please try again in a moment.";
    return new Response(JSON.stringify({ error: userMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
