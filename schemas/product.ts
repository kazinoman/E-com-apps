export interface Sku {
  id: string;
  sku: string;
  color: string;
  price: number;
  stock: number;
  image?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Seller {
  name: string;
  verified: boolean;
  rating: number;
  logo: string;
}

export interface ProductDescription {
  text: string;
  images: string[];
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ReviewsData {
  average: number;
  total: number;
  distribution: Record<string, number>;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewsCount: number;
  badge: string | null;
  image: string;
  images: string[];
  skus: Sku[];
  colors: ProductColor[];
  seller: Seller;
  description: ProductDescription;
  specifications: ProductSpecification[];
  reviewsData: ReviewsData;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}
