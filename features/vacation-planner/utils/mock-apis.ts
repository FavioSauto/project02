interface MockLocation {
  id: string;
  name: string;
  type: 'standard' | 'hidden_gem';
  category: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  typicalVisitDuration: number;
  description: string;
}

interface MockTransitResult {
  distance: number;
  duration: number;
}

const MOCK_LOCATIONS_DATABASE: Record<string, MockLocation[]> = {
  'Paris, France': [
    {
      id: 'paris-1',
      name: 'Eiffel Tower',
      type: 'standard',
      category: 'Landmark',
      city: 'Paris',
      country: 'France',
      latitude: 48.8584,
      longitude: 2.2945,
      typicalVisitDuration: 120,
      description: 'Iconic iron lattice tower on the Champ de Mars',
    },
    {
      id: 'paris-2',
      name: 'Louvre Museum',
      type: 'standard',
      category: 'Museum',
      city: 'Paris',
      country: 'France',
      latitude: 48.8606,
      longitude: 2.3376,
      typicalVisitDuration: 180,
      description: 'World\'s largest art museum',
    },
    {
      id: 'paris-3',
      name: 'Musée de la Chasse et de la Nature',
      type: 'hidden_gem',
      category: 'Museum',
      city: 'Paris',
      country: 'France',
      latitude: 48.8606,
      longitude: 2.3583,
      typicalVisitDuration: 90,
      description: 'Unique museum dedicated to hunting and nature',
    },
    {
      id: 'paris-4',
      name: 'Le Marais District',
      type: 'hidden_gem',
      category: 'Neighborhood',
      city: 'Paris',
      country: 'France',
      latitude: 48.8566,
      longitude: 2.3622,
      typicalVisitDuration: 150,
      description: 'Historic district with charming streets and boutiques',
    },
    {
      id: 'paris-5',
      name: 'Notre-Dame Cathedral',
      type: 'standard',
      category: 'Landmark',
      city: 'Paris',
      country: 'France',
      latitude: 48.8530,
      longitude: 2.3499,
      typicalVisitDuration: 90,
      description: 'Medieval Catholic cathedral',
    },
    {
      id: 'paris-6',
      name: 'Sacré-Cœur',
      type: 'standard',
      category: 'Landmark',
      city: 'Paris',
      country: 'France',
      latitude: 48.8867,
      longitude: 2.3431,
      typicalVisitDuration: 75,
      description: 'Basilica on Montmartre hill',
    },
    {
      id: 'paris-7',
      name: 'Septime',
      type: 'hidden_gem',
      category: 'Gastronomy',
      city: 'Paris',
      country: 'France',
      latitude: 48.8527,
      longitude: 2.3795,
      typicalVisitDuration: 120,
      description: 'Contemporary French bistro',
    },
    {
      id: 'paris-8',
      name: 'Jardin du Luxembourg',
      type: 'standard',
      category: 'Nature',
      city: 'Paris',
      country: 'France',
      latitude: 48.8462,
      longitude: 2.3372,
      typicalVisitDuration: 90,
      description: 'Beautiful public park',
    },
  ],
  'Tokyo, Japan': [
    {
      id: 'tokyo-1',
      name: 'Senso-ji Temple',
      type: 'standard',
      category: 'Landmark',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.7148,
      longitude: 139.7967,
      typicalVisitDuration: 90,
      description: 'Ancient Buddhist temple in Asakusa',
    },
    {
      id: 'tokyo-2',
      name: 'teamLab Borderless',
      type: 'standard',
      category: 'Museum',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6262,
      longitude: 139.7845,
      typicalVisitDuration: 150,
      description: 'Digital art museum',
    },
    {
      id: 'tokyo-3',
      name: 'Yanaka District',
      type: 'hidden_gem',
      category: 'Neighborhood',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.7279,
      longitude: 139.7677,
      typicalVisitDuration: 120,
      description: 'Old Tokyo neighborhood with traditional atmosphere',
    },
    {
      id: 'tokyo-4',
      name: 'Tsukiji Outer Market',
      type: 'hidden_gem',
      category: 'Gastronomy',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6654,
      longitude: 139.7707,
      typicalVisitDuration: 90,
      description: 'Fresh seafood and street food market',
    },
    {
      id: 'tokyo-5',
      name: 'Meiji Shrine',
      type: 'standard',
      category: 'Landmark',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6764,
      longitude: 139.6993,
      typicalVisitDuration: 75,
      description: 'Shinto shrine surrounded by forest',
    },
    {
      id: 'tokyo-6',
      name: 'Shinjuku Gyoen',
      type: 'standard',
      category: 'Nature',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6852,
      longitude: 139.7100,
      typicalVisitDuration: 120,
      description: 'Large park with traditional Japanese gardens',
    },
  ],
  'Barcelona, Spain': [
    {
      id: 'barcelona-1',
      name: 'Sagrada Familia',
      type: 'standard',
      category: 'Landmark',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.4036,
      longitude: 2.1744,
      typicalVisitDuration: 120,
      description: 'Gaudí\'s unfinished basilica',
    },
    {
      id: 'barcelona-2',
      name: 'Park Güell',
      type: 'standard',
      category: 'Nature',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.4145,
      longitude: 2.1527,
      typicalVisitDuration: 90,
      description: 'Gaudí\'s colorful park',
    },
    {
      id: 'barcelona-3',
      name: 'El Born Cultural Center',
      type: 'hidden_gem',
      category: 'Museum',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3851,
      longitude: 2.1826,
      typicalVisitDuration: 75,
      description: 'Archaeological site and cultural center',
    },
    {
      id: 'barcelona-4',
      name: 'Bunkers del Carmel',
      type: 'hidden_gem',
      category: 'Nature',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.4178,
      longitude: 2.1669,
      typicalVisitDuration: 60,
      description: 'Panoramic viewpoint with city views',
    },
    {
      id: 'barcelona-5',
      name: 'La Boqueria Market',
      type: 'standard',
      category: 'Gastronomy',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3818,
      longitude: 2.1713,
      typicalVisitDuration: 60,
      description: 'Famous public market',
    },
    {
      id: 'barcelona-6',
      name: 'Gothic Quarter',
      type: 'standard',
      category: 'Neighborhood',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3828,
      longitude: 2.1764,
      typicalVisitDuration: 120,
      description: 'Medieval neighborhood',
    },
  ],
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function mockGooglePlacesSearch(
  query: string,
  type?: 'standard' | 'hidden_gem'
): Promise<MockLocation[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedQuery = query.trim();
  let results: MockLocation[] = [];

  for (const [destination, locations] of Object.entries(MOCK_LOCATIONS_DATABASE)) {
    if (destination.toLowerCase().includes(normalizedQuery.toLowerCase())) {
      results = locations;
      break;
    }
  }

  if (results.length === 0) {
    const allLocations = Object.values(MOCK_LOCATIONS_DATABASE).flat();
    results = allLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(normalizedQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(normalizedQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(normalizedQuery.toLowerCase())
    );
  }

  if (type) {
    results = results.filter((loc) => loc.type === type);
  }

  return results;
}

export async function mockMapboxTransit(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<MockTransitResult> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const distance = calculateDistance(fromLat, fromLon, toLat, toLon);
  const duration = Math.round(distance * 0.5 * 60);

  return {
    distance: Math.round(distance * 100) / 100,
    duration,
  };
}

export async function mockGetLocationsByDestination(
  destination: string,
  type?: 'standard' | 'hidden_gem'
): Promise<MockLocation[]> {
  const locations = MOCK_LOCATIONS_DATABASE[destination] || [];

  if (type) {
    return locations.filter((loc) => loc.type === type);
  }

  return locations;
}

export function getAvailableDestinations(): string[] {
  return Object.keys(MOCK_LOCATIONS_DATABASE);
}

