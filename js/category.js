const categoryMeta = {
  beaches: {
    title: "Beaches of Sri Lanka",
    shortName: "Beaches",
    description:
      "Pristine coastlines with golden sands and crystal-clear waters perfect for relaxation, surfing, whale watching, snorkeling, and sunset escapes.",
    introTitle: "Explore Sri Lanka’s Coastal Beauty",
    introText:
      "Browse popular beaches across districts, compare approximate distances from Colombo and Kandy, and discover quick travel notes before planning your route.",
    icon: "fas fa-umbrella-beach",
    theme: "beaches-theme"
  },
  "hill-country": {
    title: "Hill Country of Sri Lanka",
    shortName: "Hill Country",
    description:
      "Lush tea plantations, waterfalls, cool climates, and misty mountains offering breathtaking scenic views and memorable train journeys.",
    introTitle: "Discover the Misty Highlands",
    introText:
      "Find famous hill country towns, scenic viewpoints, lakes, forests, and tea-region experiences with district-based filtering and travel-friendly details.",
    icon: "fas fa-mountain",
    theme: "hill-country-theme"
  },
  waterfalls: {
    title: "Waterfalls of Sri Lanka",
    shortName: "Waterfalls",
    description:
      "Magnificent cascades, roadside falls, hidden forest waterfalls, and mountain streams flowing through some of Sri Lanka’s most beautiful landscapes.",
    introTitle: "Discover Sri Lanka’s Waterfall Trails",
    introText:
      "Explore major waterfalls across Sri Lanka with district filters, approximate distances from Colombo and Kandy, visitor highlights, and useful travel notes.",
    icon: "fas fa-water",
    theme: "waterfalls-theme"
  },
  "heritage-sites": {
    title: "Heritage Sites of Sri Lanka",
    shortName: "Heritage Sites",
    description:
      "Ancient temples, sacred cities, cave complexes, colonial forts, and UNESCO-recognized landmarks rich in culture, faith, and history.",
    introTitle: "Travel Through Sri Lanka’s History",
    introText:
      "Explore ancient kingdoms, sacred temples, forts, and historically important places with location details, key highlights, and useful notes.",
    icon: "fas fa-landmark",
    theme: "heritage-sites-theme"
  },
  wildlife: {
    title: "Wildlife Destinations of Sri Lanka",
    shortName: "Wildlife",
    description:
      "National parks, forest reserves, bird habitats, elephant gathering zones, and safari regions teeming with biodiversity and unforgettable encounters.",
    introTitle: "Experience Sri Lanka’s Wild Side",
    introText:
      "Discover leading safari parks and nature reserves with major animal highlights, district filtering, and trip-planning distance details.",
    icon: "fas fa-paw",
    theme: "wildlife-theme"
  }
};

/* ---------------------------------------
   DISTANCE REFERENCE CITIES
--------------------------------------- */
const referenceCities = {
  Colombo: { lat: 6.9271, lng: 79.8612 },
  Kandy: { lat: 7.2906, lng: 80.6337 }
};

/* ---------------------------------------
   PLACES DATA
   Can add more places here.
--------------------------------------- */
const placesData = [
  /* BEACHES */
  {
    category: "beaches",
    name: "Unawatuna Beach",
    district: "Galle",
    province: "Southern Province",
    lat: 6.0107,
    lng: 80.2496,
    image: "assets/destinations/unawatuna.jpg",
    summary: "A famous crescent-shaped beach known for swimming, sunsets, and lively cafes.",
    highlights: ["Swimming-friendly bay", "Sunset views", "Restaurants and nightlife"],
    note: "Best for relaxed beach stays and short trips combined with Galle Fort.",
    special: "Usually easier for casual travelers and families than rougher surf beaches."
  },
  {
    category: "beaches",
    name: "Jungle Beach",
    district: "Galle",
    province: "Southern Province",
    lat: 6.0036,
    lng: 80.2418,
    image: "assets/destinations/jungle.jpg",
    summary: "A smaller hidden beach near Unawatuna with a more secluded atmosphere.",
    highlights: ["Quiet setting", "Short hike access", "Calm scenic bay"],
    note: "Good for travelers who want a less commercial beach experience.",
    special: "Access roads and paths can feel more remote than main town beaches."
  },
  {
    category: "beaches",
    name: "Hikkaduwa Beach",
    district: "Galle",
    province: "Southern Province",
    lat: 6.1407,
    lng: 80.1012,
    image: "assets/destinations/hikkaduwa.jpg",
    summary: "One of Sri Lanka’s best-known beach towns with surfing, coral areas, and a lively strip.",
    highlights: ["Surf spots", "Beachfront dining", "Snorkeling areas"],
    note: "A strong choice for budget travelers and social beach holidays.",
    special: "Can be busier and more active than quieter south coast beaches."
  },
  {
    category: "beaches",
    name: "Mirissa Beach",
    district: "Matara",
    province: "Southern Province",
    lat: 5.9487,
    lng: 80.4588,
    image: "assets/destinations/mirissa.jpg",
    summary: "Popular for soft sand, surf culture, palm-backed scenery, and whale watching excursions.",
    highlights: ["Whale watching nearby", "Beautiful sunsets", "Beach cafes"],
    note: "One of the most attractive all-round beach destinations in the south.",
    special: "Best combined with Weligama, Matara, or a southern coast loop."
  },
  {
    category: "beaches",
    name: "Weligama Beach",
    district: "Matara",
    province: "Southern Province",
    lat: 5.9730,
    lng: 80.4292,
    image: "assets/destinations/weligama.jpg",
    summary: "A long bay especially popular with beginner surfers and laid-back seaside stays.",
    highlights: ["Beginner surfing", "Wide beach", "Relaxed atmosphere"],
    note: "Very suitable for learning surf and short beach breaks.",
    special: "Gentler wave zones make it more beginner-friendly than some surf-focused coasts."
  },
  {
    category: "beaches",
    name: "Tangalle Beach",
    district: "Hambantota",
    province: "Southern Province",
    lat: 6.0243,
    lng: 80.7974,
    image: "assets/destinations/tangalle.jpg",
    summary: "Known for dramatic coastline, wide sandy stretches, and quieter upscale beach stays.",
    highlights: ["Long sandy coast", "Luxury stays", "Scenic coastline"],
    note: "Great for peaceful beach relaxation and boutique accommodation.",
    special: "Some stretches can have stronger currents, so choose swimming spots carefully."
  },
  {
    category: "beaches",
    name: "Arugam Bay",
    district: "Ampara",
    province: "Eastern Province",
    lat: 6.8400,
    lng: 81.8350,
    image: "assets/destinations/arugam.jpg",
    summary: "Sri Lanka’s most internationally known surf beach, with a laid-back east coast vibe.",
    highlights: ["World-famous surf", "East coast charm", "Youthful travel scene"],
    note: "Best for surf-focused and adventurous travelers.",
    special: "Seasonality is important here; east coast conditions differ from south-west beaches."
  },
  {
    category: "beaches",
    name: "Nilaveli Beach",
    district: "Trincomalee",
    province: "Eastern Province",
    lat: 8.6953,
    lng: 81.1985,
    image: "assets/destinations/nilaveli.jpg",
    summary: "A calm white-sand beach in the east known for clean water and a peaceful atmosphere.",
    highlights: ["White sand", "Calm sea in season", "Boat access nearby"],
    note: "Ideal for slower beach holidays and east coast exploration.",
    special: "Often preferred by travelers seeking a quieter coast than the southern belt."
  },
  {
    category: "beaches",
    name: "Uppuveli Beach",
    district: "Trincomalee",
    province: "Eastern Province",
    lat: 8.6090,
    lng: 81.2198,
    image: "assets/destinations/uppuveli.jpg",
    summary: "A relaxed beach area near Trincomalee with comfortable stays and easy access.",
    highlights: ["Easy access from Trinco", "Relaxed guesthouses", "Popular east coast stop"],
    note: "Good for travelers who want beach time without going too far from town facilities.",
    special: "Works well as a base for Trincomalee beaches and marine excursions."
  },
  {
    category: "beaches",
    name: "Pasikuda Beach",
    district: "Batticaloa",
    province: "Eastern Province",
    lat: 7.9292,
    lng: 81.5617,
    image: "assets/destinations/pasikuda.jpg",
    summary: "Known for its shallow coastline and calm bathing conditions during the best season.",
    highlights: ["Shallow waters", "Family-friendly feel", "Resort area"],
    note: "A comfortable beach choice for families and easy swimming.",
    special: "Water conditions are one of its main attractions when the season is favorable."
  },

  /* HILL COUNTRY */
  {
    category: "hill-country",
    name: "Ella",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.8667,
    lng: 81.0466,
    image: "assets/destinations/ella.jpg",
    summary: "A scenic highland town famous for viewpoints, hikes, cafes, and train journeys.",
    highlights: ["Nine Arches Bridge nearby", "Little Adam’s Peak", "Cool mountain setting"],
    note: "One of the easiest hill country destinations for modern travelers.",
    special: "Excellent for combining hikes, viewpoints, and train travel experiences."
  },
  {
    category: "hill-country",
    name: "Nuwara Eliya",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9497,
    lng: 80.7891,
    image: "assets/destinations/nuwara-eliya.jpg",
    summary: "A cool-climate town known for tea estates, gardens, and colonial-era charm.",
    highlights: ["Tea country atmosphere", "Gregory Lake", "Cool weather"],
    note: "Perfect for travelers who enjoy scenic drives and a slower mountain mood.",
    special: "One of the classic bases for tea estate experiences in Sri Lanka."
  },
  {
    category: "hill-country",
    name: "Hatton",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8916,
    lng: 80.5955,
    image: "assets/destinations/hatton.jpg",
    summary: "A gateway to tea estates, mountain roads, and the Adam’s Peak region.",
    highlights: ["Tea landscapes", "Adam’s Peak access", "Scenic highland roads"],
    note: "Good for tea-country routes and pilgrim or trekking plans.",
    special: "Strong option for travelers heading toward Sri Pada / Adam’s Peak."
  },
  {
    category: "hill-country",
    name: "Haputale",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.7650,
    lng: 80.9513,
    image: "assets/destinations/haputale.jpg",
    summary: "A misty hill town with sweeping ridges, tea estates, and dramatic viewpoints.",
    highlights: ["Lipton’s Seat nearby", "Cooler weather", "Panoramic views"],
    note: "A very scenic stop for photography and tea-country drives.",
    special: "Often quieter than Ella while still giving outstanding landscape views."
  },
  {
    category: "hill-country",
    name: "Bandarawela",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.8280,
    lng: 80.9862,
    image: "assets/destinations/bandarawela.jpg",
    summary: "A relaxed hill country town with comfortable weather and easy access to nearby attractions.",
    highlights: ["Mild climate", "Calmer than Ella", "Good regional base"],
    note: "Suitable for travelers who want a quieter hill-country stay.",
    special: "Works well as a base for Ella, Haputale, and surrounding scenic routes."
  },
  {
    category: "hill-country",
    name: "Knuckles Range",
    district: "Matale",
    province: "Central Province",
    lat: 7.4631,
    lng: 80.8205,
    image: "assets/destinations/knuckels.jpg",
    summary: "A dramatic mountain range known for trekking, cloud forests, and rugged scenery.",
    highlights: ["Hiking", "Cloud forest habitats", "Mountain landscapes"],
    note: "Best for nature lovers and adventure-focused trips.",
    special: "Prepare properly for trekking routes and changing weather conditions."
  },
  {
    category: "hill-country",
    name: "Horton Plains",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8067,
    lng: 80.8073,
    image: "assets/destinations/horton-plains.jpg",
    summary: "A protected highland plateau famous for grasslands, cloud forest, and World’s End.",
    highlights: ["World’s End viewpoint", "Morning trekking", "Unique upland ecology"],
    note: "Early morning is often best for clearer views.",
    special: "A signature highland landscape and a major nature stop in the central mountains."
  },
  {
    category: "hill-country",
    name: "Adam’s Peak (Sri Pada)",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.8096,
    lng: 80.4994,
    image: "assets/destinations/adam-peak.jpg",
    summary: "A sacred mountain pilgrimage and trekking destination with sunrise views.",
    highlights: ["Sunrise climb", "Religious importance", "Mountain pilgrimage"],
    note: "Best known for overnight or pre-dawn climbs.",
    special: "Travelers should plan around pilgrimage season and weather conditions."
  },
  {
    category: "hill-country",
    name: "Pidurutalagala View Region",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9774,
    lng: 80.7738,
    image: "assets/destinations/pidurutalagala.jpg",
    summary: "The highest mountain zone in Sri Lanka, associated with cool-weather highland scenery.",
    highlights: ["High elevation", "Mountain views", "Nuwara Eliya region"],
    note: "Works as part of a broader Nuwara Eliya highland exploration.",
    special: "Usually visited as a surrounding scenic region rather than a stand-alone town stop."
  },
  {
    category: "hill-country",
    name: "Belihuloya",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.7167,
    lng: 80.7667,
    image: "assets/destinations/belihuloya.jpg",
    summary: "A green mountain-edge destination with rivers, forests, and fresh air.",
    highlights: ["Nature stays", "Streams and greenery", "Roadside scenic stop"],
    note: "A good stop for eco-stays and quiet nature breaks.",
    special: "Often enjoyed by travelers moving between south-central and hill-country routes."
  },

  /* WATERFALLS */
  {
    category: "waterfalls",
    name: "Diyaluma Falls",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.7342,
    lng: 81.0286,
    image: "assets/destinations/diyaluma-falls.jpg",
    summary: "One of Sri Lanka’s tallest and most spectacular waterfalls, surrounded by dramatic highland scenery.",
    highlights: ["Tall waterfall", "Natural pools nearby", "Scenic hill-country views"],
    note: "Popular with travelers exploring Ella, Haputale, and the southern hill country.",
    special: "Best visited carefully, especially if hiking to upper pools or slippery rock areas."
  },
  {
    category: "waterfalls",
    name: "Bambarakanda Falls",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.7730,
    lng: 80.8303,
    image: "assets/destinations/bambarakanda-falls.jpg",
    summary: "Sri Lanka’s tallest waterfall, cascading down a dramatic rock face in a forested mountain setting.",
    highlights: ["Tallest waterfall in Sri Lanka", "Cool mountain setting", "Nature photography"],
    note: "A rewarding stop for waterfall lovers traveling through the central highlands.",
    special: "The access area can be misty and slippery during wet conditions."
  },
  {
    category: "waterfalls",
    name: "Ravana Falls",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.8406,
    lng: 81.0620,
    image: "assets/destinations/ravana-falls.jpg",
    summary: "A famous roadside waterfall near Ella, known for its broad cascade and easy accessibility.",
    highlights: ["Roadside stop", "Near Ella", "Popular photo location"],
    note: "Very easy to include in an Ella day trip or hill-country drive.",
    special: "Can get crowded because of its easy roadside access."
  },
  {
    category: "waterfalls",
    name: "Dunhinda Falls",
    district: "Badulla",
    province: "Uva Province",
    lat: 6.8922,
    lng: 81.0607,
    image: "assets/destinations/dunhinda-falls.jpg",
    summary: "A beautiful waterfall known for its smoky spray effect and scenic walking approach.",
    highlights: ["Mist effect", "Forest walk", "Scenic cascade"],
    note: "A favorite among local travelers visiting the Badulla region.",
    special: "The short walking path adds to the experience, so wear suitable footwear."
  },
  {
    category: "waterfalls",
    name: "St. Clair’s Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9090,
    lng: 80.6039,
    image: "assets/destinations/st-clairs-falls.jpg",
    summary: "A broad and graceful waterfall in the tea country, long admired for its scenic beauty.",
    highlights: ["Tea estate surroundings", "Wide cascade", "Roadside viewpoint"],
    note: "Often visited on routes through Hatton and Nuwara Eliya region.",
    special: "Water flow can vary depending on season and surrounding water usage."
  },
  {
    category: "waterfalls",
    name: "Devon Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9021,
    lng: 80.6237,
    image: "assets/destinations/devon-falls.jpg",
    summary: "A picturesque waterfall visible from the main road in Sri Lanka’s central tea region.",
    highlights: ["Easy viewpoint", "Tea country landscape", "Photogenic cascade"],
    note: "A good short stop on scenic mountain road journeys.",
    special: "Pairs very well with St. Clair’s Falls on the same travel route."
  },
  {
    category: "waterfalls",
    name: "Laxapana Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8356,
    lng: 80.4935,
    image: "assets/destinations/laxapana-falls.jpg",
    summary: "A powerful waterfall in the Maskeliya region, surrounded by rugged hill-country terrain.",
    highlights: ["Powerful cascade", "Mountain setting", "Nature visit"],
    note: "Suitable for travelers exploring Adam’s Peak region and central highlands.",
    special: "Road access and weather conditions should be checked before visiting."
  },
  {
    category: "waterfalls",
    name: "Aberdeen Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9795,
    lng: 80.5077,
    image: "assets/destinations/aberdeen-falls.jpg",
    summary: "A scenic waterfall surrounded by greenery, reached through a quiet countryside route.",
    highlights: ["Forest atmosphere", "Less urban setting", "Scenic viewpoint"],
    note: "A worthwhile stop for travelers who enjoy less commercial nature spots.",
    special: "Care is needed near water edges, especially during rainy weather."
  },
  {
    category: "waterfalls",
    name: "Baker’s Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8006,
    lng: 80.8023,
    image: "assets/destinations/baker-s-falls.jpg",
    summary: "A charming waterfall inside Horton Plains National Park surrounded by montane forest.",
    highlights: ["Inside Horton Plains", "Cool-climate nature", "Great for trekkers"],
    note: "Usually visited while walking the Horton Plains trail.",
    special: "Best as part of a morning Horton Plains trip rather than a stand-alone visit."
  },
  {
    category: "waterfalls",
    name: "Kirindi Ella Falls",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.7013,
    lng: 80.5308,
    image: "assets/destinations/kirindi-ella-falls.jpg",
    summary: "A beautiful waterfall in a greener low-country setting with local scenic charm.",
    highlights: ["Natural setting", "Popular local visit", "Strong water flow in season"],
    note: "A good addition for nature trips through Ratnapura district.",
    special: "Take extra care if visiting after heavy rain due to slippery surroundings."
  },
  {
    category: "waterfalls",
    name: "Bopath Ella",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.8014,
    lng: 80.3967,
    image: "assets/destinations/bopath-ella.jpg",
    summary: "A well-known waterfall named for its shape, popular with domestic travelers.",
    highlights: ["Iconic shape", "Accessible visit", "Scenic local attraction"],
    note: "One of the better-known waterfalls in the south-western inland region.",
    special: "Busy periods can happen on holidays and weekends."
  },
  {
    category: "waterfalls",
    name: "Ramboda Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 7.0524,
    lng: 80.6992,
    image: "assets/destinations/ramboda-falls.jpg",
    summary: "A striking waterfall on the Kandy–Nuwara Eliya route, popular with passing travelers.",
    highlights: ["Road trip stop", "Tea-country route", "Scenic viewpoint"],
    note: "A very convenient waterfall stop on one of Sri Lanka’s most scenic roads.",
    special: "Excellent for travelers driving between Kandy and Nuwara Eliya."
  },
  {
    category: "waterfalls",
    name: "Galboda Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8776,
    lng: 80.6638,
    image: "assets/destinations/galboda-falls.jpg",
    summary: "A scenic tea-country waterfall that offers a more peaceful experience than major roadside falls.",
    highlights: ["Tea estate surroundings", "Peaceful nature stop", "Scenic route"],
    note: "Good for travelers who like quieter waterfall visits.",
    special: "Access may involve some walking depending on the route used."
  },
  {
    category: "waterfalls",
    name: "Elgin Falls",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.9907,
    lng: 80.6640,
    image: "assets/destinations/elgin-falls.jpg",
    summary: "A slender, elegant waterfall in the Nuwara Eliya region, best viewed from passing viewpoints.",
    highlights: ["Elegant cascade", "Mountain scenery", "Roadside visibility"],
    note: "Commonly seen on scenic routes through central Sri Lanka.",
    special: "Often best appreciated from viewpoints rather than close access."
  },
  
  /* HERITAGE */
  {
    category: "heritage-sites",
    name: "Sigiriya Rock Fortress",
    district: "Matale",
    province: "Central Province",
    lat: 7.9570,
    lng: 80.7603,
    image: "assets/destinations/sigiriya-rock-fortress.jpg",
    summary: "An iconic ancient rock fortress with palace ruins, frescoes, and panoramic views.",
    highlights: ["Ancient citadel", "Frescoes", "Panoramic summit views"],
    note: "One of Sri Lanka’s most famous must-visit heritage landmarks.",
    special: "Try to visit early to avoid heat and large crowds."
  },
  {
    category: "heritage-sites",
    name: "Dambulla Cave Temple",
    district: "Matale",
    province: "Central Province",
    lat: 7.8567,
    lng: 80.6492,
    image: "assets/destinations/dambulla-cave-temple.jpg",
    summary: "A remarkable cave-temple complex with sacred art, statues, and historic importance.",
    highlights: ["Cave shrines", "Historic murals", "Major Buddhist site"],
    note: "A top heritage stop often combined with Sigiriya.",
    special: "Dress respectfully and prepare for steps leading to the caves."
  },
  {
    category: "heritage-sites",
    name: "Temple of the Tooth Relic",
    district: "Kandy",
    province: "Central Province",
    lat: 7.2936,
    lng: 80.6413,
    image: "assets/destinations/temple-of-the-tooth-relic.jpg",
    summary: "One of Sri Lanka’s most sacred Buddhist temples, located in the heart of Kandy.",
    highlights: ["Religious significance", "Kandy Lake area", "Traditional culture"],
    note: "A central heritage attraction for both local and international travelers.",
    special: "Visit during puja hours for a more meaningful atmosphere."
  },
  {
    category: "heritage-sites",
    name: "Galle Fort",
    district: "Galle",
    province: "Southern Province",
    lat: 6.0260,
    lng: 80.2170,
    image: "assets/destinations/galle-fort.jpg",
    summary: "A historic fortified old town with colonial architecture and oceanfront charm.",
    highlights: ["Fort walls", "Colonial streets", "Boutiques and cafes"],
    note: "Excellent for walking tours, photography, and cultural day trips.",
    special: "Best explored on foot in the late afternoon or near sunset."
  },
  {
    category: "heritage-sites",
    name: "Anuradhapura Ancient City",
    district: "Anuradhapura",
    province: "North Central Province",
    lat: 8.3114,
    lng: 80.4037,
    image: "assets/destinations/anuradhapura-ancient-city.jpg",
    summary: "An ancient sacred city filled with stupas, monasteries, reservoirs, and ruins.",
    highlights: ["Ancient kingdom", "Large stupas", "Sacred Bodhi tree area"],
    note: "Ideal for heritage-focused full-day exploration.",
    special: "Because the heritage zone is large, transport planning helps a lot."
  },
  {
    category: "heritage-sites",
    name: "Polonnaruwa Ancient City",
    district: "Polonnaruwa",
    province: "North Central Province",
    lat: 7.9403,
    lng: 81.0188,
    image: "assets/destinations/polonnaruwa-ancient-city.jpg",
    summary: "A major medieval capital known for preserved ruins, statues, and planned city remains.",
    highlights: ["Ancient ruins", "Stone carvings", "Historic royal complex"],
    note: "One of the strongest archaeological destinations in Sri Lanka.",
    special: "Cycling can be a pleasant way to move between ruins."
  },
  {
    category: "heritage-sites",
    name: "Yapahuwa Rock Fortress",
    district: "Kurunegala",
    province: "North Western Province",
    lat: 7.8239,
    lng: 80.3167,
    image: "assets/destinations/yapahuwa-rock-fortress.jpg",
    summary: "A historic rock citadel known for its dramatic staircase and medieval remains.",
    highlights: ["Stone staircase", "Hilltop ruins", "Less crowded heritage stop"],
    note: "A good alternative heritage destination beyond the most famous sites.",
    special: "Suitable for travelers who enjoy quieter archaeological visits."
  },
  {
    category: "heritage-sites",
    name: "Mihintale",
    district: "Anuradhapura",
    province: "North Central Province",
    lat: 8.3565,
    lng: 80.5128,
    image: "assets/destinations/mihintale.jpg",
    summary: "A sacred mountain site closely linked with the introduction of Buddhism in Sri Lanka.",
    highlights: ["Pilgrimage importance", "Stair climb", "Panoramic hill views"],
    note: "Often visited together with Anuradhapura.",
    special: "Great for combining spiritual history with scenic elevated viewpoints."
  },
  {
    category: "heritage-sites",
    name: "Ruwanwelisaya",
    district: "Anuradhapura",
    province: "North Central Province",
    lat: 8.3500,
    lng: 80.3969,
    image: "assets/destinations/ruwanwelisaya.jpg",
    summary: "One of the most revered stupas in Sri Lanka and a monumental sacred structure.",
    highlights: ["Sacred stupa", "Religious significance", "Part of Anuradhapura complex"],
    note: "A powerful spiritual and cultural landmark.",
    special: "Visit respectfully, especially during worship times and religious days."
  },
  {
    category: "heritage-sites",
    name: "Jethawanaramaya",
    district: "Anuradhapura",
    province: "North Central Province",
    lat: 8.3512,
    lng: 80.4047,
    image: "assets/destinations/jethawanaramaya.jpg",
    summary: "A massive ancient stupa that reflects the engineering and scale of old Sri Lankan civilization.",
    highlights: ["Huge brick stupa", "Archaeological importance", "Ancient engineering"],
    note: "Best visited as part of the Anuradhapura heritage circuit.",
    special: "Its scale becomes much more impressive when seen in person."
  },

  /* WILDLIFE */
  {
    category: "wildlife",
    name: "Yala National Park",
    district: "Hambantota",
    province: "Southern Province",
    lat: 6.3725,
    lng: 81.5185,
    image: "assets/destinations/yala-national-park.jpg",
    summary: "Sri Lanka’s best-known safari destination, especially famous for leopard sightings.",
    highlights: ["Leopards", "Elephants", "Safari experience"],
    note: "A top choice for first-time wildlife travelers.",
    special: "Morning and evening safaris are usually preferred for better wildlife activity."
  },
  {
    category: "wildlife",
    name: "Udawalawe National Park",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.4744,
    lng: 80.8883,
    image: "assets/destinations/udawalawe-national-park.jpg",
    summary: "One of the best parks for elephant sightings in more open terrain.",
    highlights: ["Elephants", "Open landscapes", "Safari-friendly terrain"],
    note: "Great for dependable elephant-focused safaris.",
    special: "Often easier for elephant viewing than denser forest parks."
  },
  {
    category: "wildlife",
    name: "Wilpattu National Park",
    district: "Puttalam",
    province: "North Western Province",
    lat: 8.4604,
    lng: 80.1000,
    image: "assets/destinations/wilpattu-national-park.jpg",
    summary: "A vast park known for natural lakes, wilderness feel, and leopard habitat.",
    highlights: ["Leopards", "Natural villus", "Large wilderness park"],
    note: "Good for travelers who prefer a wilder, more spread-out safari feel.",
    special: "Sightings can require patience because of the park’s scale."
  },
  {
    category: "wildlife",
    name: "Minneriya National Park",
    district: "Polonnaruwa",
    province: "North Central Province",
    lat: 8.0340,
    lng: 80.8920,
    image: "assets/destinations/minneriya-national-park.jpg",
    summary: "Well known for the seasonal elephant gathering around the reservoir region.",
    highlights: ["Elephant gathering", "Dry-zone safari", "Birdlife"],
    note: "A major wildlife highlight in season.",
    special: "Very popular in itineraries linked with Sigiriya and Dambulla."
  },
  {
    category: "wildlife",
    name: "Kaudulla National Park",
    district: "Polonnaruwa",
    province: "North Central Province",
    lat: 8.1167,
    lng: 80.8833,
    image: "assets/destinations/kaudulla-national-park.jpg",
    summary: "Another strong elephant-viewing park in the cultural triangle region.",
    highlights: ["Elephants", "Tank ecosystem", "Safari option near Sigiriya zone"],
    note: "Often paired with or chosen instead of Minneriya depending on animal movement.",
    special: "Wildlife movement between nearby parks can affect which one is best."
  },
  {
    category: "wildlife",
    name: "Bundala National Park",
    district: "Hambantota",
    province: "Southern Province",
    lat: 6.1952,
    lng: 81.1967,
    image: "assets/destinations/bundala-national-park.jpg",
    summary: "A coastal wetland park especially important for birdlife and migratory species.",
    highlights: ["Birdwatching", "Wetlands", "Coastal ecology"],
    note: "Excellent for bird lovers and nature photographers.",
    special: "A different wildlife experience from mammal-focused safari parks."
  },
  {
    category: "wildlife",
    name: "Sinharaja Forest Reserve",
    district: "Ratnapura",
    province: "Sabaragamuwa Province",
    lat: 6.4069,
    lng: 80.4906,
    image: "assets/destinations/sinharaja-forest-reserve.jpg",
    summary: "A famous rainforest reserve rich in biodiversity, endemic birds, and tropical forest life.",
    highlights: ["Rainforest ecosystem", "Birdlife", "Endemic biodiversity"],
    note: "Best for guided nature walks rather than jeep safaris.",
    special: "A must-consider destination for eco-tourism and rainforest exploration."
  },
  {
    category: "wildlife",
    name: "Wasgamuwa National Park",
    district: "Matale",
    province: "Central Province",
    lat: 7.7057,
    lng: 80.9554,
    image: "assets/destinations/wasgamuwa-national-park.jpg",
    summary: "A less crowded wildlife park known for elephants and dry-zone habitats.",
    highlights: ["Elephants", "Quieter safari", "Natural landscapes"],
    note: "A good option for travelers who want a less commercial park experience.",
    special: "Can be attractive for repeat visitors who have already done Yala."
  },
  {
    category: "wildlife",
    name: "Horton Plains National Park",
    district: "Nuwara Eliya",
    province: "Central Province",
    lat: 6.8067,
    lng: 80.8073,
    image: "assets/destinations/horton-plains-national-park.jpg",
    summary: "A highland protected area with unique ecology, open plains, and forest habitats.",
    highlights: ["Unique upland biodiversity", "Trekking route", "Scenic protected area"],
    note: "A good fit for travelers mixing hill-country scenery and nature interest.",
    special: "This is more of a walking nature experience than a jeep safari park."
  },
  {
    category: "wildlife",
    name: "Kumana National Park",
    district: "Ampara",
    province: "Eastern Province",
    lat: 6.5829,
    lng: 81.6661,
    image: "assets/destinations/kumana-national-park.jpg",
    summary: "A wildlife-rich eastern park especially noted for birds and quieter safari conditions.",
    highlights: ["Birdlife", "Eastern wilderness", "Safari option near Arugam Bay"],
    note: "A strong addition for east coast travelers wanting wildlife.",
    special: "Often appeals to travelers looking for a calmer alternative to busier parks."
  }
];

/* ---------------------------------------
   HELPERS
--------------------------------------- */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function toRadians(deg) {
  return deg * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* This gives a more travel-like rough estimate than straight-line distance */
function approximateRoadDistance(base, target) {
  const airDistance = haversineDistance(base.lat, base.lng, target.lat, target.lng);
  const adjusted = airDistance * 1.28;
  return Math.round(adjusted);
}

function getCategoryIcon(category) {
  if (category === "beaches") return "fas fa-umbrella-beach";
  if (category === "hill-country") return "fas fa-mountain";
  if (category === "waterfalls") return "fas fa-water";
  if (category === "heritage-sites") return "fas fa-landmark";
  if (category === "wildlife") return "fas fa-paw";
  return "fas fa-location-dot";
}

function capitalizeWords(text) {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

/* ---------------------------------------
   DOM ELEMENTS
--------------------------------------- */
const categoryHero = document.getElementById("categoryHero");
const heroCategoryName = document.getElementById("heroCategoryName");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroPlaceCount = document.getElementById("heroPlaceCount");
const heroDistrictCount = document.getElementById("heroDistrictCount");
const listingTitle = document.getElementById("listingTitle");
const listingSubtitle = document.getElementById("listingSubtitle");
const introIcon = document.getElementById("introIcon");
const introTitle = document.getElementById("introTitle");
const introText = document.getElementById("introText");

const districtFilter = document.getElementById("districtFilter");
const searchInput = document.getElementById("searchInput");
const sortFilter = document.getElementById("sortFilter");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const placesGrid = document.getElementById("placesGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");

/* ---------------------------------------
   CURRENT CATEGORY
--------------------------------------- */
let currentCategory = getQueryParam("type") || "beaches";
if (!categoryMeta[currentCategory]) currentCategory = "beaches";

let categoryPlaces = placesData
  .filter(place => place.category === currentCategory)
  .map(place => ({
    ...place,
    distanceFromColombo: approximateRoadDistance(referenceCities.Colombo, place),
    distanceFromKandy: approximateRoadDistance(referenceCities.Kandy, place)
  }));

/* ---------------------------------------
   INIT PAGE CONTENT
--------------------------------------- */
function initCategoryPage() {
  const meta = categoryMeta[currentCategory];

  document.title = `DiscoverLanka - ${meta.shortName}`;
  heroCategoryName.textContent = meta.shortName;
  heroTitle.textContent = meta.title;
  heroDescription.textContent = meta.description;
  listingTitle.textContent = meta.shortName;
  listingSubtitle.textContent = `Browse all listed ${meta.shortName.toLowerCase()} destinations with filters and travel details.`;
  introTitle.textContent = meta.introTitle;
  introText.textContent = meta.introText;
  introIcon.innerHTML = `<i class="${meta.icon}"></i>`;

  categoryHero.classList.add(meta.theme);

  const districts = [...new Set(categoryPlaces.map(place => place.district))].sort();
  heroPlaceCount.textContent = categoryPlaces.length;
  heroDistrictCount.textContent = districts.length;

  districtFilter.innerHTML = `<option value="all">All Districts</option>`;
  districts.forEach(district => {
    districtFilter.innerHTML += `<option value="${district}">${district}</option>`;
  });
}

/* ---------------------------------------
   RENDER PLACES
--------------------------------------- */
function createPlaceCard(place) {
  return `
    <article class="place-card reveal">
      <div class="place-image">
        <img src="${place.image}" alt="${place.name}" loading="lazy" />
        <div class="place-overlay"></div>

        <div class="place-badge-wrap">
          <span class="place-badge">
            <i class="${getCategoryIcon(place.category)}"></i>
            ${categoryMeta[place.category].shortName}
          </span>
          <span class="place-badge">
            <i class="fas fa-location-dot"></i>
            ${place.district}
          </span>
        </div>

        <div class="place-title-box">
          <h3>${place.name}</h3>
          <p>${place.province}</p>
        </div>
      </div>

      <div class="place-content">
        <p class="place-description">${place.summary}</p>

        <div class="info-row">
          <span class="info-chip">
            <i class="fas fa-map"></i>
            ${place.district}
          </span>
          <span class="info-chip">
            <i class="fas fa-earth-asia"></i>
            ${place.province}
          </span>
        </div>

        <div class="detail-block">
          <h4>Why Visit</h4>
          <ul>
            ${place.highlights.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>

        <div class="distance-grid">
          <div class="distance-card">
            <span class="distance-label">Approx. from Colombo</span>
            <span class="distance-value">${place.distanceFromColombo} km</span>
          </div>
          <div class="distance-card">
            <span class="distance-label">Approx. from Kandy</span>
            <span class="distance-value">${place.distanceFromKandy} km</span>
          </div>
        </div>

        <div class="detail-block">
          <h4>Travel Detail</h4>
          <p>${place.note}</p>
        </div>

        <div class="special-note">
          <h4>Special Note</h4>
          <p>${place.special}</p>
        </div>
      </div>
    </article>
  `;
}

function renderPlaces() {
  const selectedDistrict = districtFilter.value;
  const searchTerm = searchInput.value.trim().toLowerCase();
  const sortValue = sortFilter.value;

  let filtered = [...categoryPlaces];

  if (selectedDistrict !== "all") {
    filtered = filtered.filter(place => place.district === selectedDistrict);
  }

  if (searchTerm) {
    filtered = filtered.filter(place =>
      place.name.toLowerCase().includes(searchTerm) ||
      place.district.toLowerCase().includes(searchTerm) ||
      place.province.toLowerCase().includes(searchTerm) ||
      place.summary.toLowerCase().includes(searchTerm) ||
      place.highlights.join(" ").toLowerCase().includes(searchTerm) ||
      place.special.toLowerCase().includes(searchTerm)
    );
  }

  if (sortValue === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "district-asc") {
    filtered.sort((a, b) => a.district.localeCompare(b.district));
  } else if (sortValue === "distance-colombo") {
    filtered.sort((a, b) => a.distanceFromColombo - b.distanceFromColombo);
  } else if (sortValue === "distance-kandy") {
    filtered.sort((a, b) => a.distanceFromKandy - b.distanceFromKandy);
  }

  resultsCount.textContent = `${filtered.length} place${filtered.length !== 1 ? "s" : ""} found`;

  if (!filtered.length) {
    placesGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  placesGrid.innerHTML = filtered.map(createPlaceCard).join("");

  activateRevealForDynamicCards();
}

/* ---------------------------------------
   RESET
--------------------------------------- */
function resetFilters() {
  districtFilter.value = "all";
  searchInput.value = "";
  sortFilter.value = "name-asc";
  renderPlaces();
}

/* ---------------------------------------
   REVEAL FOR DYNAMIC CONTENT
--------------------------------------- */
function activateRevealForDynamicCards() {
  const revealTargets = document.querySelectorAll(".reveal");

  function revealOnScrollDynamic() {
    const trigger = window.innerHeight * 0.88;
    revealTargets.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add("active");
      }
    });
  }

  revealOnScrollDynamic();
  window.addEventListener("scroll", revealOnScrollDynamic);
}

/* ---------------------------------------
   EVENTS
--------------------------------------- */
districtFilter.addEventListener("change", renderPlaces);
searchInput.addEventListener("input", renderPlaces);
sortFilter.addEventListener("change", renderPlaces);
resetFiltersBtn.addEventListener("click", resetFilters);

/* ---------------------------------------
   NEWSLETTER DEMO
--------------------------------------- */
const newsletterFormCategory = document.querySelector(".newsletter-form");

if (newsletterFormCategory) {
  newsletterFormCategory.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = this.querySelector("input");
    const email = input.value.trim();

    if (email === "") {
      alert("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Thank you for subscribing to DiscoverLanka!");
    input.value = "";
  });
}

/* ---------------------------------------
   INIT
--------------------------------------- */
initCategoryPage();
renderPlaces();