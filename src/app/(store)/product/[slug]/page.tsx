import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isActive: true });
    
    if (!product) {
      return {
        title: 'Product Not Found - VENTERSHOP',
        description: 'The requested product is not available.',
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
  await connectToDatabase();
  const { slug } = await params;
  
  // Find product and populate category
  const productDoc = await Product.findOne({ slug, isActive: true }).populate('categoryId', 'name slug');
  
  if (!productDoc) {
    notFound();
  }

  // Convert mongoose document to a plain JSON object to pass to client component safely
  const product = JSON.parse(JSON.stringify(productDoc));

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
