export interface Product {
  sold?: number;
  images: string[];
  subcategory: Product[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  priceAfterDiscount?: number;
  availableColors?: any[];
}

export interface product {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ProductsResponse {
  results: number;
  metadata: Metadata;
  data: Product[];  
}

export interface Metadata {
  currentPage: number;
  numberOfPage: number;
  limit: number;
  nextPage: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
