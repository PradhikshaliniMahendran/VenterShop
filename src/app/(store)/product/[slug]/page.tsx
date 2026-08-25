import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { fallbackProducts } from '@/lib/data/fallbackData';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    let product: any = null;

    try {
      await connectToDatabase();
      product = await Product.findOne({ slug, isActive: true });
    } catch {
      product = fallbackProducts.find((p) => p.slug === slug);
    }
    
    if (!product) {
      return {
        title: 'Product Details - VENTERSHOP',
        description: 'The requested product is available across Canada.',
      };
    }

    return {
      title: `${product.name} - VENTERSHOP`,
      description: product.shortDescription || product.description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description.substring(0, 160),
        images: [{ url: product.images[0] || '/images/hero_banner.png' }],
      },
    };
  } catch (error) {
    return {
      title: 'Product Details - VENTERSHOP',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product: any = null;

  try {
    await connectToDatabase();
    const productDoc = await Product.findOne({ slug, isActive: true }).populate('categoryId', 'name slug');
    if (productDoc) {
      product = JSON.parse(JSON.stringify(productDoc));
    }
  } catch (dbError) {
    console.warn('Database offline, looking up fallback product for slug:', slug);
  }

  if (!product) {
    product = fallbackProducts.find((p) => p.slug === slug);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="flex-grow py-8">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
