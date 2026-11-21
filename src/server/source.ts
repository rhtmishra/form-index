import type { Catalogue, Product } from "../catalogue";

function object(
  id: string,
  name: string,
  category: string,
  image: string,
  price: number,
  rating: number,
  description: string,
): Product {
  return {
    id,
    name,
    category,
    image: `/images/${image}.webp`,
    price,
    rating,
    description,
  };
}

const catalogue: Catalogue = {
  featured: ["001", "002", "003", "004", "005"],
  products: [
    object(
      "001",
      "Saarinen Executive Chair",
      "Furniture",
      "knoll-saarinen-executive-conference-chair",
      490,
      4.9,
      "A sculpted seat with an open back and a compact silhouette. A considered piece for the desk or dining room.",
    ),
    object(
      "002",
      "Studio Table Lamp",
      "Objects",
      "table-lamp",
      85,
      4.8,
      "A bedside light with a softly shaded glow. Sized for a side table, reading corner or narrow console.",
    ),
    object(
      "003",
      "Aluminium Cup",
      "Tableware",
      "black-aluminium-cup",
      24,
      4.8,
      "A dark aluminium drinking cup with a clean profile and a generous handle.",
    ),
    object(
      "004",
      "Colombo Sofa",
      "Furniture",
      "annibale-colombo-sofa",
      2490,
      4.9,
      "An upholstered sofa with a low, generous seat and softly rounded proportions.",
    ),
    object(
      "005",
      "Botanical Planter",
      "Objects",
      "plant-pot",
      38,
      4.7,
      "A planted tabletop accent that brings a little greenery to shelves and quiet corners.",
    ),
    object(
      "006",
      "Cherry Bedside Table",
      "Furniture",
      "bedside-table-african-cherry",
      295,
      4.6,
      "A compact wooden bedside table with storage for everyday essentials.",
    ),
    object(
      "007",
      "House Plant",
      "Objects",
      "house-showpiece-plant",
      42,
      4.6,
      "An ornamental plant for a windowsill or a small display.",
    ),
    object(
      "008",
      "Chopping Board",
      "Tableware",
      "chopping-board",
      32,
      4.7,
      "A wooden kitchen board for chopping, preparing and serving.",
    ),
    object(
      "009",
      "Bamboo Spatula",
      "Tableware",
      "bamboo-spatula",
      12,
      4.5,
      "A lightweight bamboo utensil for stirring and turning food.",
    ),
  ],
};

export const loadCatalogue = async (): Promise<Catalogue> => catalogue;
