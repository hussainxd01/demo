// Mock product data - Replace with API calls in /lib/api.js
export const PRODUCTS = [
  {
    id: 1,
    name: "Anti-Aging Body Cream",
    brand: "DR. ELOWEN LIZ",
    price: 10400,
    originalPrice: 12500,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595348440529-eca07a04b189?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1627744486245-7273453ba212?w=500&h=600&fit=crop",
    ],
    rating: 5,
    reviews: 324,
    category: "BODY CARE",
    description:
      "This luxurious anti-aging body cream deeply moisturizes and tones the skin for a visibly younger and velvety soft complexion.",
    fullDescription:
      "This luxurious anti-aging body cream deeply moisturizes and tones the skin for a visibly younger and velvety soft complexion. Infused with pure glacier water and precious extracts from Indian almond and elderberry blossom, it absorbs easily to refresh and revitalize the skin, while tightening and restoring elasticity.",
    size: "50 ml",
    keyIngredients: [
      "Pure Glacier Water",
      "Indian Almond Extract",
      "Elderberry Blossom",
      "Hyaluronic Acid",
      "Vitamin E",
    ],
    howToUse: [
      "Apply to clean, dry skin",
      "Massage gently in upward motions",
      "Use morning and evening",
      "Allow to absorb fully before dressing",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 2,
    name: "Glow Drops",
    brand: "DR. ELOWEN LIZ",
    price: 13700,
    originalPrice: 15200,
    image:
      "https://images.unsplash.com/photo-1596971773259-88e0fb7bae7e?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596971773259-88e0fb7bae7e?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
    ],
    rating: 4.5,
    reviews: 287,
    category: "SKINCARE",
    description:
      "Luminous face serum with light-reflecting particles for an instant glow.",
    fullDescription:
      "Transform your skin with our revolutionary Glow Drops. This lightweight serum combines hyaluronic acid with light-reflecting particles to instantly brighten and hydrate your complexion. Perfect for all skin types, our formula absorbs quickly without leaving any residue.",
    size: "30 ml",
    keyIngredients: [
      "Hyaluronic Acid",
      "Light-Reflecting Particles",
      "Vitamin C",
      "Squalane",
    ],
    howToUse: [
      "2-3 drops on damp skin",
      "Pat gently until absorbed",
      "Follow with moisturizer",
      "Use twice daily",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 3,
    name: "Sun Drops SPF 50",
    brand: "DR. ELOWEN LIZ",
    price: 13700,
    originalPrice: 15200,
    image:
      "https://images.unsplash.com/photo-1631730486211-26af2e3ffd6e?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631730486211-26af2e3ffd6e?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    ],
    rating: 5,
    reviews: 412,
    category: "SUNCARE",
    description:
      "High-performance sunscreen with SPF 50 protection and water resistance.",
    fullDescription:
      "Protect your skin with our advanced SPF 50 sunscreen. Provides broad-spectrum UVA/UVB protection with a lightweight, non-greasy formula. Water-resistant for up to 80 minutes. Suitable for all skin types including sensitive skin.",
    size: "50 ml",
    keyIngredients: [
      "Titanium Dioxide",
      "Zinc Oxide",
      "Vitamin E",
      "Aloe Vera",
    ],
    howToUse: [
      "Apply 15 minutes before sun exposure",
      "Reapply every 2 hours",
      "Use 1/4 teaspoon per face",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 4,
    name: "Hydrating Face Mask",
    brand: "TATA HARPER",
    price: 8900,
    originalPrice: 10500,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
    ],
    rating: 4.8,
    reviews: 203,
    category: "SKINCARE",
    description: "Intensive hydrating mask for dry and sensitive skin.",
    fullDescription:
      "Deep hydration meets natural luxury in our Hydrating Face Mask. Formulated with plant-based ingredients, this mask provides intensive moisture to dry and dehydrated skin while soothing sensitivity and redness.",
    size: "60 ml",
    keyIngredients: ["Rose Water", "Chamomile", "Glycerin", "Aloe Vera"],
    howToUse: [
      "Apply to clean skin",
      "Leave for 10-15 minutes",
      "Rinse with warm water",
      "Use 1-2 times per week",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 5,
    name: "Nourish Naturally Serum",
    brand: "SHANGPREE",
    price: 9500,
    originalPrice: 11200,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    ],
    rating: 4.7,
    reviews: 156,
    category: "SKINCARE",
    description: "Nutrient-rich serum with natural plant extracts.",
    fullDescription:
      "Nourish your skin naturally with our botanical serum. Packed with vitamins, minerals, and plant extracts, this lightweight formula penetrates deeply to hydrate, revitalize, and protect your skin from environmental stressors.",
    size: "30 ml",
    keyIngredients: [
      "Ginseng Extract",
      "Peptides",
      "Niacinamide",
      "Botanical Blend",
    ],
    howToUse: [
      "Apply to damp skin after cleansing",
      "Follow with moisturizer",
      "Use morning and evening",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 6,
    name: "Gentle Cleanser",
    brand: "BOUTIJOUR",
    price: 7200,
    originalPrice: 8500,
    image:
      "https://images.unsplash.com/photo-1595348440529-eca07a04b189?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595348440529-eca07a04b189?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    ],
    rating: 4.6,
    reviews: 289,
    category: "SKINCARE",
    description: "Mild cleansing milk suitable for sensitive skin.",
    fullDescription:
      "Our Gentle Cleanser is designed for even the most sensitive skin. This creamy formula removes makeup and impurities without disrupting the natural skin barrier, leaving your complexion clean, soft, and refreshed.",
    size: "200 ml",
    keyIngredients: [
      "Micellar Technology",
      "Rose Water",
      "Aloe Vera",
      "Vitamin E",
    ],
    howToUse: [
      "Apply to damp face and neck",
      "Massage gently with fingertips",
      "Rinse thoroughly with water",
      "Use morning and evening",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 7,
    name: "Luxury Eye Cream",
    brand: "DR. BARBARA STURM",
    price: 12400,
    originalPrice: 14200,
    image:
      "https://images.unsplash.com/photo-1627744486245-7273453ba212?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627744486245-7273453ba212?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    ],
    rating: 4.9,
    reviews: 445,
    category: "SKINCARE",
    description: "Premium eye cream targeting fine lines and dark circles.",
    fullDescription:
      "Our Luxury Eye Cream is specifically formulated to address the delicate eye area. With a potent blend of peptides and hyaluronic acid, it reduces fine lines, diminishes dark circles, and brightens the eye contour for a refreshed, youthful appearance.",
    size: "15 ml",
    keyIngredients: ["Hyaluronic Acid", "Peptides", "Caffeine", "Vitamin K"],
    howToUse: [
      "Apply gently around the eye area",
      "Use with ring finger to avoid tugging",
      "Apply morning and evening",
      "Wait before applying makeup",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
  {
    id: 8,
    name: "Night Recovery Cream",
    brand: "DR. BARBARA STURM",
    price: 14500,
    originalPrice: 16800,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop",
    ],
    rating: 5,
    reviews: 321,
    category: "SKINCARE",
    description: "Intensive night treatment for skin restoration and repair.",
    fullDescription:
      "Harness the power of night with our intensive recovery cream. This luxurious formula works while you sleep to restore, repair, and rejuvenate your skin. Wake up to smoother, firmer, and more radiant complexion.",
    size: "50 ml",
    keyIngredients: [
      "Retinol Alternative",
      "Peptide Complex",
      "Hyaluronic Acid",
      "Plant Oils",
    ],
    howToUse: [
      "Apply to clean skin before bed",
      "Massage gently into face and neck",
      "Use every night",
      "Can be used under eye area",
    ],
    shipping:
      "No EU import duties. Ships within 1-2 business days. Ships in our fully recyclable and biodegradable signature boxes.",
    availability: "In Stock",
  },
];

export const BRANDS = [
  "DR. BARBARA STURM",
  "TATA HARPER",
  "BOUTIJOUR",
  "SHANGPREE",
  "DR. ELOWEN LIZ",
];

export const CATEGORIES = [
  { name: "SKINCARE", slug: "skincare" },
  { name: "BODY CARE", slug: "body-care" },
  { name: "HAIR CARE", slug: "hair-care" },
  { name: "BABY & KIDS", slug: "baby-kids" },
];
