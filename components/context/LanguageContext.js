'use client';

import { createContext, useState, useContext, useEffect } from 'react';

// Domain to language mapping
const DOMAIN_LANGUAGE_MAP = {
  'vespanida.lt': 'lt',          // Main domain - Lithuanian
  'en.vespanida.lt': 'en',       // English subdomain
  'de.vespanida.lt': 'de',       // German subdomain  
  'pl.vespanida.lt': 'pl'        // Polish subdomain
};

// Language to domain mapping
const LANGUAGE_DOMAIN_MAP = {
  'lt': 'https://vespanida.lt',
  'en': 'https://en.vespanida.lt',
  'de': 'https://de.vespanida.lt',
  'pl': 'https://pl.vespanida.lt'
};

// Define available languages
export const languages = [
  { code: 'en', name: 'English', domain: 'en.vespanida.lt', flag: '🇬🇧' },
  { code: 'lt', name: 'Lithuanian', domain: 'vespanida.lt', flag: '🇱🇹' },
  { code: 'de', name: 'German', domain: 'de.vespanida.lt', flag: '🇩🇪' },
  { code: 'pl', name: 'Polish', domain: 'pl.vespanida.lt', flag: '🇵🇱' }
];

// Your translations object (keeping your existing translations)
const translations = {

  en: {
    nav: {
      home: 'Home',
      about: 'About',
      fleet: 'Fleet',
      explore: 'Explore',
      shop: 'Shop',
      contact: 'Contact'
    },
    buttons: {
      bookNow: 'Book Now',
      reserveNow: 'Reserve Now',
      subscribe: 'Subscribe',
      bookYourRide: 'Book Your Ride'
    },
    // New hero section translations
    hero: {
        viewFAQ: "FAQs",
      tagline: "Premium Vespa Rentals in Nida",
      slogans: {
        first: "Elegance in Motion",
        second: "Authentic Rides. Timeless Style.",
        third: "Cruise Nida. Live Vespa."
      },
      description: "Experience the scenic beauty of Nida with our luxury Vespa rentals. Cruise the Baltic coastline with style and freedom.",
      exploreFleet: "Explore Our Fleet",
      contactUs: "Contact Us",
      scrollToExplore: "Scroll to explore",
      imageAlt: "Vespa scooter on a scenic coastal road in Nida"
    },

    calendar: {
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  },
  days: {
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat'
  },
  availableScooters: 'Available scooters',
  units: 'pcs.',
  legend: {
    bothAvailable: 'Both scooters available',
    oneAvailable: '1 scooter available',
    allBooked: 'All scooters booked'
  },
  status: {
    label: 'Status',
    pending: 'Pending confirmation',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled'
  },
  bookingDetails: 'Booking Details',
  bookingNumber: 'Booking No.',
  customer: 'Customer',
  email: 'Email',
  phone: 'Phone',
  vespa: 'Vespa',
  amount: 'Amount',
  confirm: 'Confirm',
  cancel: 'Cancel',
  markCompleted: 'Mark as completed',
  deleteBooking: 'Delete booking',
  close: 'Close',
  bookingUpdated: 'Booking updated successfully!',
  bookingDeleted: 'Booking deleted successfully!',
  confirmDelete: 'Are you sure you want to delete this booking?',
  updateError: 'Error updating booking: ',
  deleteError: 'Error deleting booking: '
},
    about: {
      title: "About Vespa Nida",
      subtitle: "Our Story",
      paragraph1: "Vespa Nida offers a premium scooter rental experience in the heart of Lithuania's most beautiful coastal town. Our mission is to provide visitors with a stylish, convenient, and eco-friendly way to explore the natural wonders of the Curonian Spit.",
      paragraph2: "Founded by local enthusiasts with a passion for Italian design and Baltic landscapes, we curate a fleet of meticulously maintained Vespa scooters that combine classic aesthetics with modern performance.",
      features: {
        premium: {
          title: "Premium Fleet",
          description: "Meticulously maintained Vespa scooters in pristine condition"
        },
        expertise: {
          title: "Local Expertise",
          description: "Insider knowledge of Nida's hidden gems and scenic routes"
        },
        service: {
          title: "Seamless Service",
          description: "Hassle-free booking, delivery, and support throughout your journey"
        }
      },
      quote: "\"Not just a scooter. A statement.\"",
      since: "Since",
      imageAlt: "Vintage Vespa scooter by the sea",
      showContent: "About Us",
      hideContent: "Hide Details"
    },

    

    rights: {
  title: "Your Rights (EU Laws)",
  subtitle: "Consumer Protection",
  description: "As a European Union consumer, you are protected by comprehensive laws that ensure fair and transparent rental services.",
  cancellation: {
    title: "14-Day Cancellation Right",
    description: "You can cancel your booking within 14 days without additional charges",
    badge: "EU Protected"
  },
  refund: {
    title: "Fast Refund Guarantee",
    description: "In case of cancellation, we will refund the full amount within 7 business days",
    badge: "7 Days Max"
  },
  weather: {
    title: "Weather Protection",
    description: "We offer date changes or full refunds due to weather conditions",
    badge: "Flexible"
  },
  privacy: {
    title: "GDPR Data Protection",
    description: "Your personal data is protected under GDPR regulations",
    badge: "Secure"
  },
  footer: {
    title: "Questions About Your Rights?",
    description: "Our customer service team is here to help you understand and exercise your consumer rights."
  }
},

   fleet: {
  title: "Our Vespa Fleet",
  subtitle: "Explore Our Collection",
  description: "Choose from our carefully selected premium Vespa scooters, maintained to the highest standards and ready for your adventures in Nida.",
  features: "Features",
  customRental: "Need a custom rental or have special requirements?",
  contactTeam: "Contact our team",
  buttons: {
    reserveNow: "Reserve Now",
    details: "Details",
    comingSoon: "Coming Soon",
    notifyWhenAvailable: "Notify Me",
    notifyTitle: "Get Notified When Available",
    notifyDescription: "We'll let you know as soon as our new Vespa GTS scooters are available for rental.",
    emailLabel: "Email Address",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+370 XXX XXXXX",
    emailPlaceholder: "your@email.com",
    cancel: "Cancel",
    notifySubmit: "Notify Me",
    notifySuccess: "Thanks! We'll notify you when this model becomes available.",
    moreInfo: "More Information"
  },
  items: {
  sprint: {
    name: "Vespa Elettrica 45",
    color: "Ivory White",
    description: "Classic Italian style with modern comfort. Perfect choice for coastal journeys.",
    specs: "3.1 kW | Electric | 2 passengers",
    features: [
      "Economical motor", 
      "Front disc brakes", 
      "Anti-theft system", 
      "Under-seat storage compartment"
    ]
  },
  sprint2: {
    name: "Vespa Elettrica 45",
    color: "Sage Green",
    description: "Powerful performance with timeless elegance. Ideal for longer journeys.",
    specs: "3.1 kW | Electric | 2 passengers",
    features: [
      "Anti-theft system", 
      "ABS braking system", 
      "Digital instrument panel", 
      "Spacious storage compartment"
    ]
  },
  sprint3: {
    name: "Vespa Elettrica 45",
    color: "Sand Beige",
    description: "Agile handling with refined aesthetics. Perfect for exploring narrow streets.",
    specs: "3.1 kW | Electric | 2 passengers",
    features: [
      "Easy maneuverability", 
      "LED lighting", 
      "Anti-theft system", 
      "Comfortable seat"
    ]
  }
}
    },

    explore: {
      title: "Explore Nida",
      subtitle: "Curated Journeys",
      description: "Discover the natural beauty and cultural heritage of the Curonian Spit with our expertly designed scenic routes. Each journey offers a unique perspective of Nida's breathtaking landscapes and hidden gems.",
      viewRoutes: "Explore Scenic Routes",
      hideRoutes: "Hide Routes",
      showMore: "Show More",
      showLess: "Show Less",
      routeHighlights: "Route Highlights",
      terrain: "Terrain",
      viewDetails: "View Details",
      viewAllRoutes: "View All Routes",
      customRoutesAvailable: "Custom routes available upon request",
      tipForExplorers: "Tip for Explorers",
      tipDescription: "All routes begin from our central location. GPS guides available on request for self-guided tours.",
      mapAlt: "Map of scenic routes in Nida",
      difficultyLevel: "Difficulty Level",
      difficulty: {
        easy: "Easy",
        moderate: "Moderate",
        hard: "Hard"
      },
      routes: {
        coastal: {
          title: "Coastal Lighthouse Route",
          distance: "12 km",
          duration: "45 min",
          difficulty: "Easy",
          description: "Follow the picturesque coastal road to the iconic Nida Lighthouse, offering panoramic views of the Baltic Sea and the Curonian Lagoon.",
          highlights: [
            "Panoramic sea views",
            "Historic lighthouse",
            "Sandy beaches",
            "Coastal wildlife"
          ],
          terrain: "Paved roads, flat terrain"
        },
         dunes: {
          title: "Sand Dunes Adventure",
          distance: "18 km",
          duration: "1 hour",
          difficulty: "Moderate",
          description: "Wind through pine forests to reach the famous Parnidis Dune, the second highest moving sand dune in Europe. Perfect for sunset views.",
          highlights: [
            "Towering sand dunes",
            "Forest trails",
            "Sundial monument",
            "Sunset views"
          ],
          terrain: "Mixed terrain, some inclines"
        },
        fisherman: {
          title: "Fisherman's Village Tour",
          distance: "8 km",
          duration: "30 min",
          difficulty: "Easy",
          description: "Discover the authentic charm of traditional Lithuanian fishing villages with their colorful wooden houses and rich maritime history.",
          highlights: [
            "Colorful houses",
            "Local crafts",
            "Fishing harbor",
            "Traditional architecture"
          ],
          terrain: "Paved roads, flat terrain"
        }
      }
    },

    languageSelector: {
    title: "Choose Your Language",
    subtitle: "Select your preferred language to continue"
  },

    shop: {
      title: "Vespa Parts & Accessories",
      subtitle: "Shop Collection",
      description: "Discover our curated selection of original Vespa parts, accessories, and lifestyle items. Each piece is carefully selected to enhance your Vespa experience.",
      viewProducts: "View Products",
      hideProducts: "Hide Products",
      visitOnlineShop: "Visit Online Shop",
      categories: {
        safety: "Safety",
        accessories: "Accessories",
        parts: "Parts",
        lifestyle: "Lifestyle"
      },
      products: {
        helmet: {
          name: "Vintage Vespa Helmet",
          price: "€89"
        },
        seat: {
          name: "Leather Seat Cover",
          price: "€129"
        },
        mirrors: {
          name: "Chrome Mirror Set",
          price: "€75"
        },
        map: {
          name: "Nida Map & Guide",
          price: "€19"
        }
      }
    },

    testimonials: {
      title: "What Our Clients Say",
      subtitle: "Testimonials",
      description: "Hear from travelers who have experienced the joy of exploring Nida on our premium Vespa scooters.",
      viewReviews: "View Reviews",
      hideReviews: "Hide Reviews",
      showDetails: "Show Details",
      showLess: "Show Less",
      vespaModel: "Vespa Model",
      routeTaken: "Route Taken",
      visitDate: "Visit Date",
      autoAdvancing: "Auto-advancing",
      pauseAutoplay: "Pause autoplay",
      startAutoplay: "Start autoplay",
      prevButton: "Previous testimonial",
      nextButton: "Next testimonial",
      goToReview: "Go to review",
      enjoyed: "Enjoyed your Vespa Nida experience?",
      shareYours: "Share your testimonial",
      items: [
        {
          name: "Julia Kovalenko",
          location: "Vilnius, Lithuania",
          quote: "Exploring Nida on a Vespa was the highlight of our summer trip. The team at Vespa Nida provided impeccable service from booking to return.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Coastal Lighthouse Route",
          date: "August 2023"
        },
        {
          name: "Thomas Müller",
          location: "Berlin, Germany",
          quote: "The freedom of cruising along the dunes on these stylish Vespas made our anniversary trip unforgettable. We discovered hidden beaches we would have never found otherwise.",
          vespaModel: "Vespa GTS",
          routeTaken: "Sand Dunes Adventure",
          date: "July 2023"
        },
        {
          name: "Sophie Laurent",
          location: "Paris, France",
          quote: "The vintage charm of Nida paired with a classic Vespa is pure magic. Their attention to detail and the pristine condition of the scooters exceeded our expectations.",
          vespaModel: "Vespa Sprint",
          routeTaken: "Fisherman's Village Tour",
          date: "September 2023"
        },
        {
          name: "Marco Rossi",
          location: "Rome, Italy",
          quote: "As an Italian who appreciates authentic Vespa experiences, I was thoroughly impressed. The scooters were in perfect condition, and the recommended routes showcased the best of Nida's natural beauty.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Custom Route",
          date: "June 2023"
        },
        {
          name: "Emma Johnson",
          location: "London, UK",
          quote: "A perfect way to experience the Curonian Spit. The Vespa was comfortable for both of us, and we enjoyed the freedom to stop whenever we spotted something beautiful - which was often!",
          vespaModel: "Vespa GTS",
          routeTaken: "Coastal Lighthouse Route",
          date: "August 2023"
        }
      ]
    },

   booking: {
  startBooking: "Start Your Reservation",
  showForm: "Start Reservation",
  hideForm: "Hide Form",
  bookingShort: "Reservation", 
  title: "Book Your Vespa Adventure",
  subtitle: "Reservation",
  description: "Ready to explore Nida in style? Complete the booking form below to reserve your Vespa for an unforgettable journey.",
  errorMessage: "There was an error submitting your booking. Please try again or contact us directly.",
  assistance: "Need assistance with your booking? Contact us directly at",
  comingSoon: "Coming Soon",
  notify: {
    title: "Get Notified When Available",
    description: "We'll let you know as soon as our new Vespa GTS scooters are available for rental.",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+370 XXX XXXXX",
    cancel: "Cancel",
    submit: "Notify Me",
    success: "Thanks! We'll notify you when this model becomes available.",
    notifyMe: "Notify Me"
  },
  steps: {
    vespa: {
      title: "Choose Your Vespa",
      day: "day"
    },
    details: {
      title: "Rental Details",
      rentalDate: "Rental Date",
      maxOneDayNote: "Maximum 1 day rental",
      dateWarningTitle: "Maximum 1 Day Rental",
      dateWarningText: "Unfortunately, we rent scooters for a maximum of 1 day to ensure availability for all our customers and maintain our quality service.",
      rentalDuration: "Rental Duration",
      fullDay: "Full Day",
      fullDayTime: "9:00 - 23:00",
      morningHalf: "Morning Half Day",
      morningTime: "9:00 - 15:30",
      eveningHalf: "Evening Half Day",
      eveningTime: "16:30 - 23:00",
      helmetOptions: "Helmet Options",
      helmetIncluded: "1 Helmet included",
      helmetFree: "FREE",
      secondHelmet: "2nd Helmet",
      helmetPrice: "+€10",
      route: "Preferred Route",
      selectRoute: "Select a route",
      gpsGuides: "GPS route guides available for all options",
      rentalSummary: "Rental Summary",
      additionalHelmet: "Additional Helmet",
      total: "Total",
      subtotal: "Subtotal",
      securityDeposit: "Security Deposit",
      totalPayment: "Total Payment",
      paymentDetails: "Payment Details",
      fullPaymentRequired: "• Full payment required upfront",
      depositIncluded: "• €300 security deposit included",
      depositReturned: "• Deposit returned after scooter inspection",
      paymentMethods: "• Payment methods: Card",
      depositNote: "Full payment (€{price}) + €300 deposit required. Deposit returned after scooter inspection."
    },
    personal: {
      title: "Personal Information",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      age: "Age",
      selectAge: "Select your age",
      drivingLicense: "Driving License Category",
      selectLicense: "Select your license category",
      licenseRequirements: "License Requirements",
      licenseNote: "To drive the Vespa Sprint S Elettrica 45, you need at least AM category license.",
      licenseAlternatives: "You can also drive with: A1, A2, A or B category licenses (all higher categories automatically include AM category).",
      message: "Special Requests",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email address",
      phonePlaceholder: "Enter your phone number",
      messagePlaceholder: "Any special requirements or questions?",
      phoneNote: "We may contact you regarding your booking",
      summary: "Booking Summary",
      model: "Vespa Model",
      duration: "Duration",
      date: "Date",
      age: "Age",
      license: "License",
      notSelected: "Not selected",
      subtotal: "Subtotal",
      securityDeposit: "Security Deposit",
      totalPayment: "Total Payment",
      importantNotes: "Important Notes",
      helmetNote: "1 helmet included, 2nd helmet +€10",
      paymentNote: "Full payment required upfront",
      depositNote: "€300 deposit returned after inspection",
      maxDayNote: "Maximum 1 day rental policy",
      termsAgreement: "I agree to the",
      termsLink: "Terms of Service",
      and: "and acknowledge the",
      privacyLink: "Privacy Policy"
    },
    continue: "Continue",
    continueDates: "Continue to Dates",
    back: "Back",
    processing: "Processing...",
    complete: "Complete Booking"
  },
  success: {
    title: "Booking Request Received!",
    message: "Thank you for your reservation request. We will contact you shortly to confirm your booking details and provide payment instructions.",
    emailSent: "A confirmation email has been sent to your email address. If you don't receive it within a few minutes, please check your spam folder.",
    newBooking: "Make Another Booking",
    exploreRoutes: "Explore Scenic Routes"
  },
  info: {
    hours: {
      title: "Rental Hours",
      text: "Full Day: 9:00-23:00\nHalf Day: 9:00-15:30 or 16:30-23:00\nMaximum 1 day rental policy"
    },
    payment: {
      title: "Payment Policy",
      text: "Full payment upfront + €300 deposit (returned after inspection)."
    },
    license: {
      title: "License Requirements",
      text: "Minimum age 21. Valid driving license required (AM, A1, A2, A, or B category)."
    }
  },
  models: {
    sprint: {
      name: "Vespa Elettrica 45",
      color: "Pearl White",
      power: "3.1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Eco-friendly city rides"
    },
    sprint2: {
      name: "Vespa Elettrica 45",
      color: "Sage Green",
      power: "3.1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Sustainable touring"
    },
    sprint3: {
      name: "Vespa Elettrica 45",
      color: "Sand Beige",
      power: "3.1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Silent exploration"
    }
  },
  routes: {
    none: "No specific route (self-guided)",
    coastal: "Coastal Lighthouse Route (12 km)",
    dunes: "Sand Dunes Adventure (18 km)",
    village: "Fisherman's Village Tour (8 km)",
    custom: "Custom route (describe in message)"
  }
},
documents: {
  title: "Document Review",
  description: "Please read and confirm these documents",
  readDocument: "Read Document", 
  accept: "I Agree",
  rental: {
    title: "Rental Agreement"
  },
  handover: {
    title: "Handover Agreement"
  },
  safety: {
    title: "Safety and Responsibility Rules"
  }
},
signature: {
  title: "Digital Signature",
  instruction: "Please sign in the field below",
  clear: "Clear",
  completed: "Signature Added"
},

    footer: {
    newsletter: {
      title: "Join Our Newsletter",
      description: "Get exclusive offers and updates about Nida's scenic routes",
      placeholder: "Your email address",
      button: "Subscribe",
      success: "Thank you for subscribing!"
    },
    description: "Luxury Vespa scooter rentals in Nida, Lithuania. Experience the natural beauty of the Curonian Spit in style and freedom.",
    descriptionTrademark: "Vespa Nida is an independent rental service, not affiliated with or endorsed by Piaggio & Co S.p.A. or Vespa brand.",
    quickLinks: "Quick Links",
    information: "Information",
    contactUs: "Contact Us",
    chooseLanguage: "Languages",
    yearsInBusiness: "Years in Business",
    established: "Established 2025",
    backToTop: "Back to top",
    rights: "All rights reserved.",
    slogan: "\"Crafted with elegance for authentic rides.\"",
    links: {
      faq: "FAQ",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      rental: "Rental Agreement",
      careers: "Careers",
      blog: "Blog"
    },
    badges: {
      secure: "Secure Payments",
      insured: "Insured Rentals"
    },
    contact: {
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Hours",
      weekdays: "Mon-Fri: 9am - 6pm",
      weekends: "Sat-Sun: 10am - 4pm"
    },
    viewOnMap: "View on Google Maps"
  },

  cookies: {
  title: "Cookies",
  description: "We use cookies to improve your browsing experience, analyze traffic, and provide personalized content.",
  readPolicy: "Read cookie policy",
  readPrivacy: "Privacy policy",
  acceptNecessary: "Necessary only",
  customize: "Customize",
  acceptAll: "Accept all",
  cancel: "Cancel",
  savePreferences: "Save preferences",
  necessary: {
    title: "Necessary cookies",
    description: "These cookies are essential for the website to function and cannot be disabled."
  },
  analytics: {
    title: "Analytics cookies",
    description: "Help us understand how visitors use the website."
  },
  marketing: {
    title: "Marketing cookies",
    description: "Used to display personalized advertising."
  },
  preferences: {
    title: "Preference cookies",
    description: "Save your choices, such as language."
  }
},

  faq: {
  title: "Frequently Asked Questions",
  subtitle: "FAQ",
  description: "Find answers to the most common questions about our Vespa rentals in Nida, Lithuania.",
  categories: {
    all: "All Questions",
    booking: "Booking",
    requirements: "Requirements",
    rental: "Rental Details",
    safety: "Safety"
  },
  questions: {
    q1: "How do I book a Vespa scooter in Nida?",
    q2: "What happens if I need to cancel my Vespa rental booking?",
    q3: "What documents do I need to rent a Vespa in Lithuania?",
    q4: "Is there an age requirement for renting a Vespa in Nida?",
    q5: "Do you provide helmets and safety equipment in Nida?",
    q6: "How much is the security deposit for Vespa rental?",
    q7: "Do I need prior experience to ride a Vespa in Nida?",
    q8: "What happens if the Vespa gets damaged during my rental in Nida?"
  },
  answers: {
    a1: "You can easily book a Vespa scooter rental in Nida, Lithuania through our online booking system on this website, by phone at +3706 795 6380, or by email at info@vespanida.lt. Located in the heart of the Curonian Spit, we serve the entire Nida area and recommend booking in advance, especially during the Baltic summer season (June-August).",
    a2: "For Vespa rental cancellations in Nida made at least 48 hours before the scheduled pickup time, you'll receive a full refund. For cancellations made within 48 hours, a 25% cancellation fee applies. No-shows or cancellations on the rental day are non-refundable. This policy ensures fair availability for all visitors to Nida.",
    a3: "To rent a Vespa in Nida, Lithuania, you'll need: a valid driver's license (category AM, A1, A2, A, or B), a valid ID or passport, and a credit card for the security deposit. International visitors to Lithuania need an International Driving Permit along with their original license if it's not in Latin characters.",
    a4: "Yes, the minimum age to rent our Vespas in Nida is 21 years old, and you must have held a valid driver's license for at least 1 year. This age requirement ensures safe exploration of the Curonian Spit's scenic routes.",
    a5: "Yes, we provide DOT-certified helmets for the driver and passenger at no extra charge for all Vespa rentals in Nida. We also offer optional reflective vests and gloves for rent, ensuring your safety while exploring Lithuania's beautiful coastline.",
    a6: "The security deposit for Vespa rental in Nida is €300€ and will be pre-authorized on your credit card at pickup. This amount is fully refunded upon return of the Vespa in its original condition. This is standard practice for premium scooter rentals in Lithuania.",
    a7: "No prior experience is necessary to rent a Vespa in Nida, but we offer a brief orientation and handling tips before you explore the Curonian Spit. If you've never operated a scooter before, we recommend taking a few minutes to practice in our designated area before heading out to discover Nida's attractions.",
    a8: "Any damage to your Vespa rental in Nida beyond normal wear and tear will be assessed and may be covered by the security deposit. We recommend taking photos of the scooter before departure."
  },
  stillHaveQuestions: "Still Have Questions?",
  contactPrompt: "If you didn't find the answer you were looking for, please don't hesitate to contact our team directly."
},

rights: {
  title: "Your Rights",
  subtitle: "EU Consumer Protection", 
  description: "Understand your consumer rights and protections when booking with Vespa Nida.",
  needHelp: "Need Help with Your Rights?",
  contactPrompt: "If you need assistance with exercising your consumer rights, our team is here to help you.",
  
  categories: {
    all: "All Rights",
    cancellation: "Cancellation",
    refund: "Refunds", 
    weather: "Weather",
    privacy: "Privacy",
    complaint: "Complaints",
    insurance: "Insurance"
  },
  
  questions: {
    q1: "What are my cancellation rights when booking a Vespa rental?",
    q2: "How does the refund process work for Vespa rentals?",
    q3: "What are my rights if weather conditions prevent my Vespa rental?",
    q4: "What are my data privacy rights when booking a Vespa rental?",
    q5: "How can I file a complaint about my Vespa rental experience?",
    q6: "What insurance coverage do I have when renting a Vespa?"
  },
  
  answers: {
    a1: "Under EU consumer protection laws, you have the right to cancel your Vespa rental booking up to 48 hours before the scheduled pickup time for a full refund. For cancellations made within 48 hours, a 25% service fee applies. This ensures fair availability for all customers while protecting your consumer rights.",
    a2: "Under EU Payment Services Directive, you are entitled to a full refund for qualifying cancellations within 5-7 business days. Refunds are processed back to your original payment method. For weather-related cancellations on the rental day, we offer full refunds or free rescheduling as per EU consumer protection standards.",
    a3: "Under EU consumer protection laws, if severe weather conditions (heavy rain, strong winds, or storms) make Vespa operation unsafe, you have the right to a full refund or free rescheduling. We monitor weather conditions and will proactively contact you if conditions are deemed unsafe for scooter operation in the Curonian Spit area.",
    a4: "Under GDPR, you have complete control over your personal data. You can request access to your data, request corrections, or request deletion at any time. We only collect necessary information for your booking and safety, and we never share your data with third parties without your explicit consent. Your data is stored securely and deleted according to legal requirements.",
    a5: "You have the right to file complaints through multiple channels: directly with us at info@vespanida.lt, through the Lithuanian State Consumer Rights Protection Authority, or through the European Consumer Centre network. We are committed to resolving any issues quickly and fairly. For EU residents, you also have access to the Online Dispute Resolution platform for e-commerce disputes.",
    a6: "All our Vespa rentals include comprehensive insurance coverage as required by Lithuanian law. This includes third-party liability insurance and damage coverage. You have the right to see insurance documents before rental and receive a copy. Additional coverage options are available for extra protection. In case of an accident, we provide full support with insurance claims and authorities."
  },
  
  badges: {
    b1: "48H FREE",
    b2: "FULL REFUND", 
    b3: "WEATHER PROTECTED",
    b4: "GDPR PROTECTED",
    b5: "COMPLAINT RIGHTS",
    b6: "INSURED"
  }
}

    // Add more translations as needed
  },
  lt: {
    nav: {
      home: 'Pradžia',
      about: 'Apie mus',
      fleet: 'Parkas',
      explore: 'Tyrinėti',
      shop: 'Parduotuvė',
      contact: 'Kontaktai'
    },
    buttons: {
      bookNow: 'Rezervuoti',
      reserveNow: 'Užsisakyti',
      subscribe: 'Prenumeruoti',
      bookYourRide: 'Rezervuokite kelionę'
    },
    // New hero section translations
    hero: {
        viewFAQ: "DUK",
      tagline: "Aukščiausios kokybės Vespa nuoma Nidoje",
      slogans: {
        first: "Elegancija judesyje",
        second: "Autentiški pasivažinėjimai. Amžinas stilius.",
        third: "Keliauk po Nidą. Gyvenk Vespa."
      },
      description: "Patirkite Nidos gamtos grožį su mūsų prabangiais Vespa motoroleriais. Keliaukite Baltijos pakrante stilingai ir laisvai.",
      exploreFleet: "Mūsų parkas",
      contactUs: "Susisiekite",
      scrollToExplore: "Slinkite žemyn",
      imageAlt: "Vespa motoroleris vaizdingiame Nidos kelyje"
    },

    calendar: {
  months: {
    january: 'Sausis',
    february: 'Vasaris',
    march: 'Kovas',
    april: 'Balandis',
    may: 'Gegužė',
    june: 'Birželis',
    july: 'Liepa',
    august: 'Rugpjūtis',
    september: 'Rugsėjis',
    october: 'Spalis',
    november: 'Lapkritis',
    december: 'Gruodis'
  },
  days: {
    sunday: 'Sek',
    monday: 'Pir',
    tuesday: 'Ant',
    wednesday: 'Tre',
    thursday: 'Ket',
    friday: 'Pen',
    saturday: 'Šeš'
  },
  availableScooters: 'Prieinami skuteriai',
  units: 'vnt.',
  legend: {
    bothAvailable: 'Laisvi abu skuteriai',
    oneAvailable: 'Laisvas 1 skuteris',
    allBooked: 'Visi skuteriai užimti'
  },
  status: {
    label: 'Būsena',
    pending: 'Laukia patvirtinimo',
    confirmed: 'Patvirtinta',
    completed: 'Baigta',
    cancelled: 'Atšaukta'
  },
  bookingDetails: 'Užsakymo detalės',
  bookingNumber: 'Užsakymo nr.',
  customer: 'Klientas',
  email: 'El. paštas',
  phone: 'Telefonas',
  vespa: 'Vespa',
  amount: 'Suma',
  confirm: 'Patvirtinti',
  cancel: 'Atšaukti',
  markCompleted: 'Pažymėti kaip baigtą',
  deleteBooking: 'Ištrinti užsakymą',
  close: 'Uždaryti',
  bookingUpdated: 'Užsakymas sėkmingai atnaujintas!',
  bookingDeleted: 'Užsakymas sėkmingai ištrintas!',
  confirmDelete: 'Ar tikrai norite ištrinti šį užsakymą?',
  updateError: 'Klaida atnaujinant užsakymą: ',
  deleteError: 'Klaida trinant užsakymą: '
},
    about: {
      title: "Apie Vespa Nida",
      subtitle: "Mūsų istorija",
      paragraph1: "Vespa Nida siūlo aukščiausios kokybės motorolerių nuomos patirtį gražiausio Lietuvos pajūrio miestelio širdyje. Mūsų misija – suteikti lankytojams stilingą, patogų ir ekologišką būdą tyrinėti gamtos stebuklus Kuršių nerijoje.",
      paragraph2: "Įkurta vietinių entuziastų, besidominčių itališku dizainu ir Baltijos kraštovaizdžiais, mes prižiūrime kruopščiai prižiūrėtą Vespa motorolerių parką, kuris derina klasikinę estetiką su šiuolaikinėmis technologijomis.",
      features: {
        premium: {
          title: "Aukščiausios kokybės parkas",
          description: "Kruopščiai prižiūrimi Vespa motoroleriai nepriekaištingos būklės"
        },
        expertise: {
          title: "Vietinė patirtis",
          description: "Nidos paslėptų perlų ir vaizdingų maršrutų žinios iš vietinių"
        },
        service: {
          title: "Sklandus aptarnavimas",
          description: "Paprastas užsakymas, pristatymas ir pagalba visos kelionės metu"
        }
      },
      quote: "\"Ne tik motoroleris. Tai – pareiškimas.\"",
      since: "Nuo",
      imageAlt: "Klasikinis Vespa motoroleris prie jūros",
      showContent: "Apie mus",
      hideContent: "Slėpti detales"
    },

    rights: {
  title: "Jūsų teisės (ES įstatymai)",
  subtitle: "Vartotojų apsaugos",
  description: "Kaip Europos Sąjungos vartotojas, jūs esate apsaugotas visapusiškų įstatymų, kurie užtikrina sąžiningas ir skaidrias nuomos paslaugas.",
  cancellation: {
    title: "14 dienų atšaukimo teisė",
    description: "Galite atšaukti rezervaciją per 14 dienų be papildomų mokesčių",
    badge: "ES apsauga"
  },
  refund: {
    title: "Greito grąžinimo garantija",
    description: "Atšaukimo atveju, grąžinsime visą sumą per 7 darbo dienas",
    badge: "Maks. 7 d."
  },
  weather: {
    title: "Oro sąlygų apsauga",
    description: "Siūlome datos keitimą arba pilną pinigų grąžinimą dėl oro sąlygų",
    badge: "Lankstumas"
  },
  privacy: {
    title: "BDAR duomenų apsauga",
    description: "Jūsų asmeniniai duomenys apsaugoti pagal BDAR reglamentą",
    badge: "Saugumas"
  },
  footer: {
    title: "Klausimai apie jūsų teises?",
    description: "Mūsų klientų aptarnavimo komanda padės jums suprasti ir įgyvendinti vartotojų teises."
  }
},

     fleet: {
  title: "Mūsų Vespa parkas",
  subtitle: "Susipažinkite su mūsų kolekcija",
  description: "Rinkitės iš mūsų kruopščiai atrinktų aukščiausios klasės Vespa motorolerių, kurie prižiūrimi pagal aukščiausius standartus ir paruošti jūsų nuotykiams Nidoje.",
  features: "Savybės",
  customRental: "Reikia individualios nuomos ar turite specialių pageidavimų?",
  contactTeam: "Susisiekite su mūsų komanda",
  buttons: {
    reserveNow: "Rezervuoti dabar",
    details: "Detalės",
    nameLabel: "Jūsų vardas pavardė",
    namePlaceholder: "Vardenis Pavardenis",
    comingSoon: "Netrukus",
    notifyWhenAvailable: "Pranešti Man",
    notifyTitle: "Gaukite pranešimą kai bus prieinama",
    notifyDescription: "Mes jums pranešime kai tik naujieji Vespa GTS motoroleriai bus prieinami nuomai.",
    emailLabel: "El. pašto adresas",
    emailPlaceholder: "jūsų@paštas.lt",
    phoneLabel: "Telefono numeris",
    phonePlaceholder: "+370 XXX XXXXX",
    cancel: "Atšaukti",
    notifySubmit: "Pranešti Man",
    notifySuccess: "Ačiū! Mes jums pranešime, kai šis modelis taps prieinamas.",
    moreInfo: "Daugiau Informacijos"
  },
  items: {
    sprint: {
      name: "Vespa Elettrica 45",
      color: "Dramblio kaulo",
      description: "Klasikinis itališkas stilius su šiuolaikiniu komfortu. Tobulas pasirinkimas pakrantės kelionėms.",
      specs: "3.1 kW | Elektrinė | 2 keleiviai",
      features: [
        "Ekonomiškas variklis", 
        "Priekiniai diskiniai stabdžiai", 
        "Apsaugos nuo vagystės sistema", 
        "Daiktadėžė po sėdyne"
      ]
    },
    sprint2: {
      name: "Vespa Elettrica 45",
      color: "Šalavijo žalia",
      description: "Galingas našumas su amžinu elegantišumu. Idealus ilgesnėms kelionėms.",
      specs: "3.1 kW | Elektrinė | 2 keleiviai",
      features: [
        "Apsaugos nuo vagystės sistema", 
        "ABS stabdžių sistema", 
        "Skaitmeninis prietaisų skydelis", 
        "Talpi daiktadėžė"
      ]
    },
    sprint3: {
      name: "Vespa Elettrica 45",
      color: "Smėlio",
      description: "Vikrus valdymas su rafinuota estetika. Puikiai tinka siaurų gatvelių tyrinėjimui.",
      specs: "3.1 kW | Elektrinė | 2 keleiviai",
      features: [
        "Lengvas manevringumas", 
        "LED apšvietimas", 
        "Apsaugos nuo vagystės sistema", 
        "Patogi sėdynė"
      ]
    }
  }
    },
     explore: {
      title: "Tyrinėkite Nidą",
      subtitle: "Kruopščiai parengti maršrutai",
      description: "Atraskite Kuršių nerijos gamtos grožį ir kultūros paveldą su mūsų ekspertų parengtais vaizdiniais maršrutais. Kiekviena kelionė siūlo unikalų Nidos kvapą gniaužiančių kraštovaizdžių ir paslėptų brangakmenių perspektyvą.",
      viewRoutes: "Tyrinėti maršrutus",
      hideRoutes: "Slėpti maršrutus",
      showMore: "Rodyti daugiau",
      showLess: "Rodyti mažiau",
      routeHighlights: "Maršruto ypatybės",
      terrain: "Vietovė",
      viewDetails: "Žiūrėti detales",
      viewAllRoutes: "Peržiūrėti visus maršrutus",
      customRoutesAvailable: "Individualūs maršrutai galimi pagal pageidavimą",
      tipForExplorers: "Patarimas keliautojams",
      tipDescription: "Visi maršrutai prasideda nuo mūsų centro. GPS gidai siūlomi pagal pageidavimą savarankiškiems turams.",
      mapAlt: "Nidos vaizdinių maršrutų žemėlapis",
      difficultyLevel: "Sudėtingumo lygis",
      difficulty: {
        easy: "Lengvas",
        moderate: "Vidutinis",
        hard: "Sudėtingas"
      },
      routes: {
        coastal: {
          title: "Pajūrio švyturio maršrutas",
          distance: "12 km",
          duration: "45 min",
          difficulty: "Lengvas",
          description: "Sekite vaizdingas pajūrio kelius į įkonišką Nidos švyturį, siūlantį panoraminius Baltijos jūros ir Kuršių marių vaizdus.",
          highlights: [
            "Panoraminiai jūros vaizdai",
            "Istorinis švyturys",
            "Smėlėti paplūdimiai",
            "Pakrantės gyvūnija"
          ],
          terrain: "Asfaltuoti keliai, lygi vietovė"
        },
        dunes: {
          title: "Kopų nuotykis",
          distance: "18 km",
          duration: "1 valanda",
          difficulty: "Vidutinis",
          description: "Vingiuokite per pušų miškus, kad pasiektumėte garsųją Parnidžio kopą, antrą aukščiausią judančią smėlio kopą Europoje. Tobula saulėlydžio vaizdams.",
          highlights: [
            "Aukštos smėlio kopos",
            "Miško takeliai",
            "Saulės laikrodžio paminklas",
            "Saulėlydžio vaizdai"
          ],
          terrain: "Mišri vietovė, kai kurie nuolydžiai"
        },
        fisherman: {
          title: "Žvejų kaimo turas",
          distance: "8 km",
          duration: "30 min",
          difficulty: "Lengvas",
          description: "Atraskite autentišką tradicinių Lietuvos žvejų kaimų žavesį su spalvingais mediniais namais ir turtinga jūrų istorija.",
          highlights: [
            "Spalvingi namai",
            "Vietiniai amatai",
            "Žvejybos uostas",
            "Tradicinė architektūra"
          ],
          terrain: "Asfaltuoti keliai, lygi vietovė"
        }
      }
    },

    shop: {
      title: "Vespa dalys ir aksesuarai",
      subtitle: "Parduotuvės kolekcija",
      description: "Atraskite mūsų kruopščiai atrinktą originalių Vespa dalių, aksesuarų ir gyvenimo būdo prekių kolekciją. Kiekviena detalė kruopščiai parinkta, kad pagerintų jūsų Vespa patirtį.",
      viewProducts: "Žiūrėti prekes",
      hideProducts: "Slėpti prekes",
      visitOnlineShop: "Apsilankyti internetinėje parduotuvėje",
      categories: {
        safety: "Saugumas",
        accessories: "Aksesuarai",
        parts: "Dalys",
        lifestyle: "Gyvenimo būdas"
      },
      products: {
        helmet: {
          name: "Vintažinis Vespa šalmas",
          price: "€89"
        },
        seat: {
          name: "Odinis sėdynės apdangalas",
          price: "€129"
        },
        mirrors: {
          name: "Chrominių veidrodėlių rinkinys",
          price: "€75"
        },
        map: {
          name: "Nidos žemėlapis ir gidas",
          price: "€19"
        }
      }
    },

    testimonials: {
      title: "Ką sako mūsų klientai",
      subtitle: "Atsiliepimai",
      description: "Išgirskite iš keliautojų, kurie patyrė džiaugsmą tyrinėdami Nidą su mūsų aukščiausios klasės Vespa motoroleriais.",
      viewReviews: "Peržiūrėti atsiliepimus",
      hideReviews: "Slėpti atsiliepimus",
      showDetails: "Rodyti detales",
      showLess: "Rodyti mažiau",
      vespaModel: "Vespa modelis",
      routeTaken: "Pasirinktas maršrutas",
      visitDate: "Apsilankymo data",
      autoAdvancing: "Automatinis keitimas",
      pauseAutoplay: "Pristabdyti automatinį keitimą",
      startAutoplay: "Pradėti automatinį keitimą",
      prevButton: "Ankstesnis atsiliepimas",
      nextButton: "Kitas atsiliepimas",
      goToReview: "Eiti į atsiliepimą",
      enjoyed: "Patiko jūsų patirtis su Vespa Nida?",
      shareYours: "Pasidalinkite savo atsiliepimu",
      items: [
        {
          name: "Julija Kovalenko",
          location: "Vilnius, Lietuva",
          quote: "Nidos tyrinėjimas su Vespa buvo mūsų vasaros kelionės akcentas. Vespa Nida komanda suteikė nepriekaištingą aptarnavimą nuo užsakymo iki grąžinimo.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Pajūrio švyturio maršrutas",
          date: "2023 m. rugpjūtis"
        },
        {
          name: "Thomas Müller",
          location: "Berlynas, Vokietija",
          quote: "Laisvė keliauti palei kopas šiais stilingais Vespa motoroleriais padarė mūsų jubiliejinę kelionę nepamirštamą. Mes atradome paslėptus paplūdimius, kurių kitaip nebūtume radę.",
          vespaModel: "Vespa GTS",
          routeTaken: "Kopų nuotykis",
          date: "2023 m. liepa"
        },
        {
          name: "Sophie Laurent",
          location: "Paryžius, Prancūzija",
          quote: "Vintažinis Nidos žavesys kartu su klasikiniu Vespa yra tikra magija. Jų dėmesys detalėms ir nepriekaištinga motorolerių būklė viršijo mūsų lūkesčius.",
          vespaModel: "Vespa Sprint",
          routeTaken: "Žvejų kaimo turas",
          date: "2023 m. rugsėjis"
        },
        {
          name: "Marco Rossi",
          location: "Roma, Italija",
          quote: "Kaip italas, vertinantis autentiškas Vespa patirtis, buvau labai sužavėtas. Motoroleriai buvo tobulos būklės, o rekomenduojami maršrutai parodė geriausius Nidos gamtos grožius.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Individualus maršrutas",
          date: "2023 m. birželis"
        },
        {
          name: "Emma Johnson",
          location: "Londonas, JK",
          quote: "Puikus būdas patirti Kuršių neriją. Vespa buvo patogi mums abiem, ir mums patiko laisvė sustoti, kai tik pamatėme ką nors gražaus - o tai buvo dažnai!",
          vespaModel: "Vespa GTS",
          routeTaken: "Pajūrio švyturio maršrutas",
          date: "2023 m. rugpjūtis"
        }
      ]
    },

    booking: {
  startBooking: "Pradėti Rezervaciją",
  showForm: "Pradėti Rezervaciją",
  hideForm: "Slėpti Formą",
  bookingShort: "Rezervacijos", 
  title: "Rezervuokite savo Vespa nuotykį",
  subtitle: "Rezervacija",
  description: "Pasiruošę tyrinėti Nidą stilingai? Užpildykite žemiau esančią rezervacijos formą, kad užsisakytumėte Vespa nepamirštamai kelionei.",
  errorMessage: "Įvyko klaida pateikiant jūsų užsakymą. Bandykite dar kartą arba susisiekite su mumis tiesiogiai.",
  assistance: "Reikia pagalbos dėl rezervacijos? Susisiekite su mumis tiesiogiai",
  comingSoon: "Netrukus",
  notify: {
    title: "Gaukite pranešimą kai bus prieinama",
    description: "Mes jums pranešime kai tik naujieji Vespa GTS motoroleriai bus prieinami nuomai.",
    emailLabel: "El. pašto adresas",
    emailPlaceholder: "jūsų@paštas.lt",
    nameLabel: "Vardas",
    namePlaceholder: "Jūsų pilnas vardas",
    phoneLabel: "Telefono numeris",
    phonePlaceholder: "+370 XXX XXXXX",
    cancel: "Atšaukti",
    submit: "Pranešti Man",
    success: "Ačiū! Mes jums pranešime, kai šis modelis taps prieinamas.",
    notifyMe: "Pranešti Man"
  },
  steps: {
    vespa: {
      title: "Pasirinkite savo Vespa",
      day: "diena"
    },
    details: {
      title: "Nuomos detalės",
      rentalDate: "Nuomos data",
      maxOneDayNote: "Maksimaliai 1 dienos nuoma",
      dateWarningTitle: "Maksimaliai 1 Dienos Nuoma",
      dateWarningText: "Deja, mes nuomojame motorolerius maksimaliai 1 dienai, kad užtikrintume prieinamumą visiems klientams ir išlaikytume aukštą paslaugų kokybę.",
      rentalDuration: "Nuomos trukmė",
      fullDay: "Visa diena",
      fullDayTime: "9:00 - 23:00",
      morningHalf: "Rytinė pusė dienos",
      morningTime: "9:00 - 15:30",
      eveningHalf: "Vakarinė pusė dienos",
      eveningTime: "16:30 - 23:00",
      helmetOptions: "Šalmų variantai",
      helmetIncluded: "1 šalmas įskaičiuotas",
      helmetFree: "NEMOKAMAS",
      secondHelmet: "2-as šalmas",
      helmetPrice: "+10€",
      route: "Pageidaujamas maršrutas",
      selectRoute: "Pasirinkite maršrutą",
      gpsGuides: "GPS maršrutų gidai galimi visiems variantams",
      rentalSummary: "Nuomos suvestinė",
      additionalHelmet: "Papildomas šalmas",
      total: "Iš viso",
      subtotal: "Tarpinė suma",
      securityDeposit: "Užstatas",
      totalPayment: "Bendras mokėjimas",
      paymentDetails: "Mokėjimo detalės",
      fullPaymentRequired: "• Reikalingas pilnas mokėjimas iš anksto",
      depositIncluded: "• 300€ užstatas įtrauktas",
      depositReturned: "• Užstatas grąžinamas po skūterio patikros",
      paymentMethods: "• Mokėjimo būdai: internetu",
      depositNote: "Pilnas mokėjimas ({price}€) + 300€ užstatas reikalingas. Užstatas grąžinamas po skūterio patikros."
    },
    personal: {
      title: "Asmeninė informacija",
      name: "Pilnas vardas",
      email: "El. pašto adresas",
      phone: "Telefono numeris",
      age: "Amžius",
      selectAge: "Pasirinkite savo amžių",
      drivingLicense: "Vairuotojo pažymėjimo kategorija",
      selectLicense: "Pasirinkite savo pažymėjimo kategoriją",
      licenseRequirements: "Pažymėjimo reikalavimai",
      licenseNote: "Norint vairuoti Vespa Sprint S Elettrica 45, pakanka turėti AM kategorijos teises.",
      licenseAlternatives: "Taip pat galima vairuoti su: A1, A2, A arba B kategorijos teisėmis (visos aukštesnės kategorijos automatiškai apima ir AM kategoriją).",
      message: "Specialūs pageidavimai",
      namePlaceholder: "Įveskite savo pilną vardą",
      emailPlaceholder: "Įveskite savo el. pašto adresą",
      phonePlaceholder: "Įveskite savo telefono numerį",
      messagePlaceholder: "Bet kokie specialūs reikalavimai ar klausimai?",
      phoneNote: "Galime susisiekti su jumis dėl jūsų rezervacijos",
      summary: "Rezervacijos santrauka",
      model: "Vespa modelis",
      duration: "Trukmė",
      date: "Data",
      age: "Amžius",
      license: "Pažymėjimas",
      notSelected: "Nepasirinkta",
      subtotal: "Tarpinė suma",
      securityDeposit: "Užstatas",
      totalPayment: "Bendras mokėjimas",
      importantNotes: "Svarbūs pastebėjimai",
      helmetNote: "1 šalmas įskaičiuotas, 2-as šalmas +10€",
      paymentNote: "Reikalingas pilnas mokėjimas iš anksto",
      depositNote: "300€ užstatas grąžinamas po patikros",
      maxDayNote: "Maksimaliai 1 dienos nuomos politika",
      termsAgreement: "Sutinku su",
      termsLink: "Paslaugų teikimo sąlygomis",
      and: "ir pripažįstu",
      privacyLink: "Privatumo politiką"
    },
    continue: "Tęsti",
    continueDates: "Tęsti prie datų",
    back: "Atgal",
    processing: "Apdorojama...",
    complete: "Užbaigti rezervaciją"
  },
  success: {
    title: "Rezervacijos užklausa gauta!",
    message: "Dėkojame už jūsų rezervacijos užklausą. Netrukus susisieksime su jumis, kad patvirtintume jūsų rezervacijos detales ir pateiktume mokėjimo instrukcijas.",
    emailSent: "Patvirtinimo laiškas buvo išsiųstas jūsų el. pašto adresu. Jei jo negausite per kelias minutes, patikrinkite savo šlamšto aplanką.",
    newBooking: "Atlikti kitą rezervaciją",
    exploreRoutes: "Tyrinėti maršrutus"
  },
  info: {
    hours: {
      title: "Nuomos valandos",
      text: "Visa diena: 9:00-23:00\nPusė dienos: 9:00-15:30 arba 16:30-23:00\nMaksimaliai 1 dienos nuomos politika"
    },
    payment: {
      title: "Mokėjimo politika",
      text: "Pilnas mokėjimas iš anksto + 300€ užstatas (grąžinamas po patikros)."
    },
    license: {
      title: "Pažymėjimo reikalavimai",
      text: "Minimalus amžius 21 metai. Reikalingas galiojantis vairuotojo pažymėjimas (AM, A1, A2, A arba B kategorija)."
    }
  },
  models: {
    sprint: {
      name: "Vespa Elettrica 45",
      color: "Perlo baltumo",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Ekologiškiems miesto važinėjimams"
    },
    sprint2: {
      name: "Vespa Elettrica 45",
      color: "Šalavijo žalia",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Tvariam turizmui"
    },
    sprint3: {
      name: "Vespa Elettrica 45",
      color: "Smėlio spalvos",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Tyliam tyrinėjimui"
    }
  },
  routes: {
    none: "Jokio konkretaus maršruto (savarankiškai)",
    coastal: "Pakrantės švyturio maršrutas (12 km)",
    dunes: "Kopų nuotykių maršrutas (18 km)",
    village: "Žvejų kaimo turas (8 km)",
    custom: "Individualus maršrutas (aprašykite žinutėje)"
  }
},
documents: {
  title: "Dokumentų peržiūra",
  description: "Prašome perskaityti ir patvirtinti šiuos dokumentus",
  readDocument: "Skaityti dokumentą",
  accept: "Sutinku",
  rental: {
    title: "Nuomos sutartis"
  },
  handover: {
    title: "Perdavimo sutartis"
  },
  safety: {
    title: "Saugumo ir atsakomybių taisyklės"
  }
},
signature: {
  title: "Skaitmeninis parašas",
  instruction: "Prašome pasirašyti žemiau esančiame laukelyje",
  clear: "Išvalyti",
  completed: "Parašas pridėtas"
},

    footer: {
    newsletter: {
      title: "Prisijunkite prie mūsų naujienlaiškio",
      description: "Gaukite išskirtinius pasiūlymus ir naujienas apie Nidos maršrutus",
      placeholder: "Jūsų el. pašto adresas",
      button: "Prenumeruoti",
      success: "Dėkojame už prenumeratą!"
    },
    description: "Prabangių Vespa motorolerių nuoma Nidoje, Lietuvoje. Patirkite Kuršių nerijos gamtos grožį stilingai ir laisvai.",
    descriptionTrademark: "Vespa Nida yra nepriklausoma nuomos paslauga, nesusijusi su Piaggio & Co S.p.A. ar Vespa prekės ženklu ir jų nereklamuojama.",
    quickLinks: "Greitos nuorodos",
    information: "Informacija",
    contactUs: "Susisiekite su mumis",
    chooseLanguage: "Kalbos",
    yearsInBusiness: "Metai versle",
    established: "Įkurta 2025",
    backToTop: "Grįžti į viršų",
    rights: "Visos teisės saugomos.",
    slogan: "\"Sukurta elegantiškai autentiškoms kelionėms.\"",
    links: {
      faq: "DUK",
      terms: "Sąlygos ir nuostatos",
      privacy: "Privatumo politika",
      rental: "Nuomos sutartis",
      careers: "Karjera",
      blog: "Tinklaraštis"
    },
    badges: {
      secure: "Saugūs mokėjimai",
      insured: "Apdraustas nuomojimas"
    },
    contact: {
      address: "Adresas",
      phone: "Telefonas",
      email: "El. paštas",
      hours: "Darbo laikas",
      weekdays: "Pr-Pn: 9:00 - 18:00",
      weekends: "Š-S: 10:00 - 16:00"
    },
    viewOnMap: "Žiūrėti Google žemėlapiuose"
  },

  cookies: {
  title: "Slapukai (Cookies)",
  description: "Mes naudojame slapukus, kad pagerintume jūsų naršymo patirtį, analizuotume srautą ir suteiktume personalizuotą turinį.",
  readPolicy: "Skaityti slapukų politiką",
  readPrivacy: "Privatumo politika",
  acceptNecessary: "Tik būtini",
  customize: "Tinkrinti",
  acceptAll: "Priimti visus",
  cancel: "Atšaukti",
  savePreferences: "Išsaugoti nustatymus",
  necessary: {
    title: "Būtini slapukai",
    description: "Šie slapukai yra būtini svetainės veikimui ir negali būti išjungti."
  },
  analytics: {
    title: "Analitikos slapukai",
    description: "Padeda mums suprasti, kaip lankytojai naudoja svetainę."
  },
  marketing: {
    title: "Rinkodaros slapukai",
    description: "Naudojami personalizuotos reklamos rodymui."
  },
  preferences: {
    title: "Nustatymų slapukai",
    description: "Išsaugo jūsų pasirinkimus, pvz., kalbą."
  }
},

  languageSelector: {
    title: "Pasirinkite kalbą",
    subtitle: "Pasirinkite norimą kalbą, kad tęstumėte"
  },

  faq: {
  title: "Dažniausiai Užduodami Klausimai",
  subtitle: "DUK",
  description: "Raskite atsakymus į dažniausiai užduodamus klausimus apie mūsų Vespa nuomą Nidoje, Lietuvoje.",
  categories: {
    all: "Visi Klausimai",
    booking: "Rezervacija",
    requirements: "Reikalavimai",
    rental: "Nuomos Detalės",
    safety: "Saugumas"
  },
  questions: {
    q1: "Kaip užsirezervuoti Vespa motorolerį Nidoje?",
    q2: "Kas nutiks, jei man reikės atšaukti Vespa nuomos rezervaciją?",
    q3: "Kokie dokumentai reikalingi Vespa nuomai Lietuvoje?",
    q4: "Ar yra amžiaus reikalavimas Vespa nuomai Nidoje?",
    q5: "Ar teikiate šalmus ir saugos įrangą Nidoje?",
    q6: "Koks yra Vespa nuomos užstato dydis?",
    q7: "Ar man reikia ankstesnės patirties vairuoti Vespa Nidoje?",
    q8: "Kas nutiks, jei Vespa bus pažeista nuomos metu Nidoje?"
  },
  answers: {
    a1: "Vespa motorolerio nuomą Nidoje, Lietuvoje galite lengvai užsirezervuoti per mūsų internetinę rezervacijos sistemą šioje svetainėje, telefonu +3706 795 6380 arba el. paštu info@vespanida.lt. Esame Kuršių nerijos širdyje, Nidoje, iš kur ir galima nuomotis motorolerius. Rekomenduojame rezervuoti iš anksto, ypač Baltijos vasaros sezono metu (birželis-rugpjūtis).",
    a2: "Vespa nuomos atšaukimams Nidoje, atliekamiem likus mažiausiai 48 valandoms iki numatyto paėmimo laiko, gausite visą grąžinamą sumą. Atšaukimams per 48 valandas taikomas 25% atšaukimo mokestis. Neatvykusiems arba atšaukusiems nuomos dieną pinigai negrąžinami. Ši tvarka užtikrina sąžiningą prieinamumą visiems Nidos lankytojams.",
    a3: "Vespa nuomai Nidoje, Lietuvoje jums reikės: galiojančio vairuotojo pažymėjimo (AM, A1, A2, A arba B kategorijos), galiojančio asmens tapatybės dokumento ar paso ir kredito kortelės užstatui. Tarptautiniams Lietuvos lankytojams reikalingas tarptautinis vairuotojo pažymėjimas kartu su originaliu pažymėjimu, jei jis nėra lotyniškais rašmenimis.",
    a4: "Taip, minimali amžiaus riba mūsų Vespa nuomai Nidoje yra 21 metai, ir turite turėti galiojantį vairuotojo pažymėjimą bent 1 metus. Šis amžiaus reikalavimas užtikrina saugų Kuršių nerijos vaizdingų maršrutų tyrinėjimą.",
    a5: "Taip, visoms Vespa nuomoms Nidoje nemokamai suteikiame DOT sertifikuotus šalmus vairuotojui ir keleiviui. Taip pat siūlome papildomai išsinuomoti atšvaitines liemenes ir pirštines, užtikrindami jūsų saugumą tyrinėjant gražų Lietuvos pajūrį.",
    a6: "Vespa nuomos užstatas Nidoje yra 300€ ir bus iš anksto patvirtintas jūsų kreditinėje kortelėje paėmimo metu. Ši suma visiškai grąžinama grąžinus Vespa pradinės būklės. Tai įprasta praktika aukščiausios klasės motorolerių nuomai Lietuvoje.",
    a7: "Ankstesnė patirtis Vespa nuomai Nidoje nebūtina, bet mes siūlome trumpą orientaciją ir valdymo patarimus prieš tyrinėjant Kuršių neriją. Jei anksčiau niekada nevairavote motorolerio, rekomenduojame keletą minučių pasitreniruoti mūsų numatytoje vietoje prieš išvykstant atrasti Nidos patrauklumą.",
    a8: "Bet kokie jūsų Vespa nuomos Nidoje pažeidimai, viršijantys įprastą nusidėvėjimą, bus įvertinti ir gali būti padengti užstatu. Rekomenduojame prieš išvykstant nufotografuoti motorolerį. "
  },
  stillHaveQuestions: "Dar turite klausimų?",
  contactPrompt: "Jei neradote ieškomo atsakymo, nedvejodami kreipkitės tiesiogiai į mūsų komandą."
},
rights: {
  title: "Jūsų teisės",
  subtitle: "ES vartotojų apsauga", 
  description: "Sužinokite apie savo vartotojų teises ir apsaugą rezervuojant Vespa Nida paslaugas.",
  needHelp: "Reikia pagalbos su jūsų teisėmis?",
  contactPrompt: "Jei jums reikia pagalbos įgyvendinant vartotojų teises, mūsų komanda mielai jums padės.",
  
  categories: {
    all: "Visos teisės",
    cancellation: "Atšaukimas",
    refund: "Pinigų grąžinimas", 
    weather: "Oras",
    privacy: "Privatumas",
    complaint: "Skundai",
    insurance: "Draudimas"
  },
  
  questions: {
    q1: "Kokios yra mano atšaukimo teisės rezervuojant Vespa nuomą?",
    q2: "Kaip veikia pinigų grąžinimo procesas Vespa nuomai?",
    q3: "Kokios yra mano teisės, jei oro sąlygos neleidžia nuomotis Vespa?",
    q4: "Kokios yra mano duomenų privatumo teisės rezervuojant Vespa nuomą?",
    q5: "Kaip galiu pateikti skundą dėl Vespa nuomos patirties?",
    q6: "Kokį draudimo pokrytį turiu nuomodamas Vespa?"
  },
  
  answers: {
    a1: "Pagal ES vartotojų apsaugos įstatymus, turite teisę atšaukti Vespa nuomos rezervaciją iki 48 valandų iki suplanuoto paėmimo laiko ir gauti visišką pinigų grąžinimą. Atšaukimams, atliekamams per 48 valandas, taikomas 25% aptarnavimo mokestis. Tai užtikrina sąžiningą prieinamumą visiems klientams, kartu apsaugant jūsų vartotojų teises.",
    a2: "Pagal ES mokėjimo paslaugų direktyvą, turite teisę gauti visišką pinigų grąžinimą už tinkamus atšaukimus per 5-7 darbo dienas. Pinigai grąžinami į originalų mokėjimo būdą. Oro sąlygų atšaukimams nuomos dieną siūlome visišką pinigų grąžinimą arba nemokamą perkėlimą pagal ES vartotojų apsaugos standartus.",
    a3: "Pagal ES vartotojų apsaugos įstatymus, jei sunkios oro sąlygos (stiprus lietus, stiprūs vėjai ar audros) daro Vespa eksploatavimą nesaugų, turite teisę gauti visišką pinigų grąžinimą arba nemokamą perkėlimą. Mes stebime oro sąlygas ir aktyviai susisieksime su jumis, jei sąlygos bus laikomos nesaugiomis skuterio eksploatavimui Kuršių nerijos teritorijoje.",
    a4: "Pagal BDAR turite visišką kontrolę über savo asmens duomenis. Galite bet kada prašyti prieigos prie savo duomenų, prašyti pataisymų arba ištrynimo. Renkame tik būtiną informaciją jūsų rezervacijai ir saugumui, ir niekada nesidalijame jūsų duomenimis su trečiosiomis šalimis be aiškaus jūsų sutikimo. Jūsų duomenys saugomi saugiai ir ištrinami pagal teisinius reikalavimus.",
    a5: "Turite teisę pateikti skundus keliais kanalais: tiesiogiai mums info@vespanida.lt, per Lietuvos valstybinę vartotojų teisių apsaugos instituciją arba per Europos vartotojų centrų tinklą. Esame įsipareigojęę greitai ir sąžiningai spręsti bet kokius klausimus. ES gyventojams taip pat prieinama internetinė ginčų sprendimo platforma elektroninės prekybos ginčams.",
    a6: "Visos mūsų Vespa nuomos apima išsamų draudimo pokrytį, kaip reikalauja Lietuvos įstatymai. Tai apima civilinės atsakomybės draudimą ir žalos pokrytį. Turite teisę pamatyti draudimo dokumentus prieš nuomą ir gauti kopiją. Papildomo apsaugos pokryčio parinktys prieinamos už papildomą mokestį. Įvykus avarijai, teikiame visišką paramą draudimo išmokų ir institucijų srityse."
  },
  
  badges: {
    b1: "48H NEMOKAMAI",
    b2: "PILNAS GRĄŽINIMAS", 
    b3: "ORO APSAUGA",
    b4: "BDAR APSAUGA",
    b5: "SKUNDŲ TEISĖS",
    b6: "APDRAUSTAS"
  }
},
    // Add more translations
  },
  de: {
    nav: {
      home: 'Startseite',
      about: 'Über uns',
      fleet: 'Flotte',
      explore: 'Erkunden',
      shop: 'Shop',
      contact: 'Kontakt'
    },
    buttons: {
      bookNow: 'Jetzt buchen',
      reserveNow: 'Reservieren',
      subscribe: 'Abonnieren',
      bookYourRide: 'Buchen Sie Ihre Fahrt'
    },
    hero: {
        viewFAQ: "FAQs",
      tagline: "Premium Vespa-Vermietung in Nida",
      slogans: {
        first: "Eleganz in Bewegung",
        second: "Authentische Fahrten. Zeitloser Stil.",
        third: "Cruise Nida. Leben Sie Vespa."
      },
      description: "Erleben Sie die malerische Schönheit von Nida mit unseren Luxus-Vespa-Vermietungen. Cruisen Sie an der baltischen Küste mit Stil und Freiheit.",
      exploreFleet: "Entdecken Sie unsere Flotte",
      contactUs: "Kontaktiere uns",
      scrollToExplore: "Scrollen Sie zum Erkunden",
      imageAlt: "Vespa-Roller auf einer malerischen Küstenstraße in Nida"
    },
calendar: {
  months: {
    january: 'Januar',
    february: 'Februar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Dezember'
  },
  days: {
    sunday: 'So',
    monday: 'Mo',
    tuesday: 'Di',
    wednesday: 'Mi',
    thursday: 'Do',
    friday: 'Fr',
    saturday: 'Sa'
  },
  availableScooters: 'Verfügbare Roller',
  units: 'Stk.',
  legend: {
    bothAvailable: 'Beide Roller verfügbar',
    oneAvailable: '1 Roller verfügbar',
    allBooked: 'Alle Roller gebucht'
  },
  status: {
    label: 'Status',
    pending: 'Bestätigung ausstehend',
    confirmed: 'Bestätigt',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert'
  },
  bookingDetails: 'Buchungsdetails',
  bookingNumber: 'Buchungs-Nr.',
  customer: 'Kunde',
  email: 'E-Mail',
  phone: 'Telefon',
  vespa: 'Vespa',
  amount: 'Betrag',
  confirm: 'Bestätigen',
  cancel: 'Stornieren',
  markCompleted: 'Als abgeschlossen markieren',
  deleteBooking: 'Buchung löschen',
  close: 'Schließen',
  bookingUpdated: 'Buchung erfolgreich aktualisiert!',
  bookingDeleted: 'Buchung erfolgreich gelöscht!',
  confirmDelete: 'Sind Sie sicher, dass Sie diese Buchung löschen möchten?',
  updateError: 'Fehler beim Aktualisieren der Buchung: ',
  deleteError: 'Fehler beim Löschen der Buchung: '
},
    about: {
      title: "Über Vespa Nida",
      subtitle: "Unsere Geschichte",
      paragraph1: "Vespa Nida bietet ein erstklassiges Roller-Miet-Erlebnis im Herzen der schönsten Küstenstadt Litauens. Unsere Mission ist es, Besuchern eine stilvolle, bequeme und umweltfreundliche Möglichkeit zu bieten, die Naturwunder der Kurischen Nehrung zu erkunden.",
      paragraph2: "Gegründet von lokalen Enthusiasten mit einer Leidenschaft für italienisches Design und baltische Landschaften, pflegen wir eine Flotte von akribisch gewarteten Vespa-Rollern, die klassische Ästhetik mit moderner Leistung kombinieren.",
      features: {
        premium: {
          title: "Premium-Flotte",
          description: "Akribisch gewartete Vespa-Roller in makellosem Zustand"
        },
        expertise: {
          title: "Lokale Expertise",
          description: "Insider-Kenntnisse über Nidas versteckte Schätze und landschaftlich reizvolle Routen"
        },
        service: {
          title: "Nahtloser Service",
          description: "Problemlose Buchung, Lieferung und Unterstützung während Ihrer gesamten Reise"
        }
      },
      quote: "\"Nicht nur ein Roller. Eine Aussage.\"",
      since: "Seit",
      imageAlt: "Vintage Vespa-Roller am Meer",
      showContent: "Über uns",
      hideContent: "Details ausblenden"
    },

    rights: {
  title: "Ihre Rechte (EU-Gesetze)",
  subtitle: "Verbraucherschutz",
  description: "Als Verbraucher der Europäischen Union sind Sie durch umfassende Gesetze geschützt, die faire und transparente Mietdienstleistungen gewährleisten.",
  cancellation: {
    title: "14-Tage-Widerrufsrecht",
    description: "Sie können Ihre Buchung innerhalb von 14 Tagen ohne zusätzliche Gebühren stornieren",
    badge: "EU-Schutz"
  },
  refund: {
    title: "Schnelle Rückerstattungsgarantie",
    description: "Im Falle einer Stornierung erstatten wir den vollen Betrag innerhalb von 7 Werktagen",
    badge: "Max. 7 Tage"
  },
  weather: {
    title: "Wetterschutz",
    description: "Wir bieten Terminänderungen oder vollständige Rückerstattungen bei Wetterbedingungen",
    badge: "Flexibel"
  },
  privacy: {
    title: "DSGVO-Datenschutz",
    description: "Ihre persönlichen Daten sind unter DSGVO-Vorschriften geschützt",
    badge: "Sicher"
  },
  footer: {
    title: "Fragen zu Ihren Rechten?",
    description: "Unser Kundenservice-Team hilft Ihnen dabei, Ihre Verbraucherrechte zu verstehen und auszuüben."
  }
},

    fleet: {
  title: "Unsere Vespa Flotte",
  subtitle: "Entdecken Sie unsere Kollektion",
  description: "Wählen Sie aus unseren sorgfältig ausgewählten Premium-Vespa-Rollern, die nach höchsten Standards gewartet werden und bereit für Ihre Abenteuer in Nida sind.",
  features: "Merkmale",
  customRental: "Benötigen Sie eine individuelle Miete oder haben Sie besondere Anforderungen?",
  contactTeam: "Kontaktieren Sie unser Team",
  buttons: {
    reserveNow: "Jetzt Reservieren",
    details: "Details",
    comingSoon: "Demnächst",
    notifyWhenAvailable: "Benachrichtigen",
    notifyTitle: "Benachrichtigung bei Verfügbarkeit",
    notifyDescription: "Wir informieren Sie, sobald unsere neuen Vespa GTS Roller zur Miete verfügbar sind.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "ihre@email.de",
    cancel: "Abbrechen",
    nameLabel: "Ihr Name",
    namePlaceholder: "Max Mustermann",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+49 XXX XXXXXXX",
    notifySubmit: "Benachrichtigen",
    notifySuccess: "Vielen Dank! Wir werden Sie benachrichtigen, sobald dieses Modell verfügbar ist.",
    moreInfo: "Weitere Informationen"
  },
  items: {
  sprint: {
    name: "Vespa Elettrica 45",
    color: "Elfenbeinweiß",
    description: "Klassischer italienischer Stil mit modernem Komfort. Perfekte Wahl für Küstenfahrten.",
    specs: "3,1 kW | Elektrisch | 2 Passagiere",
    features: [
      "Sparsamer Motor", 
      "Vordere Scheibenbremsen", 
      "Diebstahlsicherung", 
      "Stauraum unter dem Sitz"
    ]
  },
  sprint2: {
    name: "Vespa Elettrica 45",
    color: "Salbeigrün",
    description: "Leistungsstarke Performance mit zeitloser Eleganz. Ideal für längere Fahrten.",
    specs: "3,1 kW | Elektrisch | 2 Passagiere",
    features: [
      "Diebstahlsicherung", 
      "ABS-Bremssystem", 
      "Digitales Armaturenbrett", 
      "Geräumiges Staufach"
    ]
  },
  sprint3: {
    name: "Vespa Elettrica 45",
    color: "Sandbeige",
    description: "Wendige Handhabung mit raffinierter Ästhetik. Perfekt zum Erkunden enger Straßen.",
    specs: "3,1 kW | Elektrisch | 2 Passagiere",
    features: [
      "Leichte Manövrierbarkeit", 
      "LED-Beleuchtung", 
      "Diebstahlsicherung", 
      "Komfortable Sitzposition"
    ]
  }
}
    },

    explore: {
      title: "Erkunden Sie Nida",
      subtitle: "Kuratierte Reisen",
      description: "Entdecken Sie die natürliche Schönheit und das kulturelle Erbe der Kurischen Nehrung mit unseren fachkundig gestalteten malerischen Routen. Jede Reise bietet eine einzigartige Perspektive auf Nidas atemberaubende Landschaften und versteckte Schätze.",
      viewRoutes: "Malerische Routen erkunden",
      hideRoutes: "Routen ausblenden",
      showMore: "Mehr anzeigen",
      showLess: "Weniger anzeigen",
      routeHighlights: "Routenhighlights",
      terrain: "Gelände",
      viewDetails: "Details anzeigen",
      viewAllRoutes: "Alle Routen anzeigen",
      customRoutesAvailable: "Individuelle Routen auf Anfrage verfügbar",
      tipForExplorers: "Tipp für Entdecker",
      tipDescription: "Alle Routen beginnen von unserem zentralen Standort. GPS-Guides sind auf Anfrage für selbstgeführte Touren erhältlich.",
      mapAlt: "Karte der malerischen Routen in Nida",
      difficultyLevel: "Schwierigkeitsgrad",
      difficulty: {
        easy: "Leicht",
        moderate: "Mittel",
        hard: "Schwer"
      },
      routes: {
        coastal: {
          title: "Küstenleuchtturm-Route",
          distance: "12 km",
          duration: "45 min",
          difficulty: "Leicht",
          description: "Folgen Sie der malerischen Küstenstraße zum ikonischen Leuchtturm von Nida, der einen Panoramablick auf die Ostsee und das Kurische Haff bietet.",
          highlights: [
            "Panorama-Meerblick",
            "Historischer Leuchtturm",
            "Sandstrände",
            "Küstentierwelt"
          ],
          terrain: "Befestigte Straßen, flaches Gelände"
        },
        dunes: {
          title: "Sanddünen-Abenteuer",
          distance: "18 km",
          duration: "1 Stunde",
          difficulty: "Mittel",
          description: "Schlängeln Sie sich durch Kiefernwälder zur berühmten Parnidis-Düne, der zweithöchsten Wanderdüne Europas. Perfekt für Sonnenuntergangsansichten.",
          highlights: [
            "Hohe Sanddünen",
            "Waldpfade",
            "Sonnenuhr-Monument",
            "Sonnenuntergangsblicke"
          ],
          terrain: "Gemischtes Gelände, einige Steigungen"
        },
        fisherman: {
          title: "Fischerdorf-Tour",
          distance: "8 km",
          duration: "30 min",
          difficulty: "Leicht",
          description: "Entdecken Sie den authentischen Charme traditioneller litauischer Fischerdörfer mit ihren bunten Holzhäusern und ihrer reichen Seefahrtsgeschichte.",
          highlights: [
            "Bunte Häuser",
            "Lokales Handwerk",
            "Fischereihafen",
            "Traditionelle Architektur"
          ],
          terrain: "Befestigte Straßen, flaches Gelände"
        }
      }
    },

    shop: {
      title: "Vespa Teile & Zubehör",
      subtitle: "Shop Kollektion",
      description: "Entdecken Sie unsere kuratierte Auswahl an originalen Vespa-Teilen, Zubehör und Lifestyle-Artikeln. Jedes Stück wird sorgfältig ausgewählt, um Ihr Vespa-Erlebnis zu verbessern.",
      viewProducts: "Produkte anzeigen",
      hideProducts: "Produkte ausblenden",
      visitOnlineShop: "Online-Shop besuchen",
      categories: {
        safety: "Sicherheit",
        accessories: "Zubehör",
        parts: "Teile",
        lifestyle: "Lifestyle"
      },
      products: {
        helmet: {
          name: "Vintage Vespa Helm",
          price: "€89"
        },
        seat: {
          name: "Ledersitzbezug",
          price: "€129"
        },
        mirrors: {
          name: "Chrom-Spiegelset",
          price: "€75"
        },
        map: {
          name: "Nida Karte & Führer",
          price: "€19"
        }
      }
    },

    testimonials: {
      title: "Was unsere Kunden sagen",
      subtitle: "Bewertungen",
      description: "Hören Sie von Reisenden, die die Freude erlebt haben, Nida auf unseren hochwertigen Vespa-Rollern zu erkunden.",
      viewReviews: "Bewertungen anzeigen",
      hideReviews: "Bewertungen ausblenden",
      showDetails: "Details anzeigen",
      showLess: "Weniger anzeigen",
      vespaModel: "Vespa-Modell",
      routeTaken: "Gewählte Route",
      visitDate: "Besuchsdatum",
      autoAdvancing: "Auto-Fortschritt",
      pauseAutoplay: "Automatische Wiedergabe pausieren",
      startAutoplay: "Automatische Wiedergabe starten",
      prevButton: "Vorherige Bewertung",
      nextButton: "Nächste Bewertung",
      goToReview: "Zur Bewertung",
      enjoyed: "Hat Ihnen Ihr Vespa Nida-Erlebnis gefallen?",
      shareYours: "Teilen Sie Ihre Bewertung",
      items: [
        {
          name: "Julia Kovalenko",
          location: "Vilnius, Litauen",
          quote: "Die Erkundung von Nida auf einer Vespa war das Highlight unserer Sommerreise. Das Team von Vespa Nida bot einen tadellosen Service von der Buchung bis zur Rückgabe.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Küstenleuchtturm-Route",
          date: "August 2023"
        },
        {
          name: "Thomas Müller",
          location: "Berlin, Deutschland",
          quote: "Die Freiheit, mit diesen stilvollen Vespas entlang der Dünen zu cruisen, machte unsere Jubiläumsreise unvergesslich. Wir entdeckten versteckte Strände, die wir sonst nie gefunden hätten.",
          vespaModel: "Vespa GTS",
          routeTaken: "Sanddünen-Abenteuer",
          date: "Juli 2023"
        },
        {
          name: "Sophie Laurent",
          location: "Paris, Frankreich",
          quote: "Der Vintage-Charme von Nida, gepaart mit einer klassischen Vespa, ist pure Magie. Ihre Liebe zum Detail und der makellose Zustand der Roller übertrafen unsere Erwartungen.",
          vespaModel: "Vespa Sprint",
          routeTaken: "Fischerdorf-Tour",
          date: "September 2023"
        },
        {
          name: "Marco Rossi",
          location: "Rom, Italien",
          quote: "Als Italiener, der authentische Vespa-Erlebnisse schätzt, war ich gründlich beeindruckt. Die Roller waren in perfektem Zustand, und die empfohlenen Routen zeigten die beste natürliche Schönheit Nidas.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Individuelle Route",
          date: "Juni 2023"
        },
        {
          name: "Emma Johnson",
          location: "London, UK",
          quote: "Eine perfekte Möglichkeit, die Kurische Nehrung zu erleben. Die Vespa war für uns beide bequem, und wir genossen die Freiheit, jederzeit anzuhalten, wenn wir etwas Schönes entdeckten - was oft der Fall war!",
          vespaModel: "Vespa GTS",
          routeTaken: "Küstenleuchtturm-Route",
          date: "August 2023"
        }
      ]
    },

   booking: {
  startBooking: "Reservierung Starten",
  showForm: "Reservierung Starten",
  hideForm: "Formular Ausblenden",
  bookingShort: "Reservierungen", 
  title: "Buchen Sie Ihr Vespa-Abenteuer",
  subtitle: "Reservierung",
  description: "Bereit, Nida mit Stil zu erkunden? Füllen Sie das Buchungsformular unten aus, um Ihre Vespa für eine unvergessliche Reise zu reservieren.",
  errorMessage: "Bei der Übermittlung Ihrer Buchung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
  assistance: "Benötigen Sie Hilfe bei Ihrer Buchung? Kontaktieren Sie uns direkt unter",
  comingSoon: "Demnächst",
  notify: {
    title: "Benachrichtigung bei Verfügbarkeit",
    description: "Wir informieren Sie, sobald unsere neuen Vespa GTS Roller zur Miete verfügbar sind.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "ihre@email.de",
    nameLabel: "Name",
    namePlaceholder: "Ihr vollständiger Name",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+370 XXX XXXXX",
    cancel: "Abbrechen",
    submit: "Benachrichtigen",
    success: "Vielen Dank! Wir werden Sie benachrichtigen, sobald dieses Modell verfügbar ist.",
    notifyMe: "Benachrichtigen"
  },
  steps: {
    vespa: {
      title: "Wählen Sie Ihre Vespa",
      day: "Tag"
    },
    details: {
      title: "Mietdetails",
      rentalDate: "Mietdatum",
      maxOneDayNote: "Maximal 1 Tag Miete",
      dateWarningTitle: "Maximal 1 Tag Miete",
      dateWarningText: "Leider vermieten wir Roller für maximal 1 Tag, um die Verfügbarkeit für alle unsere Kunden zu gewährleisten und unseren Qualitätsservice aufrechtzuerhalten.",
      rentalDuration: "Mietdauer",
      fullDay: "Ganzer Tag",
      fullDayTime: "9:00 - 23:00",
      morningHalf: "Vormittag Halbtag",
      morningTime: "9:00 - 15:30",
      eveningHalf: "Nachmittag Halbtag",
      eveningTime: "16:30 - 23:00",
      helmetOptions: "Helm-Optionen",
      helmetIncluded: "1 Helm inklusive",
      helmetFree: "KOSTENLOS",
      secondHelmet: "2. Helm",
      helmetPrice: "+10€",
      route: "Bevorzugte Route",
      selectRoute: "Route auswählen",
      gpsGuides: "GPS-Routenführungen für alle Optionen verfügbar",
      rentalSummary: "Mietzusammenfassung",
      additionalHelmet: "Zusätzlicher Helm",
      total: "Gesamt",
      subtotal: "Zwischensumme",
      securityDeposit: "Kaution",
      totalPayment: "Gesamtzahlung",
      paymentDetails: "Zahlungsdetails",
      fullPaymentRequired: "• Vollzahlung im Voraus erforderlich",
      depositIncluded: "• 300€ Kaution inbegriffen",
      depositReturned: "• Kaution nach Rollerinspektion zurückerstattet",
      paymentMethods: "• Zahlungsmethoden: Karte",
      depositNote: "Vollzahlung ({price}€) + 300€ Kaution erforderlich. Kaution nach Rollerinspektion zurückerstattet."
    },
    personal: {
      title: "Persönliche Informationen",
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      age: "Alter",
      selectAge: "Wählen Sie Ihr Alter",
      drivingLicense: "Führerscheinkategorie",
      selectLicense: "Wählen Sie Ihre Führerscheinkategorie",
      licenseRequirements: "Führerscheinanforderungen",
      licenseNote: "Um die Vespa Sprint S Elettrica 45 zu fahren, benötigen Sie mindestens einen Führerschein der Kategorie AM.",
      licenseAlternatives: "Sie können auch mit den Kategorien A1, A2, A oder B fahren (alle höheren Kategorien schließen automatisch die Kategorie AM ein).",
      message: "Besondere Wünsche",
      namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
      emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
      phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
      messagePlaceholder: "Besondere Anforderungen oder Fragen?",
      phoneNote: "Wir können Sie bezüglich Ihrer Buchung kontaktieren",
      summary: "Buchungsübersicht",
      model: "Vespa-Modell",
      duration: "Dauer",
      date: "Datum",
      age: "Alter",
      license: "Führerschein",
      notSelected: "Nicht ausgewählt",
      subtotal: "Zwischensumme",
      securityDeposit: "Kaution",
      totalPayment: "Gesamtzahlung",
      importantNotes: "Wichtige Hinweise",
      helmetNote: "1 Helm inklusive, 2. Helm +10€",
      paymentNote: "Vollzahlung im Voraus erforderlich",
      depositNote: "300€ Kaution nach Inspektion zurückerstattet",
      maxDayNote: "Maximal 1 Tag Mietrichtlinie",
      termsAgreement: "Ich stimme den",
      termsLink: "Nutzungsbedingungen",
      and: "zu und erkenne die",
      privacyLink: "Datenschutzrichtlinie"
    },
    continue: "Fortfahren",
    continueDates: "Weiter zu Terminen",
    back: "Zurück",
    processing: "Verarbeitung...",
    complete: "Buchung abschließen"
  },
  success: {
    title: "Buchungsanfrage erhalten!",
    message: "Vielen Dank für Ihre Reservierungsanfrage. Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihre Buchungsdetails zu bestätigen und Zahlungsanweisungen zu geben.",
    emailSent: "Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Wenn Sie diese nicht innerhalb weniger Minuten erhalten, überprüfen Sie bitte Ihren Spam-Ordner.",
    newBooking: "Eine weitere Buchung vornehmen",
    exploreRoutes: "Routen erkunden"
  },
  info: {
    hours: {
      title: "Vermietungszeiten",
      text: "Ganzer Tag: 9:00-23:00\nHalber Tag: 9:00-15:30 oder 16:30-23:00\nMaximal 1 Tag Mietrichtlinie"
    },
    payment: {
      title: "Zahlungsrichtlinie",
      text: "Vollzahlung im Voraus + 300€ Kaution (nach Inspektion zurückerstattet)."
    },
    license: {
      title: "Führerscheinanforderungen",
      text: "Mindestalter 21 Jahre. Gültiger Führerschein erforderlich (AM, A1, A2, A oder B Kategorie)."
    }
  },
  models: {
    sprint: {
      name: "Vespa Elettrica 45",
      color: "Perlweiß",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Umweltfreundliche Stadtfahrten"
    },
    sprint2: {
      name: "Vespa Elettrica 45",
      color: "Salbeigrün",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Nachhaltiges Touring"
    },
    sprint3: {
      name: "Vespa Elettrica 45",
      color: "Sandbeige",
      power: "3,1 kW",
      maxSpeed: "45 km/h",
      range: "68 km",
      idealFor: "Geräuschlose Erkundung"
    }
  },
  routes: {
    none: "Keine spezifische Route (selbstgeführt)",
    coastal: "Küstenleuchtturm-Route (12 km)",
    dunes: "Sanddünen-Abenteuer-Route (18 km)",
    village: "Fischerdorf-Tour (8 km)",
    custom: "Individuelle Route (in der Nachricht beschreiben)"
  }
},
documents: {
  title: "Dokumentenprüfung",
  description: "Bitte lesen und bestätigen Sie diese Dokumente",
  readDocument: "Dokument lesen",
  accept: "Ich stimme zu",
  rental: {
    title: "Mietvertrag"
  },
  handover: {
    title: "Übergabevertrag"
  },
  safety: {
    title: "Sicherheits- und Verantwortungsregeln"
  }
},
signature: {
  title: "Digitale Signatur",
  instruction: "Bitte unterschreiben Sie im Feld unten",
  clear: "Löschen",
  completed: "Signatur hinzugefügt"
},

    footer: {
    newsletter: {
      title: "Newsletter abonnieren",
      description: "Erhalten Sie exklusive Angebote und Updates zu Nidas malerischen Routen",
      placeholder: "Ihre E-Mail-Adresse",
      button: "Abonnieren",
      success: "Vielen Dank für Ihr Abonnement!"
    },
    description: "Luxuriöse Vespa-Rollermiete in Nida, Litauen. Erleben Sie die natürliche Schönheit der Kurischen Nehrung mit Stil und Freiheit.",
    descriptionTrademark: "Vespa Nida ist ein unabhängiger Verleihservice, der weder mit Piaggio & Co S.p.A. noch mit der Marke Vespa verbunden oder von diesen unterstützt wird.",
    quickLinks: "Schnellzugriff",
    information: "Information",
    contactUs: "Kontakt",
    chooseLanguage: "Sprachen",
    yearsInBusiness: "Jahre im Geschäft",
    established: "Gegründet 2025",
    backToTop: "Nach oben",
    rights: "Alle Rechte vorbehalten.",
    slogan: "\"Mit Eleganz gefertigt für authentische Fahrten.\"",
    links: {
      faq: "FAQ",
      terms: "AGB",
      privacy: "Datenschutz",
      rental: "Mietvertrag",
      careers: "Karriere",
      blog: "Blog"
    },
    badges: {
      secure: "Sichere Zahlungen",
      insured: "Versicherte Vermietung"
    },
    contact: {
      address: "Adresse",
      phone: "Telefon",
      email: "E-mail",
      hours: "Öffnungszeiten",
      weekdays: "Mo-Fr: 9:00 - 18:00",
      weekends: "Sa-So: 10:00 - 16:00"
    },
    viewOnMap: "In Google Maps ansehen"
  },
  languageSelector: {
    title: "Wählen Sie Ihre Sprache",
    subtitle: "Wählen Sie Ihre bevorzugte Sprache, um fortzufahren"
  },

  cookies: {
  title: "Cookies",
  description: "Wir verwenden Cookies, um Ihr Browsing-Erlebnis zu verbessern, den Verkehr zu analysieren und personalisierte Inhalte bereitzustellen.",
  readPolicy: "Cookie-Richtlinie lesen",
  readPrivacy: "Datenschutzrichtlinie",
  acceptNecessary: "Nur notwendige",
  customize: "Anpassen",
  acceptAll: "Alle akzeptieren",
  cancel: "Abbrechen",
  savePreferences: "Einstellungen speichern",
  necessary: {
    title: "Notwendige Cookies",
    description: "Diese Cookies sind für das Funktionieren der Website unerlässlich und können nicht deaktiviert werden."
  },
  analytics: {
    title: "Analyse-Cookies",
    description: "Helfen uns zu verstehen, wie Besucher die Website nutzen."
  },
  marketing: {
    title: "Marketing-Cookies",
    description: "Werden verwendet, um personalisierte Werbung anzuzeigen."
  },
  preferences: {
    title: "Präferenz-Cookies",
    description: "Speichern Ihre Auswahl, wie z.B. die Sprache."
  }
},

  faq: {
  title: "Häufig gestellte Fragen",
  subtitle: "FAQ",
  description: "Finden Sie Antworten auf die häufigsten Fragen zu unserer Vespa-Vermietung in Nida, Litauen.",
  categories: {
    all: "Alle Fragen",
    booking: "Buchung",
    requirements: "Voraussetzungen",
    rental: "Mietdetails",
    safety: "Sicherheit"
  },
  questions: {
    q1: "Wie buche ich einen Vespa-Roller in Nida?",
    q2: "Was passiert, wenn ich meine Vespa-Mietbuchung stornieren muss?",
    q3: "Welche Dokumente benötige ich für die Vespa-Miete in Litauen?",
    q4: "Gibt es eine Altersvoraussetzung für die Vespa-Miete in Nida?",
    q5: "Stellen Sie Helme und Sicherheitsausrüstung in Nida bereit?",
    q6: "Wie hoch ist die Kaution für die Vespa-Miete?",
    q7: "Benötige ich Vorkenntnisse, um eine Vespa in Nida zu fahren?",
    q8: "Was passiert, wenn die Vespa während der Miete in Nida beschädigt wird?"
  },
  answers: {
    a1: "Sie können ganz einfach eine Vespa-Roller-Miete in Nida, Litauen über unser Online-Buchungssystem auf dieser Website, telefonisch unter +3706 795 6380 oder per E-Mail an info@vespanida.lt buchen. Wir befinden uns im Herzen der Kurischen Nehrung und bedienen das gesamte Nida-Gebiet. Wir empfehlen eine frühzeitige Buchung, besonders während der baltischen Sommersaison (Juni-August).",
    a2: "Für Vespa-Miet-Stornierungen in Nida, die mindestens 48 Stunden vor der geplanten Abholzeit erfolgen, erhalten Sie eine vollständige Rückerstattung. Bei Stornierungen innerhalb von 48 Stunden fällt eine Stornogebühr von 25% an. Nichterscheinen oder Stornierungen am Miettag werden nicht erstattet. Diese Richtlinie gewährleistet faire Verfügbarkeit für alle Nida-Besucher.",
    a3: "Für die Vespa-Miete in Nida, Litauen benötigen Sie: einen gültigen Führerschein (Klasse AM, A1, A2, A oder B), einen gültigen Ausweis oder Reisepass und eine Kreditkarte für die Kaution. Internationale Besucher Litauens benötigen einen internationalen Führerschein zusammen mit ihrem Originalführerschein, wenn dieser nicht in lateinischen Buchstaben geschrieben ist.",
    a4: "Ja, das Mindestalter für die Vespa-Miete in Nida beträgt 21 Jahre, und Sie müssen seit mindestens 1 Jahr im Besitz eines gültigen Führerscheins sein. Diese Altersanforderung gewährleistet eine sichere Erkundung der malerischen Routen der Kurischen Nehrung.",
    a5: "Ja, wir stellen für alle Vespa-Mieten in Nida DOT-zertifizierte Helme für Fahrer und Beifahrer kostenlos zur Verfügung. Wir bieten auch optionale Warnwesten und Handschuhe zur Miete an, um Ihre Sicherheit bei der Erkundung der schönen litauischen Küste zu gewährleisten.",
    a6: "Die Kaution für die Vespa-Miete in Nida beträgt 300€ und wird bei der Abholung auf Ihrer Kreditkarte vorautorisiert. Dieser Betrag wird bei Rückgabe der Vespa in ihrem ursprünglichen Zustand vollständig zurückerstattet. Dies ist übliche Praxis für Premium-Roller-Vermietungen in Litauen.",
    a7: "Keine Vorkenntnisse sind für die Vespa-Miete in Nida erforderlich, aber wir bieten eine kurze Einweisung und Fahrhinweise an, bevor Sie die Kurische Nehrung erkunden. Wenn Sie noch nie einen Roller gefahren sind, empfehlen wir Ihnen, einige Minuten in unserem dafür vorgesehenen Bereich zu üben, bevor Sie losfahren, um Nidas Attraktionen zu entdecken.",
    a8: "Jeder Schaden an Ihrer Vespa-Miete in Nida, der über normale Abnutzung hinausgeht, wird bewertet und kann durch die Kaution abgedeckt werden."
  },
  stillHaveQuestions: "Noch Fragen?",
  contactPrompt: "Wenn Sie die gesuchte Antwort nicht gefunden haben, zögern Sie bitte nicht, unser Team direkt zu kontaktieren."
}
  },

  rights: {
  title: "Ihre Rechte",
  subtitle: "EU-Verbraucherschutz", 
  description: "Verstehen Sie Ihre Verbraucherrechte und den Schutz bei der Buchung mit Vespa Nida.",
  needHelp: "Benötigen Sie Hilfe bei Ihren Rechten?",
  contactPrompt: "Falls Sie Unterstützung bei der Ausübung Ihrer Verbraucherrechte benötigen, hilft Ihnen unser Team gerne weiter.",
  
  categories: {
    all: "Alle Rechte",
    cancellation: "Stornierung",
    refund: "Rückerstattung", 
    weather: "Wetter",
    privacy: "Datenschutz",
    complaint: "Beschwerden",
    insurance: "Versicherung"
  },
  
  questions: {
    q1: "Welche Stornierungsrechte habe ich bei der Buchung einer Vespa-Miete?",
    q2: "Wie funktioniert der Rückerstattungsprozess für Vespa-Mieten?",
    q3: "Welche Rechte habe ich, wenn Wetterbedingungen meine Vespa-Miete verhindern?",
    q4: "Welche Datenschutzrechte habe ich bei der Buchung einer Vespa-Miete?",
    q5: "Wie kann ich eine Beschwerde über meine Vespa-Miet-Erfahrung einreichen?",
    q6: "Welchen Versicherungsschutz habe ich beim Mieten einer Vespa?"
  },
  
  answers: {
    a1: "Nach EU-Verbraucherschutzgesetzen haben Sie das Recht, Ihre Vespa-Mietbuchung bis zu 48 Stunden vor der geplanten Abholzeit gegen vollständige Rückerstattung zu stornieren. Bei Stornierungen innerhalb von 48 Stunden fällt eine Servicegebühr von 25% an. Dies gewährleistet faire Verfügbarkeit für alle Kunden und schützt gleichzeitig Ihre Verbraucherrechte.",
    a2: "Nach der EU-Zahlungsdienstrichtlinie haben Sie Anspruch auf vollständige Rückerstattung für qualifizierte Stornierungen innerhalb von 5-7 Werktagen. Rückerstattungen werden auf Ihre ursprüngliche Zahlungsmethode zurückgebucht. Bei wetterbedingten Stornierungen am Miettag bieten wir vollständige Rückerstattung oder kostenlose Umbuchung gemäß EU-Verbraucherschutzstandards.",
    a3: "Nach EU-Verbraucherschutzgesetzen haben Sie bei extremen Wetterbedingungen (starker Regen, starke Winde oder Stürme), die den Vespa-Betrieb unsicher machen, das Recht auf vollständige Rückerstattung oder kostenlose Umbuchung. Wir überwachen die Wetterbedingungen und kontaktieren Sie proaktiv, wenn die Bedingungen als unsicher für den Rollerbetrieb im Kurischen Nehrung-Gebiet eingestuft werden.",
    a4: "Nach der DSGVO haben Sie vollständige Kontrolle über Ihre persönlichen Daten. Sie können jederzeit Zugang zu Ihren Daten beantragen, Korrekturen anfordern oder die Löschung verlangen. Wir sammeln nur notwendige Informationen für Ihre Buchung und Sicherheit und teilen Ihre Daten niemals ohne Ihre ausdrückliche Zustimmung mit Dritten. Ihre Daten werden sicher gespeichert und gemäß rechtlichen Anforderungen gelöscht.",
    a5: "Sie haben das Recht, Beschwerden über mehrere Kanäle einzureichen: direkt bei uns unter info@vespanida.lt, über die litauische staatliche Verbraucherschutzbehörde oder über das Netzwerk der Europäischen Verbraucherzentren. Wir sind verpflichtet, alle Probleme schnell und fair zu lösen. Für EU-Bürger steht auch die Online-Streitbeilegungsplattform für E-Commerce-Streitigkeiten zur Verfügung.",
    a6: "Alle unsere Vespa-Mieten beinhalten umfassenden Versicherungsschutz, wie es das litauische Recht verlangt. Dies umfasst Haftpflichtversicherung und Schadendeckung. Sie haben das Recht, Versicherungsdokumente vor der Miete einzusehen und eine Kopie zu erhalten. Zusätzliche Deckungsoptionen sind für zusätzlichen Schutz verfügbar. Im Falle eines Unfalls bieten wir vollständige Unterstützung bei Versicherungsansprüchen und Behörden."
  },
  
  badges: {
    b1: "48H KOSTENLOS",
    b2: "VOLLRÜCKERSTATTUNG", 
    b3: "WETTERSCHUTZ",
    b4: "DSGVO-GESCHÜTZT",
    b5: "BESCHWERDERECHTE",
    b6: "VERSICHERT"
  }
},


pl: {
    nav: {
      home: 'Strona główna',
      about: 'O nas',
      fleet: 'Flota',
      explore: 'Odkryj',
      shop: 'Sklep',
      contact: 'Kontakt'
    },
    buttons: {
      bookNow: 'Zarezerwuj teraz',
      reserveNow: 'Zarezerwuj teraz',
      subscribe: 'Subskrybuj',
      bookYourRide: 'Zarezerwuj jazdę'
    },
    hero: {
      viewFAQ: "FAQ",
      tagline: "Wypożyczalnia premium skuterów Vespa w Nidzie",
      slogans: {
        first: "Elegancja w ruchu",
        second: "Autentyczne przejażdżki. Ponadczasowy styl.",
        third: "Odkryj Nidę. Żyj Vespą."
      },
      description: "Odkryj malownicze piękno Nidy z naszymi luksusowymi skuterami Vespa. Przemierzaj wybrzeże Bałtyku ze stylem i swobodą.",
      exploreFleet: "Poznaj naszą flotę",
      contactUs: "Skontaktuj się z nami",
      scrollToExplore: "Przewiń, aby odkryć",
      imageAlt: "Skuter Vespa na malowniczej nadmorskiej drodze w Nidzie"
    },

    calendar: {
  months: {
    january: 'Styczeń',
    february: 'Luty',
    march: 'Marzec',
    april: 'Kwiecień',
    may: 'Maj',
    june: 'Czerwiec',
    july: 'Lipiec',
    august: 'Sierpień',
    september: 'Wrzesień',
    october: 'Październik',
    november: 'Listopad',
    december: 'Grudzień'
  },
  days: {
    sunday: 'Nd',
    monday: 'Pn',
    tuesday: 'Wt',
    wednesday: 'Śr',
    thursday: 'Cz',
    friday: 'Pt',
    saturday: 'Sb'
  },
  availableScooters: 'Dostępne skutery',
  units: 'szt.',
  legend: {
    bothAvailable: 'Oba skutery dostępne',
    oneAvailable: '1 skuter dostępny',
    allBooked: 'Wszystkie skutery zajęte'
  },
  status: {
    label: 'Status',
    pending: 'Oczekuje na potwierdzenie',
    confirmed: 'Potwierdzone',
    completed: 'Zakończone',
    cancelled: 'Anulowane'
  },
  bookingDetails: 'Szczegóły rezerwacji',
  bookingNumber: 'Nr rezerwacji',
  customer: 'Klient',
  email: 'E-mail',
  phone: 'Telefon',
  vespa: 'Vespa',
  amount: 'Kwota',
  confirm: 'Potwierdź',
  cancel: 'Anuluj',
  markCompleted: 'Oznacz jako zakończone',
  deleteBooking: 'Usuń rezerwację',
  close: 'Zamknij',
  bookingUpdated: 'Rezerwacja została pomyślnie zaktualizowana!',
  bookingDeleted: 'Rezerwacja została pomyślnie usunięta!',
  confirmDelete: 'Czy na pewno chcesz usunąć tę rezerwację?',
  updateError: 'Błąd podczas aktualizacji rezerwacji: ',
  deleteError: 'Błąd podczas usuwania rezerwacji: '
},
    about: {
      title: "O Vespa Nida",
      subtitle: "Nasza historia",
      paragraph1: "Vespa Nida oferuje premium doświadczenie wypożyczania skuterów w sercu najpiękniejszego nadmorskiego miasta Litwy. Naszą misją jest zapewnienie odwiedzającym stylowego, wygodnego i ekologicznego sposobu odkrywania cudów natury Mierzei Kurońskiej.",
      paragraph2: "Założona przez lokalnych entuzjastów z pasją do włoskiego designu i bałtyckich krajobrazów, dbamy o flotę starannie utrzymanych skuterów Vespa, które łączą klasyczną estetykę z nowoczesną wydajnością.",
      features: {
        premium: {
          title: "Flota Premium",
          description: "Starannie utrzymane skutery Vespa w nieskazitelnym stanie"
        },
        expertise: {
          title: "Lokalna ekspertyza",
          description: "Wewnętrzna wiedza o ukrytych perełkach i malowniczych trasach Nidy"
        },
        service: {
          title: "Bezproblemowa obsługa",
          description: "Bezproblemowa rezerwacja, dostawa i wsparcie przez całą podróż"
        }
      },
      quote: "\"To nie tylko skuter. To manifest.\"",
      since: "Od",
      imageAlt: "Zabytkowy skuter Vespa nad morzem",
      showContent: "O nas",
      hideContent: "Ukryj szczegóły"
    },

    rights: {
  title: "Twoje prawa (Prawo UE)",
  subtitle: "Ochrona konsumentów",
  description: "Jako konsument Unii Europejskiej jesteś chroniony kompleksowymi prawami, które zapewniają uczciwe i przejrzyste usługi wynajmu.",
  cancellation: {
    title: "14-dniowe prawo odstąpienia",
    description: "Możesz anulować rezerwację w ciągu 14 dni bez dodatkowych opłat",
    badge: "Ochrona UE"
  },
  refund: {
    title: "Gwarancja szybkiego zwrotu",
    description: "W przypadku anulowania, zwrócimy pełną kwotę w ciągu 7 dni roboczych",
    badge: "Maks. 7 dni"
  },
  weather: {
    title: "Ochrona pogodowa",
    description: "Oferujemy zmianę daty lub pełny zwrot z powodu warunków pogodowych",
    badge: "Elastyczny"
  },
  privacy: {
    title: "Ochrona danych RODO",
    description: "Twoje dane osobowe są chronione zgodnie z przepisami RODO",
    badge: "Bezpieczny"
  },
  footer: {
    title: "Pytania o Twoje prawa?",
    description: "Nasz zespół obsługi klienta pomoże Ci zrozumieć i skorzystać z praw konsumenckich."
  }
},

    fleet: {
      title: "Nasza flota Vespa",
      subtitle: "Poznaj naszą kolekcję",
      description: "Wybierz spośród naszych starannie wyselekcjonowanych premium skuterów Vespa, utrzymanych w najwyższych standardach i gotowych na Twoje przygody w Nidzie.",
      features: "Funkcje",
      customRental: "Potrzebujesz niestandardowej wypożyczalni lub masz specjalne wymagania?",
      contactTeam: "Skontaktuj się z naszym zespołem",
      buttons: {
        reserveNow: "Zarezerwuj teraz",
        details: "Szczegóły",
        comingSoon: "Wkrótce",
        notifyWhenAvailable: "Powiadom mnie",
        notifyTitle: "Otrzymaj powiadomienie, gdy będzie dostępne",
        notifyDescription: "Damy Ci znać, gdy tylko nasze nowe skutery Vespa GTS będą dostępne do wypożyczenia.",
        emailLabel: "Adres email",
        nameLabel: "Imię",
        namePlaceholder: "Twoje imię i nazwisko",
        phoneLabel: "Numer telefonu",
        phonePlaceholder: "+48 XXX XXX XXX",
        emailPlaceholder: "twoj@email.com",
        cancel: "Anuluj",
        notifySubmit: "Powiadom mnie",
        notifySuccess: "Dzięki! Powiadomimy Cię, gdy ten model będzie dostępny.",
        moreInfo: "Więcej informacji"
      },
      items: {
        sprint: {
          name: "Vespa Elettrica 45",
          color: "Biały kość słoniowa",
          description: "Klasyczny włoski styl z nowoczesnym komfortem. Idealny wybór na nadmorskie podróże.",
          specs: "3.1 kW | Elektryczny | 2 pasażerów",
          features: [
            "Ekonomiczny silnik",
            "Przednie hamulce tarczowe",
            "System antykradzieżowy",
            "Schowek pod siedzeniem"
          ]
        },
        sprint2: {
          name: "Vespa Elettrica 45",
          color: "Zielony szałwiowy",
          description: "Potężna wydajność z ponadczasową elegancją. Idealny na dłuższe podróże.",
          specs: "3.1 kW | Elektryczny | 2 pasażerów",
          features: [
            "System antykradzieżowy",
            "System hamulcowy ABS",
            "Cyfrowy panel instrumentów",
            "Przestronny schowek"
          ]
        },
        sprint3: {
          name: "Vespa Elettrica 45",
          color: "Beżowy piaskowy",
          description: "Zwinne prowadzenie z wyrafinowaną estetyką. Idealny do odkrywania wąskich uliczek.",
          specs: "3.1 kW | Elektryczny | 2 pasażerów",
          features: [
            "Łatwa manewrowość",
            "Oświetlenie LED",
            "System antykradzieżowy",
            "Wygodne siedzenie"
          ]
        }
      }
    },

    explore: {
      title: "Odkryj Nidę",
      subtitle: "Starannie dobrane podróże",
      description: "Odkryj naturalne piękno i dziedzictwo kulturowe Mierzei Kurońskiej dzięki naszym ekspercko zaprojektowanym malowniczym trasom. Każda podróż oferuje unikatową perspektywę zapierających dech w piersiach krajobrazów i ukrytych perełek Nidy.",
      viewRoutes: "Odkryj malownicze trasy",
      hideRoutes: "Ukryj trasy",
      showMore: "Pokaż więcej",
      showLess: "Pokaż mniej",
      routeHighlights: "Najważniejsze punkty trasy",
      terrain: "Teren",
      viewDetails: "Zobacz szczegóły",
      viewAllRoutes: "Zobacz wszystkie trasy",
      customRoutesAvailable: "Niestandardowe trasy dostępne na życzenie",
      tipForExplorers: "Wskazówka dla odkrywców",
      tipDescription: "Wszystkie trasy zaczynają się z naszej centralnej lokalizacji. Przewodniki GPS dostępne na życzenie dla samodzielnych wycieczek.",
      mapAlt: "Mapa malowniczych tras w Nidzie",
      difficultyLevel: "Poziom trudności",
      difficulty: {
        easy: "Łatwy",
        moderate: "Średni",
        hard: "Trudny"
      },
      routes: {
        coastal: {
          title: "Trasa nadmorska do latarni morskiej",
          distance: "12 km",
          duration: "45 min",
          difficulty: "Łatwy",
          description: "Podążaj malowniczą nadmorską drogą do kultowej latarni morskiej w Nidzie, oferującej panoramiczne widoki na Morze Bałtyckie i Zalew Kuroński.",
          highlights: [
            "Panoramiczne widoki na morze",
            "Zabytkowa latarnia morska",
            "Piaszczyste plaże",
            "Przybrzeżna fauna"
          ],
          terrain: "Utwardzone drogi, płaski teren"
        },
        dunes: {
          title: "Przygoda na wydmach",
          distance: "18 km",
          duration: "1 godzina",
          difficulty: "Średni",
          description: "Przemierzaj lasy sosnowe, aby dotrzeć do słynnej wydmy Parnidis, drugiej najwyższej ruchomej wydmy piaskowej w Europie. Idealny na widoki o zachodzie słońca.",
          highlights: [
            "Imponujące wydmy piaskowe",
            "Leśne szlaki",
            "Pomnik zegara słonecznego",
            "Widoki o zachodzie słońca"
          ],
          terrain: "Teren mieszany, niektóre wzniesienia"
        },
        fisherman: {
          title: "Wycieczka po wiosce rybackiej",
          distance: "8 km",
          duration: "30 min",
          difficulty: "Łatwy",
          description: "Odkryj autentyczny urok tradycyjnych litewskich wiosek rybackich z ich kolorowymi drewnianymi domami i bogatą historią morską.",
          highlights: [
            "Kolorowe domy",
            "Lokalne rzemiosło",
            "Port rybacki",
            "Tradycyjna architektura"
          ],
          terrain: "Utwardzone drogi, płaski teren"
        }
      }
    },

    languageSelector: {
      title: "Wybierz swój język",
      subtitle: "Wybierz preferowany język, aby kontynuować"
    },

    shop: {
      title: "Części i akcesoria Vespa",
      subtitle: "Kolekcja sklepu",
      description: "Odkryj nasz starannie dobrany wybór oryginalnych części Vespa, akcesoriów i artykułów lifestyle. Każdy element jest starannie wyselekcjonowany, aby wzbogacić Twoje doświadczenie z Vespą.",
      viewProducts: "Zobacz produkty",
      hideProducts: "Ukryj produkty",
      visitOnlineShop: "Odwiedź sklep online",
      categories: {
        safety: "Bezpieczeństwo",
        accessories: "Akcesoria",
        parts: "Części",
        lifestyle: "Lifestyle"
      },
      products: {
        helmet: {
          name: "Zabytkowy kask Vespa",
          price: "€89"
        },
        seat: {
          name: "Skórzany pokrowiec na siedzenie",
          price: "€129"
        },
        mirrors: {
          name: "Zestaw chromowanych lusterek",
          price: "€75"
        },
        map: {
          name: "Mapa i przewodnik po Nidzie",
          price: "€19"
        }
      }
    },

    testimonials: {
      title: "Co mówią nasi klienci",
      subtitle: "Opinie",
      description: "Posłuchaj podróżników, którzy doświadczyli radości odkrywania Nidy na naszych premium skuterach Vespa.",
      viewReviews: "Zobacz opinie",
      hideReviews: "Ukryj opinie",
      showDetails: "Pokaż szczegóły",
      showLess: "Pokaż mniej",
      vespaModel: "Model Vespa",
      routeTaken: "Wybrana trasa",
      visitDate: "Data wizyty",
      autoAdvancing: "Automatyczne przewijanie",
      pauseAutoplay: "Zatrzymaj automatyczne odtwarzanie",
      startAutoplay: "Uruchom automatyczne odtwarzanie",
      prevButton: "Poprzednia opinia",
      nextButton: "Następna opinia",
      goToReview: "Przejdź do opinii",
      enjoyed: "Podobało Ci się doświadczenie z Vespa Nida?",
      shareYours: "Podziel się swoją opinią",
      items: [
        {
          name: "Julia Kovalenko",
          location: "Wilno, Litwa",
          quote: "Odkrywanie Nidy na Vespie było główną atrakcją naszej letniej podróży. Zespół Vespa Nida zapewnił nienaganną obsługę od rezerwacji do zwrotu.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Trasa nadmorska do latarni morskiej",
          date: "Sierpień 2023"
        },
        {
          name: "Thomas Müller",
          location: "Berlin, Niemcy",
          quote: "Swoboda przejażdżki wzdłuż wydm na tych stylowych Vespach sprawiła, że nasza podróż rocznicowa stała się niezapomniana. Odkryliśmy ukryte plaże, których nigdy byśmy nie znaleźli inaczej.",
          vespaModel: "Vespa GTS",
          routeTaken: "Przygoda na wydmach",
          date: "Lipiec 2023"
        },
        {
          name: "Sophie Laurent",
          location: "Paryż, Francja",
          quote: "Zabytkowy urok Nidy w połączeniu z klasyczną Vespą to czysta magia. Ich dbałość o szczegóły i nieskazitelny stan skuterów przekroczyły nasze oczekiwania.",
          vespaModel: "Vespa Sprint",
          routeTaken: "Wycieczka po wiosce rybackiej",
          date: "Wrzesień 2023"
        },
        {
          name: "Marco Rossi",
          location: "Rzym, Włochy",
          quote: "Jako Włoch, który ceni autentyczne doświadczenia z Vespą, byłem całkowicie pod wrażeniem. Skutery były w idealnym stanie, a polecane trasy pokazały najpiękniejsze strony naturalnego piękna Nidy.",
          vespaModel: "Vespa Primavera",
          routeTaken: "Trasa niestandardowa",
          date: "Czerwiec 2023"
        },
        {
          name: "Emma Johnson",
          location: "Londyn, Wielka Brytania",
          quote: "Idealny sposób na doświadczenie Mierzei Kurońskiej. Vespa była wygodna dla nas obojga i cieszyliśmy się swobodą zatrzymywania się, gdy tylko coś pięknego nas zainteresowało - co zdarzało się często!",
          vespaModel: "Vespa GTS",
          routeTaken: "Trasa nadmorska do latarni morskiej",
          date: "Sierpień 2023"
        }
      ]
    },

    booking: {
      startBooking: "Rozpocznij rezerwację",
      showForm: "Rozpocznij rezerwację",
      hideForm: "Ukryj formularz",
      bookingShort: "Rezerwacja",
      title: "Zarezerwuj swoją przygodę z Vespą",
      subtitle: "Rezerwacja",
      description: "Gotowy na odkrywanie Nidy w stylu? Wypełnij formularz rezerwacji poniżej, aby zarezerwować swoją Vespę na niezapomnianą podróż.",
      errorMessage: "Wystąpił błąd podczas przesyłania rezerwacji. Spróbuj ponownie lub skontaktuj się z nami bezpośrednio.",
      assistance: "Potrzebujesz pomocy z rezerwacją? Skontaktuj się z nami bezpośrednio pod",
      comingSoon: "Wkrótce",
      notify: {
        title: "Otrzymaj powiadomienie, gdy będzie dostępne",
        description: "Damy Ci znać, gdy tylko nasze nowe skutery Vespa GTS będą dostępne do wypożyczenia.",
        emailLabel: "Adres email",
        emailPlaceholder: "twoj@email.com",
        nameLabel: "Imię",
        namePlaceholder: "Twoje imię i nazwisko",
        phoneLabel: "Numer telefonu",
        phonePlaceholder: "+48 XXX XXX XXX",
        cancel: "Anuluj",
        submit: "Powiadom mnie",
        success: "Dzięki! Powiadomimy Cię, gdy ten model będzie dostępny.",
        notifyMe: "Powiadom mnie"
      },
      steps: {
        vespa: {
          title: "Wybierz swoją Vespę",
          day: "dzień"
        },
        details: {
          title: "Szczegóły wypożyczenia",
          rentalDate: "Data wypożyczenia",
          maxOneDayNote: "Maksymalnie 1 dzień wypożyczenia",
          dateWarningTitle: "Maksymalnie 1 dzień wypożyczenia",
          dateWarningText: "Niestety, wypożyczamy skutery maksymalnie na 1 dzień, aby zapewnić dostępność dla wszystkich naszych klientów i utrzymać jakość obsługi.",
          rentalDuration: "Czas wypożyczenia",
          fullDay: "Cały dzień",
          fullDayTime: "9:00 - 23:00",
          morningHalf: "Pół dnia rano",
          morningTime: "9:00 - 15:30",
          eveningHalf: "Pół dnia wieczorem",
          eveningTime: "16:30 - 23:00",
          helmetOptions: "Opcje kasku",
          helmetIncluded: "1 kask w zestawie",
          helmetFree: "GRATIS",
          secondHelmet: "2. kask",
          helmetPrice: "+€10",
          route: "Preferowana trasa",
          selectRoute: "Wybierz trasę",
          gpsGuides: "Przewodniki GPS dostępne dla wszystkich opcji",
          rentalSummary: "Podsumowanie wypożyczenia",
          additionalHelmet: "Dodatkowy kask",
          total: "Razem",
          subtotal: "Suma częściowa",
          securityDeposit: "Kaucja zabezpieczająca",
          totalPayment: "Całkowita płatność",
          paymentDetails: "Szczegóły płatności",
          fullPaymentRequired: "• Wymagana pełna płatność z góry",
          depositIncluded: "• Kaucja zabezpieczająca €300€ włączona",
          depositReturned: "• Kaucja zwrócona po kontroli skutera",
          paymentMethods: "• Metody płatności: Karta",
          depositNote: "Wymagana pełna płatność (€{price}) + kaucja €300€. Kaucja zwrócona po kontroli skutera."
        },
        personal: {
          title: "Informacje osobiste",
          name: "Imię i nazwisko",
          email: "Adres email",
          phone: "Numer telefonu",
          age: "Wiek",
          selectAge: "Wybierz swój wiek",
          drivingLicense: "Kategoria prawa jazdy",
          selectLicense: "Wybierz kategorię prawa jazdy",
          licenseRequirements: "Wymagania dotyczące prawa jazdy",
          licenseNote: "Aby prowadzić Vespa Sprint S Elettrica 45, potrzebujesz co najmniej prawa jazdy kategorii AM.",
          licenseAlternatives: "Możesz również prowadzić z prawem jazdy kategorii: A1, A2, A lub B (wszystkie wyższe kategorie automatycznie zawierają kategorię AM).",
          message: "Specjalne życzenia",
          namePlaceholder: "Wprowadź swoje imię i nazwisko",
          emailPlaceholder: "Wprowadź swój adres email",
          phonePlaceholder: "Wprowadź swój numer telefonu",
          messagePlaceholder: "Jakieś specjalne wymagania lub pytania?",
          phoneNote: "Możemy skontaktować się z Tobą w sprawie rezerwacji",
          summary: "Podsumowanie rezerwacji",
          model: "Model Vespa",
          duration: "Czas trwania",
          date: "Data",
          age: "Wiek",
          license: "Prawo jazdy",
          notSelected: "Nie wybrano",
          subtotal: "Suma częściowa",
          securityDeposit: "Kaucja zabezpieczająca",
          totalPayment: "Całkowita płatność",
          importantNotes: "Ważne uwagi",
          helmetNote: "1 kask w zestawie, 2. kask +€10",
          paymentNote: "Wymagana pełna płatność z góry",
          depositNote: "Kaucja €300€ zwrócona po kontroli",
          maxDayNote: "Polityka maksymalnie 1 dzień wypożyczenia",
          termsAgreement: "Zgadzam się z",
          termsLink: "Warunkami świadczenia usług",
          and: "i przyjmuję do wiadomości",
          privacyLink: "Politykę prywatności"
        },
        continue: "Kontynuuj",
        continueDates: "Kontynuuj do dat",
        back: "Wstecz",
        processing: "Przetwarzanie...",
        complete: "Zakończ rezerwację"
      },
      success: {
        title: "Prośba o rezerwację otrzymana!",
        message: "Dziękujemy za prośbę o rezerwację. Skontaktujemy się z Tobą wkrótce, aby potwierdzić szczegóły rezerwacji i podać instrukcje płatności.",
        emailSent: "Email potwierdzający został wysłany na Twój adres email. Jeśli nie otrzymasz go w ciągu kilku minut, sprawdź folder spam.",
        newBooking: "Zrób kolejną rezerwację",
        exploreRoutes: "Odkryj malownicze trasy"
      },
      info: {
        hours: {
          title: "Godziny wypożyczenia",
          text: "Cały dzień: 9:00-23:00\nPół dnia: 9:00-15:30 lub 16:30-23:00\nPolityka maksymalnie 1 dzień wypożyczenia"
        },
        payment: {
          title: "Polityka płatności",
          text: "Pełna płatność z góry + kaucja €300€ (zwrócona po kontroli)."
        },
        license: {
          title: "Wymagania dotyczące prawa jazdy",
          text: "Minimalny wiek 21 lat. Wymagane ważne prawo jazdy (kategoria AM, A1, A2, A lub B)."
        }
      },
      models: {
        sprint: {
          name: "Vespa Elettrica 45",
          color: "Perłowa biel",
          power: "3.1 kW",
          maxSpeed: "45 km/h",
          range: "68 km",
          idealFor: "Ekologiczne przejażdżki po mieście"
        },
        sprint2: {
          name: "Vespa Elettrica 45",
          color: "Zielony szałwiowy",
          power: "3.1 kW",
          maxSpeed: "45 km/h",
          range: "68 km",
          idealFor: "Zrównoważone wycieczki"
        },
        sprint3: {
          name: "Vespa Elettrica 45",
          color: "Beżowy piaskowy",
          power: "3.1 kW",
          maxSpeed: "45 km/h",
          range: "68 km",
          idealFor: "Cicha eksploracja"
        }
      },
      routes: {
        none: "Brak konkretnej trasy (samodzielna wycieczka)",
        coastal: "Trasa nadmorska do latarni morskiej (12 km)",
        dunes: "Przygoda na wydmach (18 km)",
        village: "Wycieczka po wiosce rybackiej (8 km)",
        custom: "Trasa niestandardowa (opisz w wiadomości)"
      }
    },
    documents: {
  title: "Przegląd dokumentów",
  description: "Proszę przeczytać i potwierdzić te dokumenty",
  readDocument: "Przeczytaj dokument",
  accept: "Zgadzam się",
  rental: {
    title: "Umowa najmu"
  },
  handover: {
    title: "Umowa przekazania"
  },
  safety: {
    title: "Zasady bezpieczeństwa i odpowiedzialności"
  }
},
signature: {
  title: "Podpis cyfrowy",
  instruction: "Proszę podpisać w polu poniżej",
  clear: "Wyczyść",
  completed: "Podpis dodany"
    },

    footer: {
      newsletter: {
        title: "Dołącz do naszego newslettera",
        description: "Otrzymuj ekskluzywne oferty i aktualizacje o malowniczych trasach Nidy",
        placeholder: "Twój adres email",
        button: "Subskrybuj",
        success: "Dziękujemy za subskrypcję!"
      },
      description: "Luksusowe wypożyczenie skuterów Vespa w Nidzie, Litwa. Doświadcz naturalnego piękna Mierzei Kurońskiej w stylu i wolności.",
      descriptionTrademark: "Vespa Nida to niezależna usługa wynajmu, niezwiązana z Piaggio & Co S.p.A. ani marką Vespa i niepopapiena przez te podmioty.",
      quickLinks: "Szybkie linki",
      information: "Informacje",
      contactUs: "Skontaktuj się z nami",
      chooseLanguage: "Języki",
      yearsInBusiness: "Lat działalności",
      established: "Założona 2025",
      backToTop: "Powrót na górę",
      rights: "Wszystkie prawa zastrzeżone.",
      slogan: "\"Stworzone z elegancją dla autentycznych przejażdżek.\"",
      links: {
        faq: "FAQ",
        terms: "Warunki świadczenia usług",
        privacy: "Polityka prywatności",
        rental: "Umowa wypożyczenia",
        careers: "Kariera",
        blog: "Blog"
      },
      badges: {
        secure: "Bezpieczne płatności",
        insured: "Ubezpieczone wypożyczenie"
      },
      contact: {
        address: "Adres",
        phone: "Telefon",
        email: "Email",
        hours: "Godziny",
        weekdays: "Pon-Pt: 9:00 - 18:00",
        weekends: "Sob-Ndz: 10:00 - 16:00"
      },
      viewOnMap: "Zobacz na Google Maps"
    },

    cookies: {
  title: "Pliki cookie",
  description: "Używamy plików cookie, aby poprawić Twoje doświadczenie przeglądania, analizować ruch i dostarczać spersonalizowane treści.",
  readPolicy: "Przeczytaj politykę cookie",
  readPrivacy: "Polityka prywatności",
  acceptNecessary: "Tylko niezbędne",
  customize: "Dostosuj",
  acceptAll: "Zaakceptuj wszystkie",
  cancel: "Anuluj",
  savePreferences: "Zapisz preferencje",
  necessary: {
    title: "Niezbędne pliki cookie",
    description: "Te pliki cookie są niezbędne do funkcjonowania strony internetowej i nie można ich wyłączyć."
  },
  analytics: {
    title: "Pliki cookie analityczne",
    description: "Pomagają nam zrozumieć, jak odwiedzający korzystają ze strony internetowej."
  },
  marketing: {
    title: "Pliki cookie marketingowe",
    description: "Używane do wyświetlania spersonalizowanych reklam."
  },
  preferences: {
    title: "Pliki cookie preferencji",
    description: "Zapisują Twoje wybory, takie jak język."
  }
},

    faq: {
  title: "Najczęściej zadawane pytania",
  subtitle: "FAQ",
  description: "Znajdź odpowiedzi na najczęstsze pytania dotyczące naszego wypożyczenia skuterów Vespa w Nidzie, Litwa.",
  categories: {
    all: "Wszystkie pytania",
    booking: "Rezerwacja",
    requirements: "Wymagania",
    rental: "Szczegóły wypożyczenia",
    safety: "Bezpieczeństwo"
  },
  questions: {
    q1: "Jak zarezerwować skuter Vespa w Nidzie?",
    q2: "Co się dzieje, jeśli muszę anulować rezerwację wypożyczenia Vespa?",
    q3: "Jakie dokumenty są potrzebne do wypożyczenia Vespa na Litwie?",
    q4: "Czy istnieje wymóg wiekowy do wypożyczenia Vespa w Nidzie?",
    q5: "Czy zapewniacie kaski i wyposażenie bezpieczeństwa w Nidzie?",
    q6: "Ile wynosi kaucja za wypożyczenie Vespa?",
    q7: "Czy potrzebuję wcześniejszego doświadczenia w jeździe Vespą w Nidzie?",
    q8: "Co się dzieje, jeśli Vespa zostanie uszkodzona podczas wypożyczenia w Nidzie?"
  },
  answers: {
    a1: "Możesz łatwo zarezerwować wypożyczenie skutera Vespa w Nidzie, Litwa przez nasz system rezerwacji online na tej stronie, telefonicznie pod +3706 795 6380, lub emailem pod info@vespanida.lt. Znajdujemy się w sercu Mierzei Kurońskiej i obsługujemy cały obszar Nidy. Zalecamy rezerwację z wyprzedzeniem, szczególnie w sezonie letnim nad Bałtykiem (czerwiec-sierpień).",
    a2: "W przypadku anulacji wypożyczenia Vespa w Nidzie dokonanej co najmniej 48 godzin przed planowanym odbiorem, otrzymasz pełny zwrot. W przypadku anulacji w ciągu 48 godzin obowiązuje opłata anulacyjna w wysokości 25%. Niestawiennictwo lub anulacja w dniu wypożyczenia nie podlegają zwrotowi. Ta polityka zapewnia sprawiedliwą dostępność dla wszystkich odwiedzających Nidę.",
    a3: "Do wypożyczenia Vespa w Nidzie, Litwa będziesz potrzebować: ważnego prawa jazdy (kategoria AM, A1, A2, A lub B), ważnego dowodu osobistego lub paszportu oraz karty kredytowej na kaucję zabezpieczającą. Goście międzynarodowi odwiedzający Litwę potrzebują Międzynarodowego Prawa Jazdy wraz z oryginalnym prawem jazdy, jeśli nie jest w alfabecie łacińskim.",
    a4: "Tak, minimalny wiek do wypożyczenia naszych Vesp w Nidzie to 21 lat, a musisz mieć ważne prawo jazdy przez co najmniej 1 rok. Ten wymóg wiekowy zapewnia bezpieczne odkrywanie malowniczych tras Mierzei Kurońskiej.",
    a5: "Tak, dla wszystkich wypożyczeń Vespa w Nidzie zapewniamy kaski certyfikowane DOT dla kierowcy i pasażera bez dodatkowej opłaty. Oferujemy również opcjonalne kamizelki odblaskowe i rękawiczki do wypożyczenia, zapewniając bezpieczeństwo podczas odkrywania pięknego litewskiego wybrzeża.",
    a6: "Kaucja za wypożyczenie Vespa w Nidzie wynosi €300€ i zostanie pre-autoryzowana na Twojej karcie kredytowej przy odbiorze. Ta kwota jest w pełni zwracana po zwrocie Vespa w oryginalnym stanie. To standardowa praktyka dla wypożyczalni premium skuterów na Litwie.",
    a7: "Wcześniejsze doświadczenie nie jest potrzebne do wypożyczenia Vespa w Nidzie, ale oferujemy krótkie wprowadzenie i wskazówki dotyczące prowadzenia przed odkrywaniem Mierzei Kurońskiej. Jeśli nigdy nie prowadziłeś skutera, zalecamy poświęcenie kilku minut na ćwiczenia w naszym wyznaczonym obszarze przed wyruszeniem na odkrywanie atrakcji Nidy.",
    a8: "Wszelkie uszkodzenia Twojej wypożyczonej Vespa w Nidzie poza normalnym zużyciem zostaną ocenione i mogą być pokryte z kaucji zabezpieczającej. Zalecamy robienie zdjęć skutera przed wyjazdem."
  },
  stillHaveQuestions: "Nadal masz pytania?",
  contactPrompt: "Jeśli nie znalazłeś odpowiedzi, której szukałeś, nie wahaj się skontaktować bezpośrednio z naszym zespołem."
},

rights: {
  title: "Twoje prawa",
  subtitle: "Ochrona konsumenta UE", 
  description: "Poznaj swoje prawa konsumenckie i ochronę podczas rezerwacji z Vespa Nida.",
  needHelp: "Potrzebujesz pomocy z prawami?",
  contactPrompt: "Jeśli potrzebujesz pomocy w korzystaniu z praw konsumenckich, nasz zespół chętnie Ci pomoże.",
  
  categories: {
    all: "Wszystkie prawa",
    cancellation: "Anulowanie",
    refund: "Zwrot pieniędzy", 
    weather: "Pogoda",
    privacy: "Prywatność",
    complaint: "Skargi",
    insurance: "Ubezpieczenie"
  },
  
  questions: {
    q1: "Jakie mam prawa do anulowania przy rezerwacji wypożyczenia Vespy?",
    q2: "Jak działa proces zwrotu pieniędzy za wypożyczenie Vespy?",
    q3: "Jakie mam prawa, jeśli warunki pogodowe uniemożliwiają wypożyczenie Vespy?",
    q4: "Jakie mam prawa do prywatności danych przy rezerwacji wypożyczenia Vespy?",
    q5: "Jak mogę złożyć skargę dotyczącą mojego doświadczenia z wypożyczeniem Vespy?",
    q6: "Jakie ubezpieczenie obejmuje wypożyczenie Vespy?"
  },
  
  answers: {
    a1: "Zgodnie z prawem ochrony konsumentów UE, masz prawo anulować rezerwację wypożyczenia Vespy do 48 godzin przed planowanym odbiorem za pełny zwrot pieniędzy. W przypadku anulowania w ciągu 48 godzin pobierana jest opłata serwisowa w wysokości 25%. Zapewnia to sprawiedliwą dostępność dla wszystkich klientów, chroniąc jednocześnie twoje prawa konsumenckie.",
    a2: "Zgodnie z Dyrektywą UE o usługach płatniczych, przysługuje Ci pełny zwrot pieniędzy za kwalifikujące się anulowania w ciągu 5-7 dni roboczych. Zwroty są przetwarzane z powrotem na oryginalną metodę płatności. W przypadku anulowań pogodowych w dniu wypożyczenia oferujemy pełny zwrot pieniędzy lub bezpłatne przełożenie zgodnie ze standardami ochrony konsumentów UE.",
    a3: "Zgodnie z prawem ochrony konsumentów UE, jeśli surowe warunki pogodowe (silny deszcz, silne wiatry lub burze) czynią eksploatację Vespy niebezpieczną, masz prawo do pełnego zwrotu pieniędzy lub bezpłatnego przełożenia. Monitorujemy warunki pogodowe i proaktywnie skontaktujemy się z Tobą, jeśli warunki będą uznane za niebezpieczne dla eksploatacji skutera na obszarze Mierzei Kurońskiej.",
    a4: "Zgodnie z RODO masz pełną kontrolę nad swoimi danymi osobowymi. Możesz w każdej chwili poprosić o dostęp do swoich danych, poprosić o poprawki lub usunięcie. Zbieramy tylko niezbędne informacje do Twojej rezerwacji i bezpieczeństwa, i nigdy nie udostępniamy Twoich danych stronom trzecim bez Twojej wyraźnej zgody. Twoje dane są przechowywane bezpiecznie i usuwane zgodnie z wymogami prawnymi.",
    a5: "Masz prawo składać skargi przez wiele kanałów: bezpośrednio do nas na info@vespanida.lt, przez litewski Państwowy Urząd Ochrony Praw Konsumentów lub przez sieć Europejskich Centrów Konsumenckich. Zobowiązujemy się do szybkiego i sprawiedliwego rozwiązywania wszelkich problemów. Mieszkańcy UE mają również dostęp do platformy internetowego rozstrzygania sporów dla sporów e-commerce.",
    a6: "Wszystkie nasze wypożyczenia Vespy obejmują kompleksowe ubezpieczenie wymagane przez prawo litewskie. Obejmuje to ubezpieczenie odpowiedzialności cywilnej i pokrycie szkód. Masz prawo zobaczyć dokumenty ubezpieczeniowe przed wypożyczeniem i otrzymać kopię. Dodatkowe opcje pokrycia są dostępne dla dodatkowej ochrony. W przypadku wypadku zapewniamy pełne wsparcie w sprawach roszczeń ubezpieczeniowych i kontaktów z władzami."
  },
  
  badges: {
    b1: "48H GRATIS",
    b2: "PEŁNY ZWROT", 
    b3: "OCHRONA POGODOWA",
    b4: "RODO CHRONIONE",
    b5: "PRAWA DO SKARG",
    b6: "UBEZPIECZONE"
  }
}
},  
  }

// Create the context
const LanguageContext = createContext();


// Provider component
export function LanguageProvider({ children }) {
  // Get language from domain (FIXED VERSION)
  const getLanguageFromDomain = () => {
    if (typeof window === 'undefined') return 'lt';
    
    const hostname = window.location.hostname;
    console.log('Current hostname:', hostname); // Debug log
    
    // Exact match for domains
    const language = DOMAIN_LANGUAGE_MAP[hostname];
    console.log('Detected language from domain:', language); // Debug log
    
    return language || 'lt'; // Default to Lithuanian
  };

  const [currentLanguage, setCurrentLanguage] = useState('lt');
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize language on client-side (FIXED VERSION)
  useEffect(() => {
    const domainLanguage = getLanguageFromDomain();
    console.log('Setting language to:', domainLanguage); // Debug log
    
    // Always use domain-based language detection first
    setCurrentLanguage(domainLanguage);
    
    // Also save to localStorage for consistency
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', domainLanguage);
    }
    
    setIsLoading(false);
  }, []); // Empty dependency array - only run once on mount
  
   // FIXED changeLanguage function
  const changeLanguage = (code) => {
    console.log('Changing language to:', code); // Debug log
    
    if (languages.some(lang => lang.code === code)) {
      const targetDomain = LANGUAGE_DOMAIN_MAP[code];
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      
      console.log('Target domain:', targetDomain); // Debug log
      console.log('Current path:', currentPath); // Debug log
      
      // Always redirect to the appropriate domain
      if (typeof window !== 'undefined') {
        const fullUrl = `${targetDomain}${currentPath}`;
        console.log('Redirecting to:', fullUrl); // Debug log
        window.location.href = fullUrl;
      }
    }
  };
  
 // Translation function (keeping your existing logic)
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to Lithuanian first, then English
        let fallback = translations['lt'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            fallback = translations['en'];
            for (const k of keys) {
              if (fallback && fallback[k] !== undefined) {
                fallback = fallback[k];
              } else {
                return key;
              }
            }
            break;
          }
        }
        return fallback;
      }
    }
    
    return value;
  };

  // Show loading state during initialization
  // Show loading state during initialization
if (isLoading) {
  return (
    <div className="min-h-screen bg-[#F9F7F1] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#9AA89C]"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-[#E9DCC9]"></div>
        <div className="absolute top-1/2 left-16 w-16 h-16 rounded-full bg-[#B0B0B0]"></div>
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        
        {/* Vespa Nida Logo Animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center p-2">
            <img 
              src="/images/logo.jpg" 
              alt="Vespa Nida" 
              className="w-14 h-14 object-contain animate-pulse"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(155, 168, 156, 0.3))' }}
            />
          </div>
          
          {/* Animated circles around logo */}
          <div className="absolute inset-0 animate-spin duration-3000">
            <div className="w-20 h-20 border-2 border-transparent border-t-[#9AA89C] rounded-full"></div>
          </div>
          <div className="absolute inset-1 animate-spin duration-2000 animation-delay-150">
            <div className="w-18 h-18 border-2 border-transparent border-b-[#E9DCC9] rounded-full"></div>
          </div>
          <div className="absolute inset-2 animate-spin duration-4000 animation-delay-300">
            <div className="w-16 h-16 border border-transparent border-r-[#B0B0B0] rounded-full"></div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="text-center space-y-3">
          <h2 className="font-syne text-2xl font-bold text-[#2B2B2B] tracking-wide animate-fadeIn">
            VESPA NIDA
          </h2>
          <div className="flex items-center space-x-2 text-[#9AA89C] animate-fadeIn animation-delay-200">
            <div className="w-8 h-0.5 bg-[#9AA89C] animate-pulse"></div>
            <span className="font-inter text-sm uppercase tracking-widest">
              Kraunasi
            </span>
            <div className="w-8 h-0.5 bg-[#9AA89C] animate-pulse animation-delay-300"></div>
          </div>
        </div>
        
        {/* Elegant tagline */}
        <p className="font-playfair text-[#B0B0B0] text-sm italic text-center max-w-xs animate-fadeIn animation-delay-400">
          "Elegance in Motion"
        </p>
        
        {/* Animated dots */}
        <div className="flex space-x-2 animate-fadeIn animation-delay-600">
          <div className="w-2 h-2 bg-[#9AA89C] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#E9DCC9] rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-2 h-2 bg-[#B0B0B0] rounded-full animate-bounce animation-delay-200"></div>
        </div>
        
        {/* Loading progress indicator */}
        <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden animate-fadeIn animation-delay-800">
          <div className="h-full bg-gradient-to-r from-[#9AA89C] to-[#E9DCC9] animate-shimmer"></div>
        </div>
      </div>
      
      {/* Bottom brand element */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeIn animation-delay-1000">
        <div className="w-20 h-0.5 bg-gradient-to-r from-[#9AA89C] via-[#E9DCC9] to-[#B0B0B0] animate-pulse"></div>
      </div>
    </div>
  );
}

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      t,
      availableLanguages: languages,
      currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'vespanida.lt'
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  return useContext(LanguageContext);
}