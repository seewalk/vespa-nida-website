'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Product categories
  const categories = ['All', 'Safety', 'Accessories', 'Parts', 'Lifestyle'];
  
  // Product data with extended details
  const products = [
    {
      id: 1,
      name: "Vintage Vespa Helmet",
      price: "€89",
      image: "/images/vespa-helmet.jpg",
      category: "Safety",
      isNew: false,
      isBestseller: true,
      description: "Premium retro-inspired helmet with modern safety standards, perfectly matching your Vespa's aesthetic.",
      colors: ["Sage Green", "Ivory White", "Graphite Black"],
      rating: 4.8
    },
    {
      id: 2,
      name: "Leather Seat Cover",
      price: "€129",
      image: "/images/vespa-seat.jpg",
      category: "Accessories",
      isNew: true,
      isBestseller: false,
      description: "Hand-crafted genuine leather seat cover with weather-resistant treatment for lasting beauty.",
      colors: ["Chestnut Brown", "Black"],
      rating: 4.6
    },
    {
      id: 3,
      name: "Chrome Mirror Set",
      price: "€75",
      image: "/images/mirrors.jpg", // Using the provided mirror image path
      category: "Parts",
      isNew: false,
      isBestseller: false,
      description: "Original replacement mirrors with improved visibility and classic chrome finish.",
      colors: ["Chrome"],
      rating: 4.5
    },
    {
      id: 4,
      name: "Nida Map & Guide",
      price: "€19",
      image: "/images/nida-map.jpg",
      category: "Lifestyle",
      isNew: true,
      isBestseller: true,
      description: "Beautifully illustrated map with insider tips and hidden gems throughout Nida and the Curonian Spit.",
      colors: ["N/A"],
      rating: 4.9
    },
    {
      id: 5,
      name: "Vespa Picnic Basket",
      price: "€95",
      image: "/images/vespa-helmet.jpg", // Using helmet image as placeholder - would be replaced with basket image
      category: "Lifestyle",
      isNew: false,
      isBestseller: false,
      description: "Handwoven wicker picnic basket that attaches securely to your Vespa for romantic getaways.",
      colors: ["Natural"],
      rating: 4.7
    },
    {
      id: 6,
      name: "Performance Exhaust",
      price: "€149",
      image: "/images/mirrors.jpg", // Using mirrors image as placeholder - would be replaced with exhaust image
      category: "Parts",
      isNew: true,
      isBestseller: false,
      description: "Lightweight performance exhaust system enhancing both sound and power while maintaining classic style.",
      colors: ["Chrome", "Matte Black"],
      rating: 4.4
    },
    {
      id: 7,
      name: "Vespa Tote Bag",
      price: "€45",
      image: "/images/nida-map.jpg", // Using map image as placeholder - would be replaced with bag image
      category: "Lifestyle",
      isNew: false,
      isBestseller: true,
      description: "Canvas tote with leather accents featuring our exclusive Vespa Nida coastal illustration.",
      colors: ["Sand Beige", "Sage Green"],
      rating: 4.8
    },
    {
      id: 8,
      name: "Riding Gloves",
      price: "€65",
      image: "/images/vespa-seat.jpg", // Using seat image as placeholder - would be replaced with gloves image
      category: "Safety",
      isNew: true,
      isBestseller: false,
      description: "Premium leather riding gloves that combine style with protection for all your adventures.",
      colors: ["Brown", "Black"],
      rating: 4.5
    }
  ];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Generate star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-graphite-black/70">{rating}</span>
      </div>
    )
  };

  return (
    <section id="shop" className="py-24 md:py-32 bg-ivory-white relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 border border-sage-green/10 rounded-full -translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-sage-green/10 rounded-full translate-y-1/3 translate-x-1/3"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">Our Collection</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">Vespa Parts & Accessories</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            Discover our curated selection of original Vespa parts, accessories, and lifestyle items. 
            Each piece is meticulously selected to enhance your Vespa experience.
          </p>
        </motion.div>
        
        {/* Category filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-sage-green text-white shadow-md' 
                  : 'bg-white text-graphite-black/70 hover:bg-sage-green/10'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* Products grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                layout
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Quick view overlay on hover */}
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <button className="bg-white text-graphite-black px-4 py-2 rounded-full text-sm font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  {/* Product badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-sage-green text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-syne font-bold text-lg">{product.name}</h3>
                    <span className="font-bold text-sage-green">{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-sage-green uppercase tracking-wider">{product.category}</p>
                    {renderStars(product.rating)}
                  </div>
                  
                  {/* Expandable product details */}
                  <AnimatePresence>
                    {hoveredProduct === product.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pt-4 border-t border-graphite-black/10"
                      >
                        <p className="text-sm text-graphite-black/70 mb-3">
                          {product.description}
                        </p>
                        
                        {/* Color options */}
                        <div className="flex items-center mb-4">
                          <span className="text-xs font-medium mr-2">Colors:</span>
                          <div className="flex gap-1">
                            {product.colors.map((color, idx) => (
                              <span key={idx} className="text-xs text-graphite-black/70">
                                {color}{idx < product.colors.length - 1 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button className="w-full bg-sage-green text-white py-2 rounded text-sm font-medium hover:bg-sage-green/90 transition-colors">
                          Add to Cart
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty state for no products */}
        {filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sage-green/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-4 text-graphite-black/50">No products found in this category</p>
          </motion.div>
        )}
        
        {/* Visit shop CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <a href="/shop" className="btn-primary inline-flex items-center px-8 py-3">
            <span>Visit Online Shop</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-graphite-black/60">
            Free shipping on orders over €100. Local pickup available at our Nida location.
          </p>
        </motion.div>
        
        {/* Featured collection banner */}
        <motion.div
          className="mt-24 bg-sand-beige/30 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-sm uppercase tracking-wider text-sage-green font-medium">Limited Edition</span>
              <h3 className="text-2xl md:text-3xl font-bold font-syne mt-2 mb-4">Nida Heritage Collection</h3>
              <p className="text-graphite-black/70 mb-6">
                Discover our exclusive collection inspired by the rich heritage and natural beauty of the Curonian Spit.
              </p>
              <a href="/collection" className="text-sage-green hover:text-sage-green/80 inline-flex items-center font-medium">
                <span>Explore Collection</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            <div className="relative h-60 md:h-auto">
              <Image
                src="/images/vespa-helmet.jpg" // Would be replaced with collection banner image
                alt="Nida Heritage Collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}