import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.ALLOW_DB_WIPE) {
    console.error("ERROR: This seed script DELETES ALL EXISTING DATA before seeding.");
    console.error("Set ALLOW_DB_WIPE=true to confirm you want to proceed.");
    process.exit(1);
  }
  console.log("Cleaning database...");
  await prisma.bookmark.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.viewEvent.deleteMany({});
  await prisma.searchEvent.deleteMany({});
  await prisma.plannerEvent.deleteMany({});
  await prisma.recommendationEvent.deleteMany({});
  await prisma.savedItinerary.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.destination.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.experience.deleteMany({});

  console.log("Seeding experiences...");
  const adventureExp = await prisma.experience.create({
    data: {
      name: "Adventure",
      slug: "adventure",
      description: "Adrenaline-fueled treks and wilderness crossings.",
      featuredImage: "/images/cat-adventure.jpg",
      icon: "Flame",
      travelStyles: ["Active", "Outdoors"],
      estimatedBudget: 1500,
      durationRange: "4-10 Days",
      difficultyLevel: "Challenging",
      tags: ["Hiking", "Climbing"],
      featured: true,
    },
  });

  const luxuryExp = await prisma.experience.create({
    data: {
      name: "Luxury",
      slug: "luxury",
      description: "Private floating villas, custom charters, and heritage thali meals.",
      featuredImage: "/images/cat-royal.jpg",
      icon: "Sparkles",
      travelStyles: ["Relaxed", "Pampered"],
      estimatedBudget: 3500,
      durationRange: "5-14 Days",
      difficultyLevel: "Easy",
      tags: ["Resort", "Exclusive"],
      featured: true,
    },
  });

  const foodExp = await prisma.experience.create({
    data: {
      name: "Food",
      slug: "food",
      description: "Organic spice trails, local street-food safaris, and thali crawls.",
      featuredImage: "/images/cat-food.jpg",
      icon: "Utensils",
      travelStyles: ["Relaxed", "Gastronomic"],
      estimatedBudget: 800,
      durationRange: "3-7 Days",
      difficultyLevel: "Easy",
      tags: ["Tasting", "Street Food"],
      featured: true,
    },
  });

  const natureExp = await prisma.experience.create({
    data: {
      name: "Nature",
      slug: "nature",
      description: "Palm-fringed backwaters, tea valleys, and deep rainforest trails.",
      featuredImage: "/images/cat-nature.jpg",
      icon: "Trees",
      travelStyles: ["Moderate", "Outdoors"],
      estimatedBudget: 1000,
      durationRange: "3-8 Days",
      difficultyLevel: "Easy",
      tags: ["Forest", "Scenic"],
      featured: true,
    },
  });

  const photographyExp = await prisma.experience.create({
    data: {
      name: "Photography",
      slug: "photography",
      description: "Dramatic sunset viewpoints and sunrise reflections.",
      featuredImage: "/images/cat-spiritual.jpg",
      icon: "Camera",
      travelStyles: ["Slow Travel", "Scenic"],
      estimatedBudget: 1200,
      durationRange: "4-9 Days",
      difficultyLevel: "Easy",
      tags: ["Views", "Vistas", "Golden Hour"],
      featured: true,
    },
  });

  const spiritualExp = await prisma.experience.create({
    data: {
      name: "Spiritual",
      slug: "spiritual",
      description: "Sacred ceremonies, temple trails, and peaceful meditation sanctuaries.",
      featuredImage: "/images/cat-spiritual.jpg",
      icon: "Sun",
      travelStyles: ["Slow Travel", "Quiet"],
      estimatedBudget: 500,
      durationRange: "3-7 Days",
      difficultyLevel: "Easy",
      tags: ["Temples", "Yoga", "Zen"],
      featured: true,
    },
  });

  const heritageExp = await prisma.experience.create({
    data: {
      name: "Heritage",
      slug: "heritage",
      description: "Ancient ruins, massive sandstone forts, and royal palace cities.",
      featuredImage: "/images/cat-hidden.jpg",
      icon: "BookOpen",
      travelStyles: ["Educational", "Cultural"],
      estimatedBudget: 900,
      durationRange: "4-8 Days",
      difficultyLevel: "Easy",
      tags: ["History", "Architecture"],
      featured: true,
    },
  });

  const beachesExp = await prisma.experience.create({
    data: {
      name: "Beaches",
      slug: "beaches",
      description: "Turquoise lagoons, white sandbars, and ocean snorkeling.",
      featuredImage: "/images/cat-nature.jpg",
      icon: "Waves",
      travelStyles: ["Relaxed", "Beachside"],
      estimatedBudget: 1400,
      durationRange: "4-10 Days",
      difficultyLevel: "Easy",
      tags: ["Snorkeling", "Island", "Relaxation"],
      featured: true,
    },
  });

  console.log("Seeding categories...");
  const trendingCat = await prisma.category.create({ data: { name: "trending" } });
  const popularCat = await prisma.category.create({ data: { name: "popular" } });
  const weekendCat = await prisma.category.create({ data: { name: "weekend" } });
  const intlCat = await prisma.category.create({ data: { name: "international" } });

  console.log("Seeding 12 Indian Chapters...");

  const destsData = [
    {
      name: "Varanasi",
      slug: "varanasi-spiritual",
      country: "India",
      city: "Varanasi",
      region: "Uttar Pradesh",
      description: "Experience Varanasi, one of the oldest living cities on earth. Observe the mesmerizing Ganga Aarti fire ceremonies from a private wooden boat on the sacred river Ganges, walk through narrow lanes alive with clay tea cups and silk weavers, and sit with local Vedic scholars for private chanting sessions.",
      images: [
        "/images/tours/varanasi-banner.jpg",
        "/images/tours/varanasi-gallery-1.jpg"
      ],
      price: 550,
      duration: "3 Days, 2 Nights",
      difficulty: "Easy",
      groupSize: "Max 8 travelers",
      featured: true,
      trending: true,
      latitude: 25.3176,
      longitude: 82.9739,
      adventureScore: 3,
      culturalScore: 10,
      luxuryScore: 6,
      familyScore: 8,
      foodScore: 8,
      hiddenGemScore: 7,
      bestMonths: ["October", "November", "December", "January", "February", "March"],
      travelStyles: ["Spiritual", "Culture", "Slow Travel"],
      activities: ["Ganges boat ride", "Ganga Aarti viewing", "Silk weavers guild visit"],
      tags: ["Spiritual", "Culture", "Heritage"],
      catId: trendingCat.id,
      expIds: [spiritualExp.id, heritageExp.id, foodExp.id],
      metadata: {
        subtitle: "Chapter 01: The Sacred River",
        chapterName: "Chapter 01",
        chapterTitle: "The Sacred River",
        storyHeadline: "Dawn on the Ganges",
        storyNarrative: "Witness the convergence of life, death, and devotion along the ancient stone steps.",
        localSecret: "A century-old, family-run clay pottery workshop hidden behind Lalita Ghat.",
        photographySpot: "Dashashwamedh Ghat at 5:45 AM during the first incense flame offering.",
        signatureExperience: "A private evening Bajra boat ride during the Ganga Aarti.",
        budgetRange: "₹25,000 - ₹80,000"
      }
    },
    {
      name: "Jaisalmer Fort",
      slug: "jaisalmer-fort",
      country: "India",
      city: "Jaisalmer",
      region: "Rajasthan",
      description: "Unveil the mystery of the Golden City. Live inside the active sandstone citadel of Jaisalmer, traverse the Thar desert dunes on camelback under an expansive starry sky, and stay in luxurious desert canopy tents featuring authentic Rajasthani folk music.",
      images: ["/images/tours/jaisalmer-banner.jpg"],
      price: 950,
      duration: "3 Days, 2 Nights",
      difficulty: "Easy",
      groupSize: "Max 8 travelers",
      featured: true,
      trending: false,
      latitude: 26.9157,
      longitude: 70.9083,
      adventureScore: 7,
      culturalScore: 9,
      luxuryScore: 8,
      familyScore: 8,
      foodScore: 8,
      hiddenGemScore: 7,
      bestMonths: ["October", "November", "December", "January", "February", "March"],
      travelStyles: ["Culture", "Adventure", "Royal"],
      activities: ["Golden fort walking tour", "Carved havelis visit", "Thar desert jeep cruise"],
      tags: ["Culture", "Adventure", "Luxury"],
      catId: popularCat.id,
      expIds: [luxuryExp.id, heritageExp.id, adventureExp.id],
      metadata: {
        subtitle: "Chapter 02: The Desert Kingdom",
        chapterName: "Chapter 02",
        chapterTitle: "The Desert Kingdom",
        storyHeadline: "The Living Golden Citadel",
        storyNarrative: "Walk inside a massive sandstone fort where families still reside amidst ancient carvings.",
        localSecret: "An abandoned medieval stepwell at Kuldhara, completely silent at sunrise.",
        photographySpot: "The sunset silhouette of Vyas Chhatri cenotaphs against the golden dunes.",
        signatureExperience: "A slow camel caravan trek during twilight in the Thar Desert.",
        budgetRange: "₹30,000 - ₹90,000"
      }
    },
    {
      name: "Kerala Backwaters",
      slug: "kerala-houseboats",
      country: "India",
      city: "Alleppey",
      region: "Kerala",
      description: "Drift along the peaceful, palm-fringed backwaters of Alleppey inside a private luxury Kettuvallam houseboat. Sleep to the gentle sound of water, savor fresh pearl-spot fish prepared by your personal chef, and explore narrow canals lined with coconut trees.",
      images: ["/images/tours/kerala-banner.jpg"],
      price: 850,
      duration: "4 Days, 3 Nights",
      difficulty: "Easy",
      groupSize: "Max 4 travelers",
      featured: true,
      trending: true,
      latitude: 9.4981,
      longitude: 76.3388,
      adventureScore: 4,
      culturalScore: 7,
      luxuryScore: 8,
      familyScore: 9,
      foodScore: 9,
      hiddenGemScore: 6,
      bestMonths: ["September", "October", "November", "December", "January", "February", "March"],
      travelStyles: ["Relaxed", "Luxury", "Romantic"],
      activities: ["Houseboat lagoon cruise", "Narrow canal canoe trip", "Organic paddy farm lunch"],
      tags: ["Beach", "Luxury", "Nature"],
      catId: trendingCat.id,
      expIds: [luxuryExp.id, beachesExp.id, natureExp.id],
      metadata: {
        subtitle: "Chapter 03: The Floating World",
        chapterName: "Chapter 03",
        chapterTitle: "The Floating World",
        storyHeadline: "Slow Waters of Alleppey",
        storyNarrative: "Drift in a thatched roof houseboat past emerald paddy fields and sleeping lagoons.",
        localSecret: "A canal-side toddy shop serving spicy karimeen curry on banana leaves.",
        photographySpot: "Sunset reflections of palm silhouettes in Vembanad Lake.",
        signatureExperience: "Overnight backwater cruise on a luxury Kettuvallam.",
        budgetRange: "₹35,000 - ₹1,10,000"
      }
    },
    {
      name: "Ladakh",
      slug: "ladakh-passes",
      country: "India",
      city: "Leh",
      region: "Ladakh",
      description: "Embark on a high-altitude overland odyssey across the highest motorable passes in the world. Behold the shifting turquoise shades of Pangong Tso Lake, camp under pristine dark skies, and visit century-old Buddhist monasteries perched precariously on sheer mountain cliffs.",
      images: ["/images/tours/ladakh-banner.jpg"],
      price: 1100,
      duration: "8 Days, 7 Nights",
      difficulty: "Challenging",
      groupSize: "Max 6 travelers",
      featured: true,
      trending: false,
      latitude: 34.1526,
      longitude: 77.5771,
      adventureScore: 9,
      culturalScore: 8,
      luxuryScore: 6,
      familyScore: 6,
      foodScore: 6,
      hiddenGemScore: 8,
      bestMonths: ["June", "July", "August", "September"],
      travelStyles: ["Adventure", "High Altitude", "Outdoors"],
      activities: ["Motorcycle Khardung La run", "Pangong Tso camping", "Thiksey Monastery prayers"],
      tags: ["Adventure", "Nature", "Mountains"],
      catId: popularCat.id,
      expIds: [adventureExp.id, natureExp.id, photographyExp.id],
      metadata: {
        subtitle: "Chapter 04: The Last Himalayan Road",
        chapterName: "Chapter 04",
        chapterTitle: "The Last Himalayan Road",
        storyHeadline: "Breathtaking High Passes",
        storyNarrative: "Navigate winding trails through jagged cold deserts and high altitude monasteries.",
        localSecret: "A quiet walking trail behind Hemis Monastery leading to a hidden meditation cave.",
        photographySpot: "First light reflecting on the turquoise waters of Pangong Tso.",
        signatureExperience: "Motorcycle crossing of the Khardung La Pass.",
        budgetRange: "₹45,000 - ₹1,30,000"
      }
    },
    {
      name: "Kashmir",
      slug: "kashmir-meadows",
      country: "India",
      city: "Srinagar",
      region: "Jammu & Kashmir",
      description: "Savor the paradise on earth. Stay in meticulously hand-carved heritage wooden houseboats on Dal Lake, drift through floating morning flower markets, and discover the pine-forested alpine slopes and meadows of Gulmarg and Pahalgam.",
      images: ["/images/tours/kashmir-banner.jpg"],
      price: 1150,
      duration: "6 Days, 5 Nights",
      difficulty: "Easy",
      groupSize: "Max 6 travelers",
      featured: true,
      trending: false,
      latitude: 34.0837,
      longitude: 74.7973,
      adventureScore: 4,
      culturalScore: 8,
      luxuryScore: 8,
      familyScore: 9,
      foodScore: 8,
      hiddenGemScore: 5,
      bestMonths: ["April", "May", "June", "July", "August", "September", "October"],
      travelStyles: ["Luxury", "Nature", "Scenic"],
      activities: ["Dal Lake Shikara ride", "Gulmarg Gondola ride", "Shalimar Bagh garden walk"],
      tags: ["Nature", "Mountains", "Luxury"],
      catId: popularCat.id,
      expIds: [luxuryExp.id, natureExp.id, photographyExp.id],
      metadata: {
        subtitle: "Chapter 05: The Valley of Meadows",
        chapterName: "Chapter 05",
        chapterTitle: "The Valley of Meadows",
        storyHeadline: "Echoes of the Dal Lake",
        storyNarrative: "Wake up to floating flower markets and timber-carved houseboats surrounded by mist.",
        localSecret: "The hidden saffron fields of Pampore where the finest saffron is handpicked.",
        photographySpot: "A wooden Shikara floating in Dal Lake during sunset.",
        signatureExperience: "Gondola ride over Gulmarg's snow-capped valleys.",
        budgetRange: "₹40,000 - ₹1,20,000"
      }
    },
    {
      name: "Udaipur",
      slug: "udaipur-mewar",
      country: "India",
      city: "Udaipur",
      region: "Rajasthan",
      description: "Wander through the shimmering Mewar palace city of Udaipur. Watch golden-hour boat reflections on Lake Pichola, tour the grand City Palace museum, experience royal Mewari hospitality, and stay in a heritage palace floating in the center of the lake.",
      images: [
        "/images/tours/udaipur-banner.jpg",
        "/images/tours/udaipur-gallery-1.jpg"
      ],
      price: 1300,
      duration: "3 Days, 2 Nights",
      difficulty: "Easy",
      groupSize: "Max 6 travelers",
      featured: true,
      trending: false,
      latitude: 24.5854,
      longitude: 73.7125,
      adventureScore: 3,
      culturalScore: 9,
      luxuryScore: 9,
      familyScore: 8,
      foodScore: 8,
      hiddenGemScore: 6,
      bestMonths: ["October", "November", "December", "January", "February", "March"],
      travelStyles: ["Luxury", "Royal", "Culture"],
      activities: ["Pichola sunset cruise", "City Palace walking tour", "Craft bazaar miniature painting"],
      tags: ["Luxury", "Royal", "Culture"],
      catId: popularCat.id,
      expIds: [luxuryExp.id, heritageExp.id, photographyExp.id],
      metadata: {
        subtitle: "Chapter 06: The City of Lakes",
        chapterName: "Chapter 06",
        chapterTitle: "The City of Lakes",
        storyHeadline: "Mewari Palace Reflections",
        storyNarrative: "Stroll royal stone corridors where shimmering palace domes rise out of the water.",
        localSecret: "A hidden sunset viewpoint behind Sajjangarh Monsoon Palace away from the crowds.",
        photographySpot: "The marble arches of Jag Mandir island reflecting on Lake Pichola.",
        signatureExperience: "Sunset lake cruise past the floating palaces.",
        budgetRange: "₹35,000 - ₹1,40,000"
      }
    },
    {
      name: "Munnar",
      slug: "munnar-tea",
      country: "India",
      city: "Munnar",
      region: "Kerala",
      description: "Wander the rolling green carpets of Munnar's estate plantations. Learn organic spice cultivation, trek mist-covered ridges of Lockhart Gap, and experience colonial estate bungalow living.",
      images: ["/images/tours/munnar-banner.jpg"],
      price: 680,
      duration: "3 Days, 2 Nights",
      difficulty: "Easy",
      groupSize: "Max 6 travelers",
      featured: false,
      trending: false,
      latitude: 10.0889,
      longitude: 77.0595,
      adventureScore: 5,
      culturalScore: 6,
      luxuryScore: 7,
      familyScore: 9,
      foodScore: 7,
      hiddenGemScore: 7,
      bestMonths: ["September", "October", "November", "December", "January", "February", "March", "April", "May"],
      travelStyles: ["Nature", "Relaxed", "Gastronomic"],
      activities: ["Tea sorting house walk", "Lockhart Gap ridge hike", "Spice garden tour"],
      tags: ["Nature", "Relaxation", "Scenic"],
      catId: weekendCat.id,
      expIds: [natureExp.id, foodExp.id, photographyExp.id],
      metadata: {
        subtitle: "Chapter 07: The Spice Hills",
        chapterName: "Chapter 07",
        chapterTitle: "The Spice Hills",
        storyHeadline: "Mist Over the Tea Valleys",
        storyNarrative: "Walk through undulating green carpet tea plantations floating in high clouds.",
        localSecret: "An old colonial bungalow trail that leads to a hidden waterfall deep in the estate.",
        photographySpot: "The morning fog lifting over Lockhart Gap.",
        signatureExperience: "Guided walk through organic spice hills and tea processing.",
        budgetRange: "₹20,000 - ₹65,000"
      }
    },
    {
      name: "Goa",
      slug: "goa-beach",
      country: "India",
      city: "South Goa",
      region: "Goa",
      description: "Bask in the relaxed, bohemian spirit of South Goa. Unwind in luxury eco-shacks directly on the beach, explore the colorful Portuguese Latin Quarters in Fontainhas, and wander through organic spice plantations before enjoying fresh seafood curries.",
      images: ["/images/tours/goa-banner.jpg"],
      price: 600,
      duration: "4 Days, 3 Nights",
      difficulty: "Easy",
      groupSize: "Max 8 travelers",
      featured: false,
      trending: false,
      latitude: 15.2993,
      longitude: 74.1240,
      adventureScore: 3,
      culturalScore: 7,
      luxuryScore: 8,
      familyScore: 8,
      foodScore: 9,
      hiddenGemScore: 6,
      bestMonths: ["November", "December", "January", "February"],
      travelStyles: ["Beach", "Culture", "Relaxed"],
      activities: ["South beach shack rest", "Latin quarter walk", "Feni distillery tour"],
      tags: ["Beach", "Relaxation", "Food"],
      catId: weekendCat.id,
      expIds: [beachesExp.id, foodExp.id, luxuryExp.id],
      metadata: {
        subtitle: "Chapter 08: The Sun and Silt",
        chapterName: "Chapter 08",
        chapterTitle: "The Sun and Silt",
        storyHeadline: "Bohemian Palm Coves",
        storyNarrative: "Find serenity in South Goan sandy bays and old Portuguese Latin quarters.",
        localSecret: "A private spring-fed pool hidden in the jungle behind Netravali wildlife sanctuary.",
        photographySpot: "The pastel yellow facades and wooden balconies of Fontainhas.",
        signatureExperience: "Walking tour of the old Portuguese heritage mansions.",
        budgetRange: "₹25,000 - ₹75,000"
      }
    },
    {
      name: "Hampi",
      slug: "hampi-ruins",
      country: "India",
      city: "Hampi",
      region: "Karnataka",
      description: "Step into a surreal boulder-strewn landscape where the ruins of the grand Vijayanagara Empire reside. Climb Hemakuta Hill for a breathtaking sunset, cross the Tungabhadra river in a traditional round coracle boat, and lodge in a boutique heritage retreat.",
      images: ["/images/tours/hampi-banner.jpg"],
      price: 720,
      duration: "4 Days, 3 Nights",
      difficulty: "Moderate",
      groupSize: "Max 6 travelers",
      featured: true,
      trending: false,
      latitude: 15.3350,
      longitude: 76.4600,
      adventureScore: 6,
      culturalScore: 10,
      luxuryScore: 6,
      familyScore: 7,
      foodScore: 6,
      hiddenGemScore: 8,
      bestMonths: ["October", "November", "December", "January", "February"],
      travelStyles: ["Culture", "Heritage", "Adventure"],
      activities: ["Stone chariot guided walk", "Boulders sunset climb", "Coracle boat crossing"],
      tags: ["Culture", "Heritage", "Adventure"],
      catId: popularCat.id,
      expIds: [heritageExp.id, spiritualExp.id, adventureExp.id],
      metadata: {
        subtitle: "Chapter 09: The Ruins of Empire",
        chapterName: "Chapter 09",
        chapterTitle: "The Ruins of Empire",
        storyHeadline: "Surreal Boulder Landscapes",
        storyNarrative: "Explore the vast stone ruins of Vijayanagara rising from green coconut groves.",
        localSecret: "An ancient stepwell hidden behind the Queen's Bath, mostly untouched.",
        photographySpot: "Sunset silhouette from the top of Matanga Hill.",
        signatureExperience: "Crossing the Tungabhadra River in a circular woven coracle boat.",
        budgetRange: "₹20,000 - ₹55,000"
      }
    },
    {
      name: "Rann of Kutch",
      slug: "kutch-salt",
      country: "India",
      city: "Kutch",
      region: "Gujarat",
      description: "Explore the vast white salt marshlands of Kutch. Feel the stillness under a brilliant full moon, listen to Rajasthani and Kutchi folk musicians, and visit block-printing and Rogan painting artisans.",
      images: ["/images/tours/kutch-banner.jpg"],
      price: 780,
      duration: "3 Days, 2 Nights",
      difficulty: "Easy",
      groupSize: "Max 8 travelers",
      featured: false,
      trending: false,
      latitude: 23.8203,
      longitude: 69.8329,
      adventureScore: 5,
      culturalScore: 9,
      luxuryScore: 6,
      familyScore: 8,
      foodScore: 8,
      hiddenGemScore: 8,
      bestMonths: ["November", "December", "January", "February"],
      travelStyles: ["Culture", "Heritage", "Desert"],
      activities: ["Rann salt walk at dusk", "Rogan painting mini-workshop", "Ajrakh block-print center"],
      tags: ["Culture", "Heritage", "Hidden"],
      catId: popularCat.id,
      expIds: [heritageExp.id, spiritualExp.id, foodExp.id],
      metadata: {
        subtitle: "Chapter 10: The Salt Horizon",
        chapterName: "Chapter 10",
        chapterTitle: "The Salt Horizon",
        storyHeadline: "The Infinite White Salt Desert",
        storyNarrative: "Stand on a flat salt expanse that stretches to the sky, glowing under the moon.",
        localSecret: "A local Rogan painting artisan village where the craft is kept alive by only one family.",
        photographySpot: "The cracked salt crust reflecting the full moon at midnight.",
        signatureExperience: "Traditional Kutchi music around a desert campfire.",
        budgetRange: "₹30,000 - ₹85,000"
      }
    },
    {
      name: "Cherrapunji",
      slug: "cherrapunji-roots",
      country: "India",
      city: "Sohra",
      region: "Meghalaya",
      description: "Venture into Meghalaya, the abode of the clouds. Walk living root bridges bio-engineered by the indigenous Khasi tribe, discover dense cavern cascades, and walk ridges looking onto Bangladesh plains.",
      images: ["/images/tours/cherrapunji-banner.jpg"],
      price: 760,
      duration: "4 Days, 3 Nights",
      difficulty: "Moderate",
      groupSize: "Max 6 travelers",
      featured: false,
      trending: false,
      latitude: 25.2702,
      longitude: 91.7325,
      adventureScore: 8,
      culturalScore: 7,
      luxuryScore: 6,
      familyScore: 8,
      foodScore: 7,
      hiddenGemScore: 8,
      bestMonths: ["October", "November", "December", "January", "February", "March", "April", "May"],
      travelStyles: ["Nature", "Adventure", "Outdoors"],
      activities: ["Living root bridge trek", "Mawlynnong village stroll", "Cavern river search"],
      tags: ["Nature", "Adventure", "Hidden"],
      catId: popularCat.id,
      expIds: [natureExp.id, adventureExp.id, photographyExp.id],
      metadata: {
        subtitle: "Chapter 11: The Cloud Sanctuary",
        chapterName: "Chapter 11",
        chapterTitle: "The Cloud Sanctuary",
        storyHeadline: "Whispers of the Rain Forest",
        storyNarrative: "Walk across living root bridges woven by local Khasi tribes over rushing rivers.",
        localSecret: "A small, deep limestone cave called Krem Mawmluh with underground streams.",
        photographySpot: "The double-decker living root bridge at Nongriat.",
        signatureExperience: "Hike through sacred green forest valleys.",
        budgetRange: "₹22,000 - ₹60,000"
      }
    },
    {
      name: "Andaman",
      slug: "andaman-reefs",
      country: "India",
      city: "Havelock Island",
      region: "Andaman Islands",
      description: "Immerse in the pristine bays of Havelock Island. Snorkel with marine naturalists through untouched coral formations, kayak at midnight through glowing bio-luminescent mangrove streams, and rest on soft Radhanagar shores.",
      images: ["/images/tours/andaman-banner.jpg"],
      price: 1250,
      duration: "6 Days, 5 Nights",
      difficulty: "Easy",
      groupSize: "Max 6 travelers",
      featured: true,
      trending: true,
      latitude: 12.0125,
      longitude: 92.7915,
      adventureScore: 5,
      culturalScore: 5,
      luxuryScore: 9,
      familyScore: 9,
      foodScore: 8,
      hiddenGemScore: 7,
      bestMonths: ["November", "December", "January", "February", "March", "April", "May"],
      travelStyles: ["Beach", "Nature", "Relaxed"],
      activities: ["Radhanagar sunset stroll", "PADI coral reef snorkel", "Bioluminescent kayak tour"],
      tags: ["Beach", "Nature", "Relaxation"],
      catId: trendingCat.id,
      expIds: [beachesExp.id, natureExp.id, luxuryExp.id],
      metadata: {
        subtitle: "Chapter 12: The Coral Archipelago",
        chapterName: "Chapter 12",
        chapterTitle: "The Coral Archipelago",
        storyHeadline: "Pristine Sapphire Waters",
        storyNarrative: "Dive into colorful coral gardens and relax on quiet white sand beaches.",
        localSecret: "A quiet mangrove channel in Havelock Island where you can kayak in bio-luminescent water at night.",
        photographySpot: "The curved white sands of Radhanagar Beach at sunset.",
        signatureExperience: "Deep-sea snorkeling through pristine reefs.",
        budgetRange: "₹40,000 - ₹1,30,000"
      }
    }
  ];

  const createdDestinations: Record<string, any> = {};
  for (const item of destsData) {
    const dest = await prisma.destination.create({
      data: {
        name: item.name,
        slug: item.slug,
        country: item.country,
        city: item.city,
        region: item.region,
        description: item.description,
        images: item.images,
        price: item.price,
        duration: item.duration,
        difficulty: item.difficulty,
        groupSize: item.groupSize,
        featured: item.featured,
        trending: item.trending,
        latitude: item.latitude,
        longitude: item.longitude,
        adventureScore: item.adventureScore,
        culturalScore: item.culturalScore,
        luxuryScore: item.luxuryScore,
        familyScore: item.familyScore,
        foodScore: item.foodScore,
        hiddenGemScore: item.hiddenGemScore,
        bestMonths: item.bestMonths,
        travelStyles: item.travelStyles,
        activities: item.activities,
        tags: item.tags,
        categories: { connect: [{ id: item.catId }] },
        experiences: { connect: item.expIds.map(id => ({ id })) },
        metadata: item.metadata
      }
    });
    createdDestinations[dest.slug] = dest;
  }

  console.log("Seeding users...");
  const user1 = await prisma.user.create({
    data: {
      name: "Aarav Mehta",
      email: "aarav.mehta@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
      role: "USER"
    }
  });
  const user2 = await prisma.user.create({
    data: {
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      role: "USER"
    }
  });
  const user3 = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
      role: "USER"
    }
  });
  const user4 = await prisma.user.create({
    data: {
      name: "Pooja Patel",
      email: "pooja.patel@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja",
      role: "USER"
    }
  });
  const user5 = await prisma.user.create({
    data: {
      name: "Kabir Sharma",
      email: "kabir.sharma@example.com",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
      role: "USER"
    }
  });

  console.log("Seeding reviews...");
  const reviews = [
    {
      userId: user1.id,
      slug: "varanasi-spiritual",
      rating: 5,
      comment: "A deeply spiritual and transformational experience. The evening Ganga Aarti from the wooden boat is something I will never forget."
    },
    {
      userId: user2.id,
      slug: "varanasi-spiritual",
      rating: 4,
      comment: "Varanasi is crowded but beautiful. Walking the narrow alleys and drinking chai from clay cups was wonderful."
    },
    {
      userId: user3.id,
      slug: "jaisalmer-fort",
      rating: 5,
      comment: "Staying inside the living fort was like stepping back in time. The sunset jeep safari in Thar desert was incredible!"
    },
    {
      userId: user4.id,
      slug: "kerala-houseboats",
      rating: 5,
      comment: "Absolute paradise. Floating through the Vembanad Lake while eating freshly cooked pearl-spot fish is pure relaxation."
    },
    {
      userId: user5.id,
      slug: "ladakh-passes",
      rating: 5,
      comment: "A true adventure of a lifetime. The high-altitude passes are challenging but the view of Pangong Tso makes it worth every bit."
    },
    {
      userId: user1.id,
      slug: "kashmir-meadows",
      rating: 5,
      comment: "Kashmir really is heaven on earth. The heritage houseboats on Dal lake are beautifully carved and very comfortable."
    },
    {
      userId: user2.id,
      slug: "udaipur-mewar",
      rating: 5,
      comment: "Udaipur has a royal charm like no other. Watching the palace lights reflect on Lake Pichola during sunset is magical."
    },
    {
      userId: user3.id,
      slug: "munnar-tea",
      rating: 4,
      comment: "Lush green tea gardens and mist. It's a serene weekend escape, perfect for slow travel and relaxation."
    },
    {
      userId: user4.id,
      slug: "goa-beach",
      rating: 5,
      comment: "South Goa is so peaceful and clean. Loved the eco-shacks and walking the Portuguese Latin Quarters."
    },
    {
      userId: user5.id,
      slug: "hampi-ruins",
      rating: 5,
      comment: "Surreal boulder landscapes and magnificent ruins. Crossing the Tungabhadra river in a coracle boat was a highlight!"
    },
    {
      userId: user1.id,
      slug: "kutch-salt",
      rating: 5,
      comment: "The endless white salt flat desert is breathtaking, especially under the full moon. Truly an out-of-this-world sight."
    },
    {
      userId: user2.id,
      slug: "cherrapunji-roots",
      rating: 5,
      comment: "The living root bridges are a biological wonder. Trekking down the hills was challenging but extremely rewarding."
    },
    {
      userId: user3.id,
      slug: "andaman-reefs",
      rating: 5,
      comment: "Turquoise waters, white sand beaches, and excellent snorkeling. Bioluminescent kayaking was a dream come true!"
    }
  ];

  for (const r of reviews) {
    const dest = createdDestinations[r.slug];
    if (dest) {
      await prisma.review.create({
        data: {
          userId: r.userId,
          destinationId: dest.id,
          rating: r.rating,
          comment: r.comment
        }
      });
    }
  }

  console.log("Seeding saved itineraries...");
  const varanasiDest = createdDestinations["varanasi-spiritual"];
  if (varanasiDest) {
    await prisma.savedItinerary.create({
      data: {
        userId: user1.id,
        title: "Odyssey of the Soul: Varanasi",
        destination: varanasiDest.id,
        budget: 45000,
        duration: 3,
        itinerary: {
          days: [
            {
              title: "Sacred Ganges & Sunset Devotion",
              description: "Begin your spiritual odyssey on the banks of Varanasi. Witness the ancient fire rituals and sunrise prayers.",
              activities: [
                "Early morning sunrise boat ride on the Ganges to witness bathing rituals",
                "Explore the narrow heritage lanes of the old city and savor clay-pot malaiyo",
                "Watch the grand Ganga Aarti ceremony from a private Bajra boat at sunset"
              ]
            },
            {
              title: "Silk Weavers & Vedic Philosophy",
              description: "Explore the ancient craftsmanship and philosophical heritage of the city.",
              activities: [
                "Visit the traditional silk weavers of the Sarai Mohalla district",
                "Private chanting session and discussion with Vedic scholars",
                "Walk through the historic ghats and visit the ancient temples"
              ]
            },
            {
              title: "Sarnath Excursion & Departure",
              description: "Conclude your journey where Buddhism was first taught.",
              activities: [
                "Half-day excursion to the peaceful archaeological park of Sarnath",
                "Visit the Dhamek Stupa and Sarnath Museum",
                "Savor a traditional sattvik thali meal before heading home"
              ]
            }
          ],
          costs: {
            transit: 15000,
            stay: 20000,
            food: 10000,
            total: 45000
          },
          weather: { temperature: "20°C - 26°C", conditions: "Clear & Pleasant" },
          recommendationScore: 98,
          recommendationReasoning: "A perfect blend of spiritual ceremonies and heritage crafts."
        }
      }
    });
  }

  const jaisalmerDest = createdDestinations["jaisalmer-fort"];
  if (jaisalmerDest) {
    await prisma.savedItinerary.create({
      data: {
        userId: user1.id,
        title: "Golden Sands & Stone Forts",
        destination: jaisalmerDest.id,
        budget: 55000,
        duration: 3,
        itinerary: {
          days: [
            {
              title: "Citadel of the Sun",
              description: "Explore the only living sand fort in Rajasthan, a medieval fortress housing local families.",
              activities: [
                "Guided walking tour of the Golden Fort including Raj Mahal",
                "Visit the beautifully carved Patwon ki Haveli",
                "Sunset views from the cenotaphs of Vyas Chhatri"
              ]
            },
            {
              title: "Thar Desert Dunes Caravan",
              description: "Journey into the Thar Desert for a night under the stars in camel canopy tents.",
              activities: [
                "Visit the abandoned stepwells and ruins of Kuldhara village",
                "Camel caravan trek into the Sam Sand Dunes at golden hour",
                "Traditional Rajasthani folk music and dinner around the campfire"
              ]
            },
            {
              title: "Desert Wildlife & Lakes",
              description: "Observe the desert ecosystem and local lake reservoirs.",
              activities: [
                "Morning boat ride on the scenic Gadisar Lake",
                "Visit the Desert Cultural Center and Museum",
                "Local spice shopping and hand-blocked textile shopping in the town"
              ]
            }
          ],
          costs: {
            transit: 18000,
            stay: 25000,
            food: 12000,
            total: 55000
          },
          weather: { temperature: "18°C - 28°C", conditions: "Sunny & Dry" },
          recommendationScore: 95,
          recommendationReasoning: "Ideal for travelers seeking fort heritage and desert camping."
        }
      }
    });
  }

  console.log("Database seeded successfully with 12 Indian Chapters and demo user data!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
