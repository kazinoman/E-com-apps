import { NextRequest, NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const data = await getDbData();
    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 500 });
    }

    let products = data.products || [];
    const searchParams = request.nextUrl.searchParams;

    // Filters
    const category = searchParams.get('category');
    if (category) products = products.filter((p: any) => p.category === category);

    const subCategory = searchParams.get('subCategory');
    if (subCategory) products = products.filter((p: any) => p.subCategory === subCategory);

    const title = searchParams.get('title') || searchParams.get('search');
    if (title) {
      const lowerTitle = title.toLowerCase();
      products = products.filter((p: any) => p.title.toLowerCase().includes(lowerTitle));
    }

    const priceMin = searchParams.get('priceMin');
    if (priceMin) products = products.filter((p: any) => p.price >= Number(priceMin));

    const priceMax = searchParams.get('priceMax');
    if (priceMax) products = products.filter((p: any) => p.price <= Number(priceMax));

    const rating = searchParams.get('rating');
    if (rating) products = products.filter((p: any) => Math.floor(p.rating) >= Number(rating));

    const color = searchParams.get('color');
    if (color) {
      products = products.filter((p: any) => 
        p.colors?.some((c: any) => c.name.toLowerCase().includes(color.toLowerCase()))
      );
    }

    // Sorting
    const sort = searchParams.get('sort');
    const order = searchParams.get('order') || 'asc';
    if (sort) {
      products.sort((a: any, b: any) => {
        let valA = a[sort];
        let valB = b[sort];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedProducts,
      meta: {
        pagination: {
          total: products.length,
          page,
          limit,
          totalPages: Math.ceil(products.length / limit),
        }
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
