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
 * Get all available gradients
 * @returns {Gradient[]} Array of all gradients
 */
export const getAllGradients = (): Gradient[] => {
  return [...GRADIENTS];
};
