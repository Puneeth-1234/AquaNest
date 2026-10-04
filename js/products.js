/**
 * AquaNest - Products Catalog & Data Service
 * Comprehensive dataset of premium ornamental aquarium fish
 * Prices in Indian Rupees (INR - ₹)
 */

const AQUANEST_PRODUCTS = [
  // --- KOI FISH ---
  {
    id: "koi-kohaku",
    name: "Kohaku Japanese Koi",
    category: "Koi Fish",
    categorySlug: "koi-fish",
    price: 1499,
    oldPrice: 1899,
    rating: 4.9,
    reviewsCount: 42,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "21% OFF",
    image: "images/koi-kohaku.jpg",
    fallbackColor: "#e63946",
    shortDescription: "Iconic white body with vibrant, fire-engine red (Hi) patterns. Handpicked for balanced pond symmetry.",
    fullDescription: "The Kohaku is considered the crown jewel of Japanese Nishikigoi. This premium specimen features a pristine snow-white base adorned with vivid crimson stepped markings. Bred from champion lineages, our Kohaku exhibit calm temperaments, hearty appetites, and radiant coloration that intensifies as they mature in outdoor ponds or expansive indoor aquariums.",
    specs: {
      scientificName: "Cyprinus carpio rubrofuscus",
      careLevel: "Intermediate",
      temperament: "Peaceful & Social",
      minTankSize: "250+ Gallons (Pond recommended)",
      temperature: "15°C – 25°C",
      phRange: "7.0 – 8.2",
      diet: "Omnivorous – floating spirulina pellets & wheatgerm",
      adultSize: "24 – 36 inches",
      lifespan: "25 – 35+ Years",
      liveArrivalGuarantee: "100% Live Arrival Guarantee in triple-insulated oxygen crates."
    },
    stock: 12
  },
  {
    id: "koi-showa",
    name: "Showa Sanshoku Tri-Color Koi",
    category: "Koi Fish",
    categorySlug: "koi-fish",
    price: 1850,
    oldPrice: 2200,
    rating: 4.8,
    reviewsCount: 29,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: true,
    discountBadge: "16% OFF",
    image: "images/koi-showa.jpg",
    fallbackColor: "#1d3557",
    shortDescription: "Dramatic triad of deep sumi-black, radiant red, and clean white cresting across muscular fins.",
    fullDescription: "Showa Sanshoku displays a captivating lacquer-black foundation interlaced with brilliant crimson and pure white accents. As one of the 'Gosanke' big three koi varieties, each fish carries an unpredictable and majestic pattern that transforms over time, making it an extraordinary centerpiece for koi enthusiasts.",
    specs: {
      scientificName: "Cyprinus carpio",
      careLevel: "Intermediate",
      temperament: "Peaceful & Gregarious",
      minTankSize: "300+ Gallons",
      temperature: "16°C – 24°C",
      phRange: "7.2 – 8.0",
      diet: "High-protein growth pellets, krill, and fresh greens",
      adultSize: "26 – 32 inches",
      lifespan: "25 – 35+ Years",
      liveArrivalGuarantee: "Medical quarantine certified prior to dispatch."
    },
    stock: 8
  },
  {
    id: "koi-yamabuki",
    name: "Yamabuki Ogon Metallic Koi",
    category: "Koi Fish",
    categorySlug: "koi-fish",
    price: 1650,
    oldPrice: 1950,
    rating: 4.9,
    reviewsCount: 31,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: false,
    discountBadge: "15% OFF",
    image: "images/koi-yamabuki.jpg",
    fallbackColor: "#f4a261",
    shortDescription: "Gleaming golden-yellow metallic luster that catches sunlight beneath crystal pond ripples.",
    fullDescription: "The Yamabuki Ogon is celebrated for its solid, shimmering metallic lemon-gold scales that gleam like bullion under water. Known for friendly, puppy-like personalities, Yamabuki are often the first koi to hand-feed at the water's surface.",
    specs: {
      scientificName: "Cyprinus carpio",
      careLevel: "Beginner",
      temperament: "Exceptionally Tame",
      minTankSize: "250+ Gallons",
      temperature: "14°C – 25°C",
      phRange: "7.0 – 8.0",
      diet: "Omnivorous – color-enhancing micro pellets",
      adultSize: "22 – 30 inches",
      lifespan: "25 – 35+ Years",
      liveArrivalGuarantee: "Oxygenated transit with thermal insulation."
    },
    stock: 15
  },

  // --- GOLDFISH ---
  {
    id: "goldfish-redcap",
    name: "Red Cap Oranda Fancy Goldfish",
    category: "Goldfish",
    categorySlug: "goldfish",
    price: 649,
    oldPrice: 850,
    rating: 4.9,
    reviewsCount: 68,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "24% OFF",
    image: "images/goldfish-redcap.jpg",
    fallbackColor: "#e63946",
    shortDescription: "Pearly white metallic body crowned with a cherry-red raspberry wen (head growth) and flowing fins.",
    fullDescription: "Red Cap Orandas are among the most beloved fancy goldfish in the world. With their iconic crimson 'wen' atop an alabaster, round silhouette and billowing veil-like tail fins, they bring grace and playful charm to well-filtered freshwater aquariums.",
    specs: {
      scientificName: "Carassius auratus",
      careLevel: "Beginner to Intermediate",
      temperament: "Peaceful & Docile",
      minTankSize: "30 Gallons",
      temperature: "18°C – 23°C",
      phRange: "7.0 – 7.8",
      diet: "Sinking goldfish pellets, boiled peas, and bloodworms",
      adultSize: "7 – 9 inches",
      lifespan: "10 – 15 Years",
      liveArrivalGuarantee: "Shipped in dual-layer oxygen packs with stress coat."
    },
    stock: 24
  },
  {
    id: "goldfish-blackmoor",
    name: "Black Moor Telescope Goldfish",
    category: "Goldfish",
    categorySlug: "goldfish",
    price: 549,
    oldPrice: 699,
    rating: 4.7,
    reviewsCount: 51,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: true,
    discountBadge: "21% OFF",
    image: "images/goldfish-blackmoor.jpg",
    fallbackColor: "#1d2d44",
    shortDescription: "Velvety midnight-black scales with expressive globe-like telescope eyes and feathery double tails.",
    fullDescription: "The Black Moor is a timeless classic featuring velvety matte black coloration and striking protruding eyes. Known for their calm swimming demeanor, they thrive in gentle-flow aquariums with smooth river stones and rounded driftwood.",
    specs: {
      scientificName: "Carassius auratus",
      careLevel: "Beginner",
      temperament: "Peaceful",
      minTankSize: "30 Gallons",
      temperature: "18°C – 24°C",
      phRange: "7.0 – 7.6",
      diet: "Sinking pellets and blanched spinach",
      adultSize: "6 – 8 inches",
      lifespan: "10 – 15 Years",
      liveArrivalGuarantee: "Special buffered water conditioning for eye safety."
    },
    stock: 19
  },
  {
    id: "goldfish-calico",
    name: "Calico Ryukin Fancy Goldfish",
    category: "Goldfish",
    categorySlug: "goldfish",
    price: 799,
    oldPrice: 999,
    rating: 4.8,
    reviewsCount: 37,
    isTrending: false,
    isBestSeller: false,
    isSpecialOffer: false,
    discountBadge: "20% OFF",
    image: "images/goldfish-calico.jpg",
    fallbackColor: "#f77f00",
    shortDescription: "High arched shoulder hump splashed with calico motley shades of orange, midnight, and cyan-blue.",
    fullDescription: "Originating in the Ryukyu Islands, the Ryukin goldfish is distinguished by its high, pointed dorsal hump and compact diamond shape. This calico specimen features a mosaic of translucent mother-of-pearl scales with vivid blue, black, and fiery orange patches.",
    specs: {
      scientificName: "Carassius auratus",
      careLevel: "Intermediate",
      temperament: "Active & Peaceful",
      minTankSize: "35 Gallons",
      temperature: "18°C – 23°C",
      phRange: "7.0 – 7.8",
      diet: "Sinking nutrient sticks, daphnia, and brine shrimp",
      adultSize: "8 – 10 inches",
      lifespan: "10 – 15 Years",
      liveArrivalGuarantee: "Carefully aerated priority courier shipping."
    },
    stock: 14
  },

  // --- GUPPY ---
  {
    id: "guppy-blue-moscow",
    name: "Blue Moscow Guppy Trio (1M + 2F)",
    category: "Guppy",
    categorySlug: "guppy",
    price: 399,
    oldPrice: 550,
    rating: 4.9,
    reviewsCount: 94,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "27% OFF",
    image: "images/guppy-blue-moscow.jpg",
    fallbackColor: "#0077b6",
    shortDescription: "Deep electric cobalt body with sweeping veil fins. Breeding trio of 1 prime male and 2 healthy females.",
    fullDescription: "Blue Moscow Guppies are widely recognized as one of the purest and most breathtaking strain lines. Males flaunt solid metallic navy-to-cyan plumage from snout to delta tail, with exceptional fin span. Highly prolific and peaceful, they are perfect for planted tanks.",
    specs: {
      scientificName: "Poecilia reticulata",
      careLevel: "Beginner Friendly",
      temperament: "Extremely Peaceful",
      minTankSize: "10 Gallons",
      temperature: "22°C – 28°C",
      phRange: "6.8 – 7.8",
      diet: "Micro-pellets, spirulina flakes, baby brine shrimp",
      adultSize: "1.5 – 2.2 inches",
      lifespan: "2 – 3 Years",
      liveArrivalGuarantee: "Guaranteed 1 Male + 2 Females live arrival."
    },
    stock: 45
  },
  {
    id: "guppy-dumbo-ear",
    name: "Red Dragon Dumbo Ear Guppy Pair",
    category: "Guppy",
    categorySlug: "guppy",
    price: 499,
    oldPrice: 650,
    rating: 4.8,
    reviewsCount: 58,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: true,
    discountBadge: "23% OFF",
    image: "images/guppy-dumbo-ear.jpg",
    fallbackColor: "#d90429",
    shortDescription: "Enlarged pectoral elephant-ear fins with scarlet dragon-scale tail and iridescent body shimmer.",
    fullDescription: "The Dumbo Ear Red Dragon guppy is famous for its exaggerated, wing-like pectoral fins that flutter like butterfly wings. Combined with intricate scarlet dragon-skin body iridescence, this mated pair adds dynamic movement to any nano aquarium.",
    specs: {
      scientificName: "Poecilia reticulata",
      careLevel: "Beginner",
      temperament: "Peaceful Community",
      minTankSize: "10 Gallons",
      temperature: "23°C – 27°C",
      phRange: "7.0 – 8.0",
      diet: "Crushed flakes, live microworms, and decapsulated brine cysts",
      adultSize: "1.8 – 2.4 inches",
      lifespan: "2 – 3 Years",
      liveArrivalGuarantee: "Individual breeder pods for zero fin-nipping."
    },
    stock: 22
  },
  {
    id: "guppy-snakeskin",
    name: "Yellow Cobra Snakeskin Guppy Trio",
    category: "Guppy",
    categorySlug: "guppy",
    price: 420,
    oldPrice: 520,
    rating: 4.7,
    reviewsCount: 39,
    isTrending: false,
    isBestSeller: false,
    isSpecialOffer: false,
    discountBadge: "19% OFF",
    image: "images/guppy-snakeskin.jpg",
    fallbackColor: "#ffb703",
    shortDescription: "Intricate black-and-gold rosette filigree webbing across radiant yellow fan tail.",
    fullDescription: "Yellow Cobra Snakeskin guppies carry an intricate lace or rosette pattern resembling reptile scales that seamlessly flows into a vibrant fan tail. A trio of 1 vibrant male and 2 fertile females ideal for hobbyist breeding setups.",
    specs: {
      scientificName: "Poecilia reticulata",
      careLevel: "Beginner",
      temperament: "Peaceful",
      minTankSize: "10 Gallons",
      temperature: "22°C – 28°C",
      phRange: "7.0 – 7.8",
      diet: "Omnivore flake food, frozen daphnia",
      adultSize: "1.5 – 2.0 inches",
      lifespan: "2 – 3 Years",
      liveArrivalGuarantee: "Guaranteed vibrant and disease-free."
    },
    stock: 30
  },

  // --- BETTA ---
  {
    id: "betta-royal-blue",
    name: "Halfmoon King Betta – Royal Blue",
    category: "Betta",
    categorySlug: "betta",
    price: 899,
    oldPrice: 1199,
    rating: 5.0,
    reviewsCount: 112,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "25% OFF",
    image: "images/betta-royal-blue.jpg",
    fallbackColor: "#03045e",
    shortDescription: "Dramatic 180-degree semicircular caudal flare with sapphire blue and violet undertones.",
    fullDescription: "Our Show-Quality Royal Blue Halfmoon Betta represents the pinnacle of captive selective breeding. When flared, its tail forms a flawless 180-degree arch with layered, ruffled edges. He possesses a confident personality and thrives in heavily planted 5-15 gallon desktop aquariums.",
    specs: {
      scientificName: "Betta splendens",
      careLevel: "Beginner Friendly",
      temperament: "Solitary (Peaceful with snails & shrimp)",
      minTankSize: "5 – 10 Gallons",
      temperature: "24°C – 29°C",
      phRange: "6.5 – 7.5",
      diet: "Betta bio-pellets, freeze-dried bloodworms, live daphnia",
      adultSize: "2.5 – 3.0 inches",
      lifespan: "3 – 5 Years",
      liveArrivalGuarantee: "Single-specimen cushioned transit pod with warm pack."
    },
    stock: 18
  },
  {
    id: "betta-crowntail",
    name: "Black Orchid Crowntail Betta",
    category: "Betta",
    categorySlug: "betta",
    price: 749,
    oldPrice: 950,
    rating: 4.8,
    reviewsCount: 48,
    isTrending: false,
    isBestSeller: false,
    isSpecialOffer: true,
    discountBadge: "21% OFF",
    image: "images/betta-crowntail.jpg",
    fallbackColor: "#14213d",
    shortDescription: "Pointed ray webbing resembling a spiky gothic crown with deep obsidian and teal highlights.",
    fullDescription: "The Black Orchid Crowntail features reduced webbing between fin rays, producing a sharp, spiny crown aesthetic. Its stealthy black body gives off iridescent teal highlights under targeted aquarium lighting.",
    specs: {
      scientificName: "Betta splendens",
      careLevel: "Beginner",
      temperament: "Solitary Male",
      minTankSize: "5 Gallons",
      temperature: "24°C – 28°C",
      phRange: "6.5 – 7.2",
      diet: "Floating carnivore granules and mysis shrimp",
      adultSize: "2.5 inches",
      lifespan: "3 – 5 Years",
      liveArrivalGuarantee: "100% fin integrity live arrival warranty."
    },
    stock: 15
  },
  {
    id: "betta-alien",
    name: "Alien Metallic Green Betta",
    category: "Betta",
    categorySlug: "betta",
    price: 1299,
    oldPrice: 1600,
    rating: 4.9,
    reviewsCount: 35,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: false,
    discountBadge: "19% OFF",
    image: "images/betta-alien.jpg",
    fallbackColor: "#2a9d8f",
    shortDescription: "Rare wild-hybrid strain with full-body emerald green metallic armor and short hydrodynamic fins.",
    fullDescription: "Alien Bettas are a masterfully engineered hybrid of wild Betta smaragdina, imbellis, and splendens. Unlike traditional domestic longfins, Aliens have full-body metallic scales wrapping right over their face and gills, combined with agile, acrobatic swimming power.",
    specs: {
      scientificName: "Betta hybrid (Alien)",
      careLevel: "Intermediate",
      temperament: "Curious & Alert",
      minTankSize: "7 Gallons",
      temperature: "25°C – 29°C",
      phRange: "6.0 – 7.2",
      diet: "High-protein live grindal worms, premium pellets",
      adultSize: "2.2 – 2.6 inches",
      lifespan: "3 – 5 Years",
      liveArrivalGuarantee: "Special oxygen saturation packing."
    },
    stock: 0
  },

  // --- MOLLY ---
  {
    id: "molly-dalmatian",
    name: "Dalmatian Highfin Molly (Pack of 4)",
    category: "Molly",
    categorySlug: "molly",
    price: 320,
    oldPrice: 420,
    rating: 4.8,
    reviewsCount: 73,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "24% OFF",
    image: "images/molly-dalmatian.jpg",
    fallbackColor: "#e5e5e5",
    shortDescription: "Crisp chalk-white body peppered with ink-black speckles. Superb natural algae grazers.",
    fullDescription: "Dalmatian Mollies are lively, hardy livebearers adorned with black spots scattered across a snow-white body. They are naturally energetic, peace-loving community fish that happily peck at soft algae on plants and rocks, keeping your tank sparkling clean.",
    specs: {
      scientificName: "Poecilia sphenops",
      careLevel: "Beginner",
      temperament: "Peaceful Community",
      minTankSize: "20 Gallons",
      temperature: "22°C – 28°C",
      phRange: "7.2 – 8.2",
      diet: "Omnivore flakes, blanched zucchini, algae wafers",
      adultSize: "3 – 4 inches",
      lifespan: "3 – 5 Years",
      liveArrivalGuarantee: "Balanced group pack of healthy juveniles."
    },
    stock: 35
  },
  {
    id: "molly-black-lyretail",
    name: "Midnight Black Lyretail Molly (Pack of 4)",
    category: "Molly",
    categorySlug: "molly",
    price: 280,
    oldPrice: 380,
    rating: 4.7,
    reviewsCount: 46,
    isTrending: false,
    isBestSeller: false,
    isSpecialOffer: true,
    discountBadge: "26% OFF",
    image: "images/molly-black-lyretail.jpg",
    fallbackColor: "#22223b",
    shortDescription: "Sleek jet-black velvet body with sweeping crescent moon lyretail filaments.",
    fullDescription: "The Black Lyretail Molly features an alluring all-black body accented by an extended, harp-shaped tail fin. They are exceptionally hardy, adaptable to a wide range of water conditions (including mildly brackish water), and get along with all gentle tank mates.",
    specs: {
      scientificName: "Poecilia latipinna / sphenops",
      careLevel: "Beginner",
      temperament: "Peaceful",
      minTankSize: "20 Gallons",
      temperature: "23°C – 28°C",
      phRange: "7.0 – 8.2",
      diet: "Vegetable flakes, spirulina granules, tubifex",
      adultSize: "3.5 inches",
      lifespan: "3 – 5 Years",
      liveArrivalGuarantee: "100% Live Arrival Guarantee."
    },
    stock: 40
  },

  // --- ANGELFISH ---
  {
    id: "angelfish-platinum",
    name: "Platinum White Angelfish",
    category: "Angelfish",
    categorySlug: "angelfish",
    price: 480,
    oldPrice: 650,
    rating: 4.9,
    reviewsCount: 63,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "26% OFF",
    image: "images/angelfish-platinum.jpg",
    fallbackColor: "#e0e1dd",
    shortDescription: "Regal diamond disc body with shimmering mother-of-pearl scales and elongated ventral feelers.",
    fullDescription: "Platinum Angelfish are prized for their pure, unblemished pearl-white iridescent scales that reflect silver and icy cyan tints. Their grand triangular dorsal and anal fins stretch vertically, creating an ethereal presence in tall, planted aquariums.",
    specs: {
      scientificName: "Pterophyllum scalare",
      careLevel: "Intermediate",
      temperament: "Semi-Aggressive (Peaceful with proper tank mates)",
      minTankSize: "30 Gallons (Tall tanks preferred)",
      temperature: "24°C – 29°C",
      phRange: "6.5 – 7.4",
      diet: "Slow-sinking cichlid crisps, frozen bloodworms, live artemia",
      adultSize: "6 inches long, 8 inches tall",
      lifespan: "10 – 12 Years",
      liveArrivalGuarantee: "Vertical support travel packs to prevent dorsal bent."
    },
    stock: 20
  },
  {
    id: "angelfish-marble",
    name: "Altum Zebra Marble Angelfish",
    category: "Angelfish",
    categorySlug: "angelfish",
    price: 590,
    oldPrice: 750,
    rating: 4.8,
    reviewsCount: 31,
    isTrending: false,
    isBestSeller: false,
    isSpecialOffer: true,
    discountBadge: "21% OFF",
    image: "images/angelfish-marble.jpg",
    fallbackColor: "#4a5568",
    shortDescription: "Artistic black-and-silver zebra striping with golden crown highlights and stately fins.",
    fullDescription: "Zebra Marble Angelfish showcase bold, contrasting black vertical bars intertwined with irregular marbled splashes. Reared in pristine freshwater parameters, these juveniles adapt seamlessly into mature community aquariums.",
    specs: {
      scientificName: "Pterophyllum scalare",
      careLevel: "Intermediate",
      temperament: "Semi-Aggressive",
      minTankSize: "40 Gallons",
      temperature: "25°C – 29°C",
      phRange: "6.5 – 7.2",
      diet: "Cichlid flakes, brine shrimp, finely chopped krill",
      adultSize: "6 – 7 inches long",
      lifespan: "10 – 12 Years",
      liveArrivalGuarantee: "Insulated box with active heating pad in winter."
    },
    stock: 16
  },
  {
    id: "angelfish-koi",
    name: "Red Devil Koi Angelfish",
    category: "Angelfish",
    categorySlug: "angelfish",
    price: 699,
    oldPrice: 899,
    rating: 4.9,
    reviewsCount: 41,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: false,
    discountBadge: "22% OFF",
    image: "images/angelfish-koi.jpg",
    fallbackColor: "#e65100",
    shortDescription: "Intense fiery orange crown and dorsal with piebald black-and-white marbled flanks.",
    fullDescription: "Red Devil Koi Angelfish are selectively bred for their striking sunset-orange forehead pigmentation that spreads down across the upper body. Combined with broken black patterns, they offer a majestic visual resembling koi ponds in a high aquarium.",
    specs: {
      scientificName: "Pterophyllum scalare",
      careLevel: "Intermediate",
      temperament: "Semi-Aggressive Cichlid",
      minTankSize: "35 Gallons",
      temperature: "24°C – 29°C",
      phRange: "6.6 – 7.4",
      diet: "Protein-rich sinking granules and freeze-dried tubifex",
      adultSize: "6 inches long, 8 inches tall",
      lifespan: "10 – 12 Years",
      liveArrivalGuarantee: "Individually bagged with pure oxygen infusion."
    },
    stock: 11
  },

  // --- TETRA ---
  {
    id: "tetra-neon",
    name: "Neon Tetra School (Pack of 10)",
    category: "Tetra",
    categorySlug: "tetra",
    price: 499,
    oldPrice: 650,
    rating: 4.9,
    reviewsCount: 154,
    isTrending: true,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "23% OFF",
    image: "images/tetra-neon.jpg",
    fallbackColor: "#00b4d8",
    shortDescription: "Iridescent electric-blue stripe alongside a glowing scarlet tail. Mesmerizing tight-schooling fish.",
    fullDescription: "Neon Tetras are the undisputed royalty of planted freshwater aquariums. Their horizontal neon-cyan horizontal stripe shines like LED lighting against green vegetation and dark aquarium substrates. This pack of 10 creates a cohesive, synchronized swimming school.",
    specs: {
      scientificName: "Paracheirodon innesi",
      careLevel: "Beginner",
      temperament: "Peaceful Community Schooling",
      minTankSize: "15 Gallons",
      temperature: "21°C – 26°C",
      phRange: "6.0 – 7.0",
      diet: "Micro-pellets, crushed flake food, cyclops",
      adultSize: "1.2 inches",
      lifespan: "5 – 8 Years",
      liveArrivalGuarantee: "Oxygenated school bag with temperature buffering."
    },
    stock: 60
  },
  {
    id: "tetra-cardinal",
    name: "Cardinal Tetra School (Pack of 8)",
    category: "Tetra",
    categorySlug: "tetra",
    price: 599,
    oldPrice: 750,
    rating: 4.9,
    reviewsCount: 88,
    isTrending: false,
    isBestSeller: true,
    isSpecialOffer: false,
    discountBadge: "20% OFF",
    image: "images/tetra-cardinal.jpg",
    fallbackColor: "#e63946",
    shortDescription: "Full-length blazing crimson belly stripe matched with luminous cyan-blue back. Larger than Neons.",
    fullDescription: "Often confused with Neons, Cardinal Tetras are distinguished by a full unbroken red belly band stretching from snout all the way to caudal fin. They are slightly larger, love warm soft water, and form breathtaking constellations across Amazonian biotope tanks.",
    specs: {
      scientificName: "Paracheirodon axelrodi",
      careLevel: "Intermediate",
      temperament: "Peaceful Schooler",
      minTankSize: "20 Gallons",
      temperature: "24°C – 29°C",
      phRange: "5.5 – 6.8",
      diet: "Fine micro granules, daphnia, baby brine shrimp",
      adultSize: "1.5 – 1.8 inches",
      lifespan: "5 – 8 Years",
      liveArrivalGuarantee: "Conditioned soft-water packing."
    },
    stock: 45
  },
  {
    id: "tetra-rummynose",
    name: "Brilliant Rummy Nose Tetra (Pack of 6)",
    category: "Tetra",
    categorySlug: "tetra",
    price: 450,
    oldPrice: 580,
    rating: 4.8,
    reviewsCount: 52,
    isTrending: true,
    isBestSeller: false,
    isSpecialOffer: true,
    discountBadge: "22% OFF",
    image: "images/tetra-rummynose.jpg",
    fallbackColor: "#d90429",
    shortDescription: "Ruby-red face with zebra striped black-and-white tail fin. The tightest schooling tetra species.",
    fullDescription: "Rummy Nose Tetras are renowned among aquascapers for their tight schooling discipline and their ability to act as a natural barometer: their red snout turns deep cherry-red when water quality is optimal. A pack of 6 adds synchronized elegance to peaceful community setups.",
    specs: {
      scientificName: "Hemigrammus rhodostomus",
      careLevel: "Intermediate",
      temperament: "Very Peaceful Schooler",
      minTankSize: "20 Gallons",
      temperature: "24°C – 28°C",
      phRange: "6.0 – 7.2",
      diet: "High quality micro bites, spirulina crumbles",
      adultSize: "1.75 inches",
      lifespan: "5 – 8 Years",
      liveArrivalGuarantee: "100% Live Arrival Guarantee."
    },
    stock: 35
  }
];

// Category Definitions
const AQUANEST_CATEGORIES = [
  {
    name: "Koi Fish",
    slug: "koi-fish",
    description: "Living jewels of outdoor ponds and grand water gardens.",
    speciesCount: "12+ Varieties",
    image: "images/koi-general.jpg",
    color: "#e63946"
  },
  {
    name: "Goldfish",
    slug: "goldfish",
    description: "Orandas, Black Moors, and majestic Ryukins for home tanks.",
    speciesCount: "15+ Varieties",
    image: "images/goldfish-general.jpg",
    color: "#f77f00"
  },
  {
    name: "Guppy",
    slug: "guppy",
    description: "Vibrant tail fans, dazzling strains, and prolific nano breeders.",
    speciesCount: "20+ Varieties",
    image: "images/guppy-general.jpg",
    color: "#00b4d8"
  },
  {
    name: "Betta",
    slug: "betta",
    description: "Feisty, solitary warriors with flowing 180° silk fins.",
    speciesCount: "18+ Varieties",
    image: "images/betta-general.jpg",
    color: "#7209b7"
  },
  {
    name: "Molly",
    slug: "molly",
    description: "Hardy, energetic livebearers that naturally control algae.",
    speciesCount: "10+ Varieties",
    image: "images/molly-general.jpg",
    color: "#4a5568"
  },
  {
    name: "Angelfish",
    slug: "angelfish",
    description: "Stately, triangular silhouetted cichlids for tall planted tanks.",
    speciesCount: "8+ Varieties",
    image: "images/angelfish-general.jpg",
    color: "#0077b6"
  },
  {
    name: "Tetra",
    slug: "tetra",
    description: "Luminous, schooling gems that illuminate dense aquascapes.",
    speciesCount: "14+ Varieties",
    image: "images/tetra-general.jpg",
    color: "#06d6a0"
  }
];

// Storage Keys
const PRODUCTS_STORAGE_KEY = 'aquanest_products_v1';

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading products from localStorage', e);
  }
  // Initialize localStorage with default catalog if not present
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(AQUANEST_PRODUCTS));
  } catch (e) {}
  return AQUANEST_PRODUCTS;
}

function saveAllProducts(productsArray) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsArray));
    window.dispatchEvent(new CustomEvent('aquanest:productsUpdated', { detail: { products: productsArray } }));
    return true;
  } catch (e) {
    console.error('Error saving products to localStorage', e);
    return false;
  }
}

function resetProductsToDefault() {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(AQUANEST_PRODUCTS));
    window.dispatchEvent(new CustomEvent('aquanest:productsUpdated', { detail: { products: AQUANEST_PRODUCTS } }));
    return AQUANEST_PRODUCTS;
  } catch (e) {
    console.error('Error resetting products', e);
    return AQUANEST_PRODUCTS;
  }
}

/* ==========================================================================
   AquaNest REST API Service (Configurable Architecture)
   ========================================================================== */
function resolveApiBaseUrl() {
  if (typeof window !== 'undefined') {
    if (window.AQUANEST_CONFIG && window.AQUANEST_CONFIG.API_BASE_URL) {
      return window.AQUANEST_CONFIG.API_BASE_URL;
    }
    if (window.AQUANEST_API_URL) {
      return window.AQUANEST_API_URL;
    }
    const isLocal = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]' ||
      window.location.protocol === 'file:' ||
      !window.location.hostname
    );
    if (!isLocal && window.location.origin && window.location.protocol.startsWith('http')) {
      return `${window.location.origin}/api`;
    }
  }
  return 'http://localhost:5000/api';
}

const AquaNestAPI = {
  baseUrl: resolveApiBaseUrl(),
  isOnline: true,
  lastError: null,

  // Allows runtime reconfiguration of API endpoint
  setBaseUrl(url) {
    if (url && typeof url === 'string') {
      this.baseUrl = url.replace(/\/+$/, '');
    }
  },

  // Auth Token & Session Management
  getToken() {
    try {
      return localStorage.getItem('aquanest_token') || sessionStorage.getItem('aquanest_token') || null;
    } catch (e) {
      return null;
    }
  },

  getUser() {
    try {
      const u = localStorage.getItem('aquanest_user') || sessionStorage.getItem('aquanest_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  getAdminToken() {
    try {
      return localStorage.getItem('aquanest_admin_token') || sessionStorage.getItem('aquanest_admin_token') || null;
    } catch (e) {
      return null;
    }
  },

  getAdminUser() {
    try {
      const u = localStorage.getItem('aquanest_admin_user') || sessionStorage.getItem('aquanest_admin_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  getHeaders(isAdmin = false) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const token = isAdmin ? (this.getAdminToken() || this.getToken()) : this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Customer Register
  async register(userData) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(userData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Registration failed (${res.status})`);
      }

      if (json.token && json.user) {
        localStorage.setItem('aquanest_token', json.token);
        localStorage.setItem('aquanest_user', JSON.stringify(json.user));
        window.dispatchEvent(new CustomEvent('aquanest:authChange', { detail: { user: json.user } }));
      }
      return json;
    } catch (err) {
      throw err;
    }
  },

  // Customer Login
  async login(credentials, remember = true) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Login failed (${res.status})`);
      }

      if (json.token && json.user) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('aquanest_token', json.token);
        storage.setItem('aquanest_user', JSON.stringify(json.user));
        window.dispatchEvent(new CustomEvent('aquanest:authChange', { detail: { user: json.user } }));
      }
      return json;
    } catch (err) {
      throw err;
    }
  },

  // Customer Logout
  logout() {
    try {
      localStorage.removeItem('aquanest_token');
      localStorage.removeItem('aquanest_user');
      sessionStorage.removeItem('aquanest_token');
      sessionStorage.removeItem('aquanest_user');
      window.dispatchEvent(new CustomEvent('aquanest:authChange', { detail: { user: null } }));
    } catch (e) {}
  },

  // Fetch Current Customer Profile (/api/auth/me)
  async getMe() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${this.baseUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!res.ok) {
        if (res.status === 401) {
          this.logout();
        }
        return null;
      }
      const json = await res.json();
      if (json.success && json.user) {
        localStorage.setItem('aquanest_user', JSON.stringify(json.user));
        return json.user;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  // Fetch Logged-in Customer Orders
  async getMyOrders() {
    const token = this.getToken();
    if (!token) return [];

    try {
      const res = await fetch(`${this.baseUrl}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.success && Array.isArray(json.data) ? json.data : [];
    } catch (err) {
      return [];
    }
  },

  // Admin Dedicated Login
  async adminLogin(credentials, remember = true) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Admin login failed (${res.status})`);
      }

      if (json.user && json.user.role !== 'admin') {
        throw new Error('Access denied: Your account does not have administrator privileges.');
      }

      if (json.token && json.user) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('aquanest_admin_token', json.token);
        storage.setItem('aquanest_admin_user', JSON.stringify(json.user));
      }
      return json;
    } catch (err) {
      throw err;
    }
  },

  // Admin Logout
  adminLogout() {
    try {
      localStorage.removeItem('aquanest_admin_token');
      localStorage.removeItem('aquanest_admin_user');
      sessionStorage.removeItem('aquanest_admin_token');
      sessionStorage.removeItem('aquanest_admin_user');
    } catch (e) {}
  },

  // Fetch all products from MongoDB
  async getProducts(params = {}) {
    try {
      const url = new URL(`${this.baseUrl}/products`);
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== '') {
          url.searchParams.append(k, params[k]);
        }
      });

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      this.lastError = null;

      if (json.success && Array.isArray(json.data)) {
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(json.data));
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('aquanest:productsLoaded', { detail: { products: json.data } }));
        return json.data;
      }
      return getStoredProducts();
    } catch (err) {
      console.warn('AquaNestAPI: Unable to connect to AquaNest server. Using cached data.', err.message);
      this.isOnline = false;
      this.lastError = 'Unable to connect to AquaNest server. Please try again.';
      return getStoredProducts();
    }
  },

  // Fetch single product by ID from MongoDB
  async getProductById(id) {
    if (!id) return null;
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      this.isOnline = true;
      this.lastError = null;
      if (json.success && json.data) {
        return json.data;
      }
      return getProductById(id);
    } catch (err) {
      console.warn(`AquaNestAPI: Server unavailable for product ${id}. Using local data.`, err.message);
      this.isOnline = false;
      this.lastError = 'Unable to connect to AquaNest server. Please try again.';
      return getProductById(id);
    }
  },

  // Create product in MongoDB (Admin Only - Requires Admin Token)
  async createProduct(productData) {
    try {
      const res = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(productData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Server returned error (${res.status})`);
      }
      this.isOnline = true;
      await this.getProducts();
      return json.data;
    } catch (err) {
      this.isOnline = false;
      this.lastError = err.message;
      throw err;
    }
  },

  // Update product in MongoDB (Admin Only - Requires Admin Token)
  async updateProduct(id, updateData) {
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updateData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Server returned error (${res.status})`);
      }
      this.isOnline = true;
      await this.getProducts();
      return json.data;
    } catch (err) {
      this.isOnline = false;
      this.lastError = err.message;
      throw err;
    }
  },

  // Delete product from MongoDB (Admin Only - Requires Admin Token)
  async deleteProduct(id) {
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getHeaders(true)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Server returned error (${res.status})`);
      }
      this.isOnline = true;
      await this.getProducts();
      return json;
    } catch (err) {
      this.isOnline = false;
      this.lastError = err.message;
      throw err;
    }
  },

  // Fetch all orders from MongoDB (Admin Only - Requires Admin Token)
  async getOrders(params = {}) {
    try {
      const url = new URL(`${this.baseUrl}/orders`);
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== '') {
          url.searchParams.append(k, params[k]);
        }
      });

      const res = await fetch(url.toString(), {
        headers: this.getHeaders(true)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      this.lastError = null;

      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (err) {
      console.warn('AquaNestAPI: Server unreachable or access denied for orders.', err.message);
      this.isOnline = false;
      this.lastError = 'Unable to connect to AquaNest server. Please try again.';
      return [];
    }
  },

  // Get Razorpay Key ID
  async getRazorpayKey() {
    try {
      const res = await fetch(`${this.baseUrl}/payment/key`);
      const json = await res.json();
      return json.keyId || null;
    } catch (e) {
      return null;
    }
  },

  // Initialize Payment & Create Pending Order
  async createPaymentOrder(orderPayload) {
    try {
      const headers = this.getHeaders(false);
      const res = await fetch(`${this.baseUrl}/payment/create-order`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderPayload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Payment initialization failed (${res.status})`);
      }
      this.isOnline = true;
      this.lastError = null;
      return json;
    } catch (err) {
      this.isOnline = false;
      this.lastError = err.message;
      throw err;
    }
  },

  // Verify Payment Signature on Backend
  async verifyPayment(verificationData) {
    try {
      const headers = this.getHeaders(false);
      const res = await fetch(`${this.baseUrl}/payment/verify`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(verificationData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Payment verification failed (${res.status})`);
      }
      this.isOnline = true;
      this.lastError = null;
      return json;
    } catch (err) {
      this.isOnline = false;
      this.lastError = err.message;
      throw err;
    }
  },

  // Test Mode Signature Simulator (Dev / Sandbox only)
  async simulateSignature(razorpay_order_id, razorpay_payment_id) {
    try {
      const res = await fetch(`${this.baseUrl}/payment/test-simulate-signature`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ razorpay_order_id, razorpay_payment_id })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Place order to Express & MongoDB (Customer & Guest Checkout)
  async createOrder(orderPayload) {
    try {
      const headers = this.getHeaders(false);
      const res = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderPayload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Order placement failed (${res.status})`);
      }
      this.isOnline = true;
      this.lastError = null;
      return json.data;
    } catch (err) {
      this.isOnline = false;
      this.lastError = 'Unable to connect to AquaNest server. Please try again.';
      throw err;
    }
  },

  // Update order status in MongoDB (Admin Only - Requires Admin Token)
  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${this.baseUrl}/orders/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify({ orderStatus: status, status: status })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Order update failed (${res.status})`);
      }
      this.isOnline = true;
      this.lastError = null;
      return json.data;
    } catch (err) {
      this.isOnline = false;
      this.lastError = 'Unable to connect to AquaNest server. Please try again.';
      throw err;
    }
  }
};

window.AquaNestAPI = AquaNestAPI;

// Background initial sync of catalog from MongoDB
if (typeof window !== 'undefined') {
  setTimeout(() => {
    AquaNestAPI.getProducts().catch(() => {});
  }, 100);
}

// Helper Functions
function getAllProducts() {
  return getStoredProducts();
}

function getProductById(id) {
  const products = getStoredProducts();
  return products.find(p => p.id === id || p.productId === id) || null;
}

function getProductsByCategory(categoryNameOrSlug) {
  const products = getStoredProducts();
  if (!categoryNameOrSlug || categoryNameOrSlug.toLowerCase() === 'all') {
    return products;
  }
  const needle = categoryNameOrSlug.toLowerCase();
  return products.filter(p => 
    p.category.toLowerCase() === needle || 
    p.categorySlug.toLowerCase() === needle
  );
}

function getTrendingProducts() {
  return getStoredProducts().filter(p => p.isTrending);
}

function getBestSellerProducts() {
  return getStoredProducts().filter(p => p.isBestSeller);
}

function getSpecialOfferProducts() {
  return getStoredProducts().filter(p => p.isSpecialOffer);
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Generate an SVG data URI fallback if remote image fails
function getFishSvgFallback(productName, category, color) {
  const safeName = (productName || 'Ornamental Fish').replace(/"/g, '&quot;');
  const safeCat = (category || 'AquaNest').replace(/"/g, '&quot;');
  const fill = color || '#0077b6';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a192f"/>
        <stop offset="50%" stop-color="#112240"/>
        <stop offset="100%" stop-color="#1d3557"/>
      </linearGradient>
      <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${fill}"/>
        <stop offset="100%" stop-color="#00d2ff"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#grad)"/>
    <circle cx="200" cy="140" r="85" fill="none" stroke="rgba(0, 210, 255, 0.12)" stroke-width="2"/>
    <circle cx="200" cy="140" r="105" fill="none" stroke="rgba(0, 210, 255, 0.06)" stroke-width="1.5"/>
    <!-- Water Bubbles -->
    <circle cx="80" cy="220" r="6" fill="rgba(0, 210, 255, 0.3)"/>
    <circle cx="95" cy="180" r="4" fill="rgba(0, 210, 255, 0.2)"/>
    <circle cx="330" cy="210" r="7" fill="rgba(0, 210, 255, 0.25)"/>
    <circle cx="310" cy="150" r="3.5" fill="rgba(0, 210, 255, 0.35)"/>
    <!-- Stylized Fish Silhouette -->
    <g transform="translate(140, 95) scale(0.65)">
      <path d="M120 50 C70 10, 10 30, -30 65 C-70 100, -85 140, -110 160 C-80 145, -50 145, -30 135 C10 170, 70 190, 120 150 C170 110, 170 90, 120 50 Z" fill="url(#fishGrad)"/>
      <path d="M-110 160 L-150 110 C-130 150, -130 170, -150 210 Z" fill="${fill}" opacity="0.8"/>
      <path d="M40 50 C20 10, -10 5, -20 25 C10 35, 30 45, 40 50 Z" fill="#00d2ff" opacity="0.6"/>
      <circle cx="100" cy="95" r="5" fill="#ffffff"/>
      <circle cx="102" cy="95" r="2.5" fill="#0a192f"/>
    </g>
    <!-- Label -->
    <text x="200" y="235" text-anchor="middle" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="16" fill="#ffffff">${safeName}</text>
    <text x="200" y="260" text-anchor="middle" font-family="'Segoe UI', system-ui, sans-serif" font-weight="500" font-size="12" fill="#00d2ff" letter-spacing="1">${safeCat.toUpperCase()} • AQUANEST</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Global hook for image errors
function handleProductImageError(imgElement, productName, category, color) {
  if (imgElement && !imgElement.dataset.fallbackSet) {
    imgElement.dataset.fallbackSet = "true";
    imgElement.src = getFishSvgFallback(productName, category, color);
  }
}
