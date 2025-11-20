/**
 * Gradient Service
 * Provides predefined gradients and utility functions to get random or specific gradients
 */

export interface Gradient {
  id: number;
  value: string;
  name?: string;
}

// Predefined gradients collection
const GRADIENTS: Gradient[] = [
  {
    id: 1,
    value: "linear-gradient(180deg, #FFE6F4 20.66%, #FFFAFD 100%)",
    name: "Pink Blush",
  },
  {
    id: 2,
    value: "linear-gradient(180deg, #F5FFD9 29.57%, #FDFFF7 100%)",
    name: "Lime Fresh",
  },
  {
    id: 3,
    value: "linear-gradient(180deg, #78E6F4 20.66%, #F5FEFF 100%)",
    name: "Cyan Sky",
  },
  {
    id: 4,
    value: "linear-gradient(180deg, #FFC8DB 29.57%, #FFF7FA 100%)",
    name: "Rose Pink",
  },
  {
    id: 5,
    value: "linear-gradient(180deg, #FFE4C7 20.66%, #FFFCF5 100%)",
    name: "Peach Cream",
  },
  {
    id: 6,
    value: "linear-gradient(180deg, #E1FFD9 29.57%, #FDFFF7 100%)",
    name: "Mint Green",
  },
  {
    id: 7,
    value: "linear-gradient(180deg, #78E6F4 20.66%, #F5FEFF 100%)",
    name: "Ocean Blue",
  },
];

/**
 * Get a random gradient from the collection
 * @returns {Gradient} A random gradient object
 */
export const getRandomGradient = (): Gradient => {
  const randomIndex = Math.floor(Math.random() * GRADIENTS.length);

  return GRADIENTS[randomIndex];
};

/**
 * Get a specific gradient by ID (1-based index)
 * @param {number} id - The gradient ID (1-7)
 * @returns {Gradient | null} The gradient object or null if not found
 */
export const getGradientById = (id: number): Gradient | null => {
  const gradient = GRADIENTS.find((g) => g.id === id);

  return gradient || null;
};

/**
 * Get a gradient by ID or return a random one if ID is not provided or invalid
 * @param {number | undefined} id - Optional gradient ID (1-7)
 * @returns {Gradient} A gradient object
 */
export const getGradient = (id?: number): Gradient => {
  if (id !== undefined && id !== null) {
    const gradient = getGradientById(id);

    if (gradient) {
      return gradient;
    }
  }

  return getRandomGradient();
};

/**
 * Get all available gradients
 * @returns {Gradient[]} Array of all gradients
 */
export const getAllGradients = (): Gradient[] => {
  return [...GRADIENTS];
};

/**
 * Get the gradient value (CSS string) by ID or random
 * @param {number | undefined} id - Optional gradient ID (1-7)
 * @returns {string} The gradient CSS value
 */
export const getGradientValue = (id?: number): string => {
  return getGradient(id).value;
};

/**
 * Get multiple random gradients (without duplicates)
 * @param {number} count - Number of gradients to return
 * @returns {Gradient[]} Array of random gradients
 */
export const getRandomGradients = (count: number): Gradient[] => {
  const shuffled = [...GRADIENTS].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(count, GRADIENTS.length));
};
