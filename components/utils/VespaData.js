// components/utils/vespaData.js
export const getVespaModels = (t) => [
  {
    id: 'primavera',
    name: t('booking.models.primavera.name'),
    color: t('booking.models.primavera.color'),
    cc: t('booking.models.primavera.cc'),
    topSpeed: t('booking.models.primavera.topSpeed'),
    range: t('booking.models.primavera.range'),
    idealFor: t('booking.models.primavera.idealFor'),
    image: '/images/fleet-white-vespa.jpg',
    price: 79,
    comingSoon: false
  },
  {
    id: 'gts',
    name: t('booking.models.gts.name'),
    color: t('booking.models.gts.color'),
    cc: t('booking.models.gts.cc'),
    topSpeed: t('booking.models.gts.topSpeed'),
    range: t('booking.models.gts.range'),
    idealFor: t('booking.models.gts.idealFor'),
    image: '/images/fleet-green-vespa.jpg',
    price: 99,
    comingSoon: true
  },
  {
    id: 'sprint',
    name: t('booking.models.sprint.name'),
    color: t('booking.models.sprint.color'),
    cc: t('booking.models.sprint.cc'),
    topSpeed: t('booking.models.sprint.topSpeed'),
    range: t('booking.models.sprint.range'),
    idealFor: t('booking.models.sprint.idealFor'),
    image: '/images/fleet-beige-vespa.jpg',
    price: 69,
    comingSoon: false
  }
];

export const getRouteOptions = (t) => [
  { id: 'none', name: t('booking.routes.none') },
  { id: 'coastal', name: t('booking.routes.coastal') },
  { id: 'dunes', name: t('booking.routes.dunes') },
  { id: 'village', name: t('booking.routes.village') },
  { id: 'custom', name: t('booking.routes.custom') }
];

export const getModelPrices = (t) => ({
  [t('booking.models.primavera.name')]: 79,
  [t('booking.models.gts.name')]: 99,
  [t('booking.models.sprint.name')]: 69
});