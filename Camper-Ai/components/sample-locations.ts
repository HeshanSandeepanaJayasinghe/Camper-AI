export type Location = {
  id: string;
  name: string;
  subtitle: string;
  coords: string;
  latitude: number;
  longitude: number;
  weather: string;
  walkArea: string;
  suitability: string;
  info: string;
  images: string[];
};

export const sampleLocations: Location[] = [
  {
    id: 'ella_rock',
    name: 'Ella Rock peak',
    subtitle: 'High mountains, pine forests',
    coords: '6.8667° N, 81.0467° E',
    latitude: 6.8667,
    longitude: 81.0467,
    weather: 'Cool morning mist, 18-24°C',
    walkArea: 'Challenging, 5.2 km climb',
    suitability: 'Ideal for fit hikers and sunrise photographers.',
    info: 'A magnificent peak standing tall over the town of Ella. The trek leads through tea estates, rail tracks, and dense eucalyptus woodlands, opening up to a cliff edge campsite with vistas of the Southern plains.',
    images: [
      'https://images.unsplash.com/photo-1588598126744-b0db4d9154f3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'knuckles_range',
    name: 'Knuckles Range Camp',
    subtitle: 'Rugged mist-capped peaks',
    coords: '7.4292° N, 80.7850° E',
    latitude: 7.4292,
    longitude: 80.7850,
    weather: 'Windy and rainy, 15-20°C',
    walkArea: 'Moderate to Extreme trails',
    suitability: 'Best for experienced trekkers and nature lovers.',
    info: 'Part of the Central Highlands World Heritage site. Knuckles features breathtaking cloud forests, cascading waterfalls, and rare endemic wildlife. The weather can change in minutes, bringing thick fog.',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'horton_plains',
    name: "Horton Plains / World's End",
    subtitle: 'High wind plateau, sheer drops',
    coords: '6.8028° N, 80.8028° E',
    latitude: 6.8028,
    longitude: 80.8028,
    weather: 'Cold and windy, 10-18°C',
    walkArea: 'Easy, 9.5 km circular trail',
    suitability: 'Great for general tourists and birdwatchers.',
    info: 'A national park situated on a cold, windswept plateau. Key highlights are the Baker\'s Falls and the World\'s End, a drop-off of nearly 880 meters with stunning vistas of the surrounding valleys.',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'riverston_peak',
    name: 'Riverston windy path',
    subtitle: 'Windy ridges, sheer drops',
    coords: '7.5312° N, 80.7410° E',
    latitude: 7.5312,
    longitude: 80.7410,
    weather: 'Strong winds, 16-22°C',
    walkArea: 'Easy to Moderate paved walks',
    suitability: 'A must-visit for foggy nature trails and scenic valleys.',
    info: 'Located in the Matale district, Riverston is famous for its telecommunication tower hike, sheer windy drop-offs (Mini World\'s End), and Pitawala Pathana plains. It is exceptionally windy and mist-filled.',
    images: [
      'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'adams_peak',
    name: 'Adam\'s Peak (Sri Pada)',
    subtitle: 'Sacred mountain summit',
    coords: '6.8096° N, 80.4994° E',
    latitude: 6.8096,
    longitude: 80.4994,
    weather: 'Very cold at peak, 8-15°C',
    walkArea: 'Difficult, 5500+ steps climb',
    suitability: 'Ideal for pilgrims and high-endurance hikers.',
    info: 'A sacred mountain rising above the rainforest canopy. Trekkers climb thousands of stone steps overnight to witness the famous sunrise, which casts a triangular shadow of the mountain over the plains.',
    images: [
      'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'ohiya_devils',
    name: 'Ohiya & Devil\'s Staircase',
    subtitle: 'Hairpin bends and pine ridges',
    coords: '6.7869° N, 80.8406° E',
    latitude: 6.7869,
    longitude: 80.8406,
    weather: 'Mist and wind, 12-18°C',
    walkArea: 'Hard, 14 km track through estates',
    suitability: 'Excellent for hardcore hikers and backpackers.',
    info: 'One of the steepest, most dramatic trekking trails in Sri Lanka. Named for its extreme slopes and hairpins, the trail passes pristine waterfalls and offers views of the Uva valley basin.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525811902-f2a497d5194b?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'meemure_village',
    name: 'Meemure Remote Valley',
    subtitle: 'Isolated valley, rock pool slides',
    coords: '7.4333° N, 80.8333° E',
    latitude: 7.4333,
    longitude: 80.8333,
    weather: 'Humid, sunny spells, 24-28°C',
    walkArea: 'Moderate village trails',
    suitability: 'Perfect for cultural encounters and adventure campers.',
    info: 'A beautiful village hidden in the Knuckles hills, completely isolated. Features standard terraced paddy fields, crystal-clear streams with natural rock waterslides, and the famous pyramid-shaped Lakegala mountain.',
    images: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80',
    ],
  },
];
