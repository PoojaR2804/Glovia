const API_URL = "http://127.0.0.1:8000/api/products/";

export const fetchProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.map((product) => ({
    ...product,
    Image: product.image,
    price: Number(product.price),
    rating: Number(product.rating),
  }));
};