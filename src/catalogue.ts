export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  rating: number;
}

export interface Catalogue {
  products: Product[];
  featured: string[];
}

export function selectProducts(
  catalogue: Catalogue,
  category: string,
  search: string,
) {
  const term = search.trim().toLowerCase();
  const matches = catalogue.products.filter(
    (product) =>
      (!category || product.category === category) &&
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(term),
  );
  const featured = catalogue.featured.flatMap((id) =>
    matches.filter((product) => product.id === id),
  );
  return {
    matches,
    featured,
    additional: matches.filter(
      (product) => !catalogue.featured.includes(product.id),
    ),
  };
}
