const API_URL = "https://glovia-backend-8zxd.onrender.com/api/products/";

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