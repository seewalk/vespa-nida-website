'use client';

import { createContext, useState, useContext, useEffect } from 'react';
// Remove the import since we're defining translations in this file
// import translations from '../../translations';

// Define available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'de', name: 'German' }
];

// Define translations
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

     fleet: {
      title: "Our Vespa Fleet",
      subtitle: "Explore our collection",
      description: "Choose from our carefully selected fleet of premium Vespa scooters, each maintained to the highest standards and ready for your Nida adventure.",
      features: "Features",
      customRental: "Need a custom rental or have special requirements?",
      contactTeam: "Contact our team for details",
      buttons: {
        reserveNow: "Reserve Now",
        details: "Details"
      },
      items: {
        primavera: {
          name: "Vespa Primavera",
          color: "Ivory White",
          description: "Classic Italian styling with modern comfort. Perfect for coastal cruising.",
          specs: "150cc | Automatic | 2 Passengers",
          features: [
            "Fuel-efficient engine", 
            "Front disc brake", 
            "USB charging port", 
            "Under-seat storage"
          ]
        },
        gts: {
          name: "Vespa GTS",
          color: "Sage Green",
          description: "Powerful performance with timeless elegance. Ideal for longer journeys.",
          specs: "300cc | Automatic | 2 Passengers",
          features: [
            "High-performance engine", 
            "ABS braking system", 
            "Digital dashboard", 
            "Spacious storage"
          ]
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Sand Beige",
          description: "Nimble handling with refined aesthetics. Great for exploring narrow streets.",
          specs: "125cc | Automatic | 2 Passengers",
          features: [
            "Agile handling", 
            "LED lighting", 
            "Anti-theft system", 
            "Comfortable seating"
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
      title: "Book Your Vespa Adventure",
      subtitle: "Reservation",
      description: "Ready to explore Nida in style? Complete the booking form below to reserve your Vespa for an unforgettable journey.",
      showForm: "Start Booking",
      hideForm: "Hide Booking Form",
      errorMessage: "There was an error submitting your booking. Please try again or contact us directly.",
      assistance: "Need assistance with your booking? Contact us directly at",
      steps: {
        vespa: {
          title: "Choose Your Vespa",
          day: "day"
        },
        details: {
          title: "Rental Details",
          startDate: "Start Date",
          endDate: "End Date",
          startTime: "Rentals start at 9:00 AM",
          endTime: "Rentals end at 6:00 PM",
          riders: "Number of Riders",
          onePerson: "1 Person",
          twoPeople: "2 People",
          additionalRider: "Additional rider: €15/day",
          route: "Preferred Route",
          selectRoute: "Select a route",
          gpsGuides: "GPS route guides available for all options",
          rentalSummary: "Rental Summary",
          riderFee: "Additional rider fee",
          total: "Total",
          deposit: "A 25% deposit will be required to confirm your booking. The remaining balance is due upon pickup."
        },
        personal: {
          title: "Personal Information",
          name: "Full Name",
          email: "Email Address",
          phone: "Phone Number",
          message: "Special Requests",
          namePlaceholder: "Enter your full name",
          emailPlaceholder: "Enter your email address",
          phonePlaceholder: "Enter your phone number",
          messagePlaceholder: "Any special requirements or questions?",
          phoneNote: "We may contact you regarding your booking",
          summary: "Booking Summary",
          model: "Vespa Model",
          duration: "Duration",
          pickup: "Pick-up",
          dropoff: "Drop-off",
          day: "day",
          days: "days",
          notSelected: "Not selected",
          totalPrice: "Total Price",
          termsAgreement: "I agree to the",
          termsLink: "Terms of Service",
          and: "and acknowledge the",
          privacyLink: "Privacy Policy",
          driverLicense: "I confirm that I am at least 18 years old and possess a valid driver's license."
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
          text: "Our rental hours are from 9:00 AM to 6:00 PM daily. Extended hours available upon request."
        },
        payment: {
          title: "Payment Policy",
          text: "A 25% deposit is required to confirm your booking. The remaining balance is due upon pickup."
        },
        cancellation: {
          title: "Cancellation Policy",
          text: "Free cancellation up to 48 hours before your rental. After that, the deposit becomes non-refundable."
        }
      },
      models: {
        primavera: {
          name: "Vespa Primavera",
          color: "Ivory White",
          cc: "150cc",
          topSpeed: "95 km/h",
          range: "180 km",
          idealFor: "Coastal cruising"
        },
        gts: {
          name: "Vespa GTS",
          color: "Sage Green",
          cc: "300cc",
          topSpeed: "120 km/h",
          range: "220 km",
          idealFor: "Longer journeys"
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Sand Beige",
          cc: "125cc",
          topSpeed: "90 km/h",
          range: "160 km",
          idealFor: "Exploring narrow streets"
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

    footer: {
    newsletter: {
      title: "Join Our Newsletter",
      description: "Get exclusive offers and updates about Nida's scenic routes",
      placeholder: "Your email address",
      button: "Subscribe",
      success: "Thank you for subscribing!"
    },
    description: "Luxury Vespa scooter rentals in Nida, Lithuania. Experience the natural beauty of the Curonian Spit in style and freedom.",
    quickLinks: "Quick Links",
    information: "Information",
    contactUs: "Contact Us",
    chooseLanguage: "Languages",
    yearsInBusiness: "Years in Business",
    established: "Established 2023",
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

    fleet: {
      title: "Mūsų Vespa parkas",
      subtitle: "Susipažinkite su mūsų kolekcija",
      description: "Rinkitės iš mūsų kruopščiai atrinktų aukščiausios klasės Vespa motorolerių, kurie prižiūrimi pagal aukščiausius standartus ir paruošti jūsų nuotykiams Nidoje.",
      features: "Savybės",
      customRental: "Reikia individualios nuomos ar turite specialių pageidavimų?",
      contactTeam: "Susisiekite su mūsų komanda",
      buttons: {
        reserveNow: "Rezervuoti dabar",
        details: "Detalės"
      },
      items: {
        primavera: {
          name: "Vespa Primavera",
          color: "Dramblio kaulo",
          description: "Klasikinis itališkas stilius su šiuolaikiniu komfortu. Tobulas pasirinkimas pakrantės kelionėms.",
          specs: "150cc | Automatinė | 2 keleiviai",
          features: [
            "Ekonomiškas variklis", 
            "Priekiniai diskiniai stabdžiai", 
            "USB įkrovimo prievadas", 
            "Daiktadėžė po sėdyne"
          ]
        },
        gts: {
          name: "Vespa GTS",
          color: "Šalavijo žalia",
          description: "Galingas našumas su amžinu elegantišumu. Idealus ilgesnėms kelionėms.",
          specs: "300cc | Automatinė | 2 keleiviai",
          features: [
            "Galingas variklis", 
            "ABS stabdžių sistema", 
            "Skaitmeninis prietaisų skydelis", 
            "Talpi daiktadėžė"
          ]
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Smėlio",
          description: "Vikrus valdymas su rafinuota estetika. Puikiai tinka siaurų gatvelių tyrinėjimui.",
          specs: "125cc | Automatinė | 2 keleiviai",
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
      title: "Rezervuokite savo Vespa nuotykį",
      subtitle: "Rezervacija",
      description: "Pasiruošę tyrinėti Nidą stilingai? Užpildykite žemiau esančią rezervacijos formą, kad užsisakytumėte Vespa nepamirštamai kelionei.",
      showForm: "Pradėti rezervaciją",
      hideForm: "Slėpti rezervacijos formą",
      errorMessage: "Įvyko klaida pateikiant jūsų užsakymą. Bandykite dar kartą arba susisiekite su mumis tiesiogiai.",
      assistance: "Reikia pagalbos dėl rezervacijos? Susisiekite su mumis tiesiogiai",
      steps: {
        vespa: {
          title: "Pasirinkite savo Vespa",
          day: "diena"
        },
        details: {
          title: "Nuomos detalės",
          startDate: "Pradžios data",
          endDate: "Pabaigos data",
          startTime: "Nuoma prasideda 9:00",
          endTime: "Nuoma baigiasi 18:00",
          riders: "Vairuotojų skaičius",
          onePerson: "1 asmuo",
          twoPeople: "2 asmenys",
          additionalRider: "Papildomas vairuotojas: 15€/dienai",
          route: "Pageidaujamas maršrutas",
          selectRoute: "Pasirinkite maršrutą",
          gpsGuides: "GPS maršrutų gidai galimi visiems variantams",
          rentalSummary: "Nuomos suvestinė",
          riderFee: "Papildomo vairuotojo mokestis",
          total: "Iš viso",
          deposit: "Rezervacijai patvirtinti reikalingas 25% depozitas. Likusi suma mokama atsiimant."
        },
        personal: {
          title: "Asmeninė informacija",
          name: "Pilnas vardas",
          email: "El. pašto adresas",
          phone: "Telefono numeris",
          message: "Specialūs pageidavimai",
          namePlaceholder: "Įveskite savo pilną vardą",
          emailPlaceholder: "Įveskite savo el. pašto adresą",
          phonePlaceholder: "Įveskite savo telefono numerį",
          messagePlaceholder: "Kokie nors specialūs reikalavimai ar klausimai?",
          phoneNote: "Mes galime susisiekti su jumis dėl jūsų rezervacijos",
          summary: "Rezervacijos suvestinė",
          model: "Vespa modelis",
          duration: "Trukmė",
          pickup: "Paėmimas",
          dropoff: "Grąžinimas",
          day: "diena",
          days: "dienos",
          notSelected: "Nepasirinkta",
          totalPrice: "Bendra kaina",
          termsAgreement: "Sutinku su",
          termsLink: "Paslaugų teikimo sąlygomis",
          and: "ir pripažįstu",
          privacyLink: "Privatumo politiką",
          driverLicense: "Patvirtinu, kad esu bent 18 metų ir turiu galiojantį vairuotojo pažymėjimą."
        },
        continue: "Tęsti",
        continueDates: "Tęsti į datas",
        back: "Atgal",
        processing: "Apdorojama...",
        complete: "Užbaigti rezervaciją"
      },
      success: {
        title: "Rezervacijos užklausa gauta!",
        message: "Dėkojame už jūsų rezervacijos užklausą. Netrukus susisieksime su jumis patvirtinti jūsų užsakymo detales ir pateikti mokėjimo instrukcijas.",
        emailSent: "Patvirtinimo el. laiškas išsiųstas jūsų el. pašto adresu. Jei negausite jo per kelias minutes, patikrinkite savo šlamšto aplanką.",
        newBooking: "Sukurti kitą rezervaciją",
        exploreRoutes: "Tyrinėti maršrutus"
      },
      info: {
        hours: {
          title: "Nuomos valandos",
          text: "Mūsų nuomos valandos yra nuo 9:00 iki 18:00 kasdien. Pratęstas darbo laikas galimas pagal pageidavimą."
        },
        payment: {
          title: "Mokėjimo politika",
          text: "Rezervacijai patvirtinti reikalingas 25% depozitas. Likusi suma mokama atsiimant."
        },
        cancellation: {
          title: "Atšaukimo politika",
          text: "Nemokamas atšaukimas iki 48 valandų prieš nuomą. Po to depozitas tampa negrąžinamas."
        }
      },
      models: {
        primavera: {
          name: "Vespa Primavera",
          color: "Dramblio kaulo",
          cc: "150cc",
          topSpeed: "95 km/h",
          range: "180 km",
          idealFor: "Pakrantės kelionėms"
        },
        gts: {
          name: "Vespa GTS",
          color: "Šalavijo žalia",
          cc: "300cc",
          topSpeed: "120 km/h",
          range: "220 km",
          idealFor: "Ilgesnėms kelionėms"
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Smėlio",
          cc: "125cc",
          topSpeed: "90 km/h",
          range: "160 km",
          idealFor: "Siaurų gatvių tyrinėjimui"
        }
      },
      routes: {
        none: "Jokio konkretaus maršruto (savarankiškas)",
        coastal: "Pajūrio švyturio maršrutas (12 km)",
        dunes: "Kopų nuotykis (18 km)",
        village: "Žvejų kaimo turas (8 km)",
        custom: "Individualus maršrutas (aprašykite žinutėje)"
      }
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
    quickLinks: "Greitos nuorodos",
    information: "Informacija",
    contactUs: "Susisiekite su mumis",
    chooseLanguage: "Kalbos",
    yearsInBusiness: "Metai versle",
    established: "Įkurta 2023",
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

  languageSelector: {
    title: "Pasirinkite kalbą",
    subtitle: "Pasirinkite norimą kalbą, kad tęstumėte"
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

    fleet: {
      title: "Unsere Vespa-Flotte",
      subtitle: "Entdecken Sie unsere Kollektion",
      description: "Wählen Sie aus unserer sorgfältig ausgewählten Flotte von Premium-Vespa-Rollern, die nach höchsten Standards gewartet werden und bereit für Ihr Abenteuer in Nida sind.",
      features: "Funktionen",
      customRental: "Benötigen Sie einen besonderen Verleih oder haben Sie spezielle Anforderungen?",
      contactTeam: "Kontaktieren Sie unser Team für Details",
      buttons: {
        reserveNow: "Jetzt reservieren",
        details: "Details"
      },
      items: {
        primavera: {
          name: "Vespa Primavera",
          color: "Elfenbeinweiß",
          description: "Klassisches italienisches Styling mit modernem Komfort. Perfekt für Küstenfahrten.",
          specs: "150cc | Automatik | 2 Passagiere",
          features: [
            "Kraftstoffsparender Motor", 
            "Frontscheibenbremse", 
            "USB-Ladeanschluss", 
            "Stauraum unter dem Sitz"
          ]
        },
        gts: {
          name: "Vespa GTS",
          color: "Salbeigrün",
          description: "Kraftvolle Leistung mit zeitloser Eleganz. Ideal für längere Reisen.",
          specs: "300cc | Automatik | 2 Passagiere",
          features: [
            "Hochleistungsmotor", 
            "ABS-Bremssystem", 
            "Digitales Armaturenbrett", 
            "Geräumiger Stauraum"
          ]
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Sandbeige",
          description: "Wendige Handhabung mit raffinierter Ästhetik. Ideal zum Erkunden enger Straßen.",
          specs: "125cc | Automatik | 2 Passagiere",
          features: [
            "Agile Handhabung", 
            "LED-Beleuchtung", 
            "Diebstahlsicherungssystem", 
            "Komfortable Sitzpolsterung"
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
      title: "Buchen Sie Ihr Vespa-Abenteuer",
      subtitle: "Reservierung",
      description: "Bereit, Nida mit Stil zu erkunden? Füllen Sie das Buchungsformular unten aus, um Ihre Vespa für eine unvergessliche Reise zu reservieren.",
      showForm: "Buchung starten",
      hideForm: "Buchungsformular ausblenden",
      errorMessage: "Bei der Übermittlung Ihrer Buchung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
      assistance: "Benötigen Sie Hilfe bei Ihrer Buchung? Kontaktieren Sie uns direkt unter",
      steps: {
        vespa: {
          title: "Wählen Sie Ihre Vespa",
          day: "Tag"
        },
        details: {
          title: "Mietdetails",
          startDate: "Startdatum",
          endDate: "Enddatum",
          startTime: "Vermietung beginnt um 9:00 Uhr",
          endTime: "Vermietung endet um 18:00 Uhr",
          riders: "Anzahl der Fahrer",
          onePerson: "1 Person",
          twoPeople: "2 Personen",
          additionalRider: "Zusätzlicher Fahrer: 15€/Tag",
          route: "Bevorzugte Route",
          selectRoute: "Route auswählen",
          gpsGuides: "GPS-Routenführungen für alle Optionen verfügbar",
          rentalSummary: "Mietzusammenfassung",
          riderFee: "Zusätzliche Fahrergebühr",
          total: "Gesamt",
          deposit: "Eine Anzahlung von 25% ist erforderlich, um Ihre Buchung zu bestätigen. Der Restbetrag wird bei Abholung fällig."
        },
        personal: {
          title: "Persönliche Informationen",
          name: "Vollständiger Name",
          email: "E-Mail-Adresse",
          phone: "Telefonnummer",
          message: "Besondere Wünsche",
          namePlaceholder: "Geben Sie Ihren vollständigen Namen ein",
          emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
          phonePlaceholder: "Geben Sie Ihre Telefonnummer ein",
          messagePlaceholder: "Besondere Anforderungen oder Fragen?",
          phoneNote: "Wir können Sie bezüglich Ihrer Buchung kontaktieren",
          summary: "Buchungszusammenfassung",
          model: "Vespa-Modell",
          duration: "Dauer",
          pickup: "Abholung",
          dropoff: "Rückgabe",
          day: "Tag",
          days: "Tage",
          notSelected: "Nicht ausgewählt",
          totalPrice: "Gesamtpreis",
          termsAgreement: "Ich stimme den",
          termsLink: "Nutzungsbedingungen",
          and: "zu und erkenne die",
          privacyLink: "Datenschutzrichtlinie",
          driverLicense: "an. Ich bestätige, dass ich mindestens 18 Jahre alt bin und einen gültigen Führerschein besitze."
        },
        continue: "Fortfahren",
        continueDates: "Weiter zu Daten",
        back: "Zurück",
        processing: "Verarbeitung...",
        complete: "Buchung abschließen"
      },
      success: {
        title: "Buchungsanfrage erhalten!",
        message: "Vielen Dank für Ihre Reservierungsanfrage. Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihre Buchungsdetails zu bestätigen und Zahlungsanweisungen bereitzustellen.",
        emailSent: "Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet. Wenn Sie diese nicht innerhalb weniger Minuten erhalten, überprüfen Sie bitte Ihren Spam-Ordner.",
        newBooking: "Weitere Buchung vornehmen",
        exploreRoutes: "Landschaftsrouten erkunden"
      },
      info: {
        hours: {
          title: "Mietzeiten",
          text: "Unsere Mietzeiten sind täglich von 9:00 bis 18:00 Uhr. Verlängerte Zeiten auf Anfrage möglich."
        },
        payment: {
          title: "Zahlungsrichtlinien",
          text: "Eine Anzahlung von 25% ist erforderlich, um Ihre Buchung zu bestätigen. Der Restbetrag wird bei Abholung fällig."
        },
        cancellation: {
          title: "Stornierungsrichtlinien",
          text: "Kostenlose Stornierung bis zu 48 Stunden vor Ihrer Miete. Danach wird die Anzahlung nicht zurückerstattet."
        }
      },
      models: {
        primavera: {
          name: "Vespa Primavera",
          color: "Elfenbeinweiß",
          cc: "150cc",
          topSpeed: "95 km/h",
          range: "180 km",
          idealFor: "Küstenfahrten"
        },
        gts: {
          name: "Vespa GTS",
          color: "Salbeigrün",
          cc: "300cc",
          topSpeed: "120 km/h",
          range: "220 km",
          idealFor: "Längere Reisen"
        },
        sprint: {
          name: "Vespa Sprint",
          color: "Sandbeige",
          cc: "125cc",
          topSpeed: "90 km/h",
          range: "160 km",
          idealFor: "Erkunden enger Straßen"
        }
      },
      routes: {
        none: "Keine spezifische Route (selbstgeführt)",
        coastal: "Küstenleuchtturm-Route (12 km)",
        dunes: "Sanddünen-Abenteuer (18 km)",
        village: "Fischerdorf-Tour (8 km)",
        custom: "Individuelle Route (in Nachricht beschreiben)"
      }
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
    quickLinks: "Schnellzugriff",
    information: "Information",
    contactUs: "Kontakt",
    chooseLanguage: "Sprachen",
    yearsInBusiness: "Jahre im Geschäft",
    established: "Gegründet 2023",
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
  }
    // Add more translations
  }
};

/// Create the context
const LanguageContext = createContext();

// Provider component
export function LanguageProvider({ children }) {
  // Default to browser language or 'en' if not available
  const getBrowserLanguage = () => {
    if (typeof window === 'undefined') return 'en'; // SSR fallback
    
    const browserLang = navigator.language.substring(0, 2);
    return languages.some(lang => lang.code === browserLang) ? browserLang : 'en';
  };
  
  // State to hold the current language
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Initialize language on client-side
  useEffect(() => {
    // Try to get language from localStorage first
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      const browserLang = getBrowserLanguage();
      setCurrentLanguage(browserLang);
      localStorage.setItem('language', browserLang);
    }
  }, []);
  
  // Function to change language
  const changeLanguage = (code) => {
    if (languages.some(lang => lang.code === code)) {
      setCurrentLanguage(code);
      localStorage.setItem('language', code);
    }
  };
  
  // Translation function
  const t = (key) => {
    // Split the key by dots (e.g., "nav.home" => ["nav", "home"])
    const keys = key.split('.');
    
    // Start with current language's translations
    let value = translations[currentLanguage];
    
    // Traverse the keys to get the nested value
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English if translation is missing
        let fallback = translations['en'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return key; // If even English doesn't have it, return the key itself
          }
        }
        return fallback;
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  return useContext(LanguageContext);
}