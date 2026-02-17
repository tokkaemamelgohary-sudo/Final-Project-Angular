import { Product } from './product.interface';

export interface ProductsResponse {
  results: number;
  data: Product[];
}
