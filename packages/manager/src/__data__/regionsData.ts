import { Region } from '@linode/api-v4/lib/regions';

const resolvers = {
  ipv4: '8.8.8.8',
  ipv6: '2600:3c03::5',
};

export const regions: Region[] = [
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'in',
    id: 'ap-west',
    label: 'Mumbai, IN',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'au',
    id: 'ap-southeast',
    label: 'Sydney, AU',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'ca',
    id: 'ca-central',
    label: 'Toronto, CA',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'us',
    id: 'us-central',
    label: 'Dallas, TX',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'us',
    id: 'us-west',
    label: 'Fremont, CA',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers'],
    country: 'us',
    id: 'us-southeast',
    label: 'Atlanta, GA',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: [
      'Linodes',
      'NodeBalancers',
      'Block Storage',
      'Object Storage',
    ],
    country: 'us',
    id: 'us-east',
    label: 'Newark, NJ',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'uk',
    id: 'eu-west',
    label: 'London, UK',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'sg',
    id: 'ap-south',
    label: 'Singapore, SG',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'de',
    id: 'eu-central',
    label: 'Frankfurt, DE',
    status: 'ok',
    resolvers,
  },
  {
    capabilities: ['Linodes', 'NodeBalancers', 'Block Storage'],
    country: 'jp',
    id: 'ap-northeast',
    label: 'Tokyo, JP',
    status: 'ok',
    resolvers,
  },
];

export const extendedRegions = regions.map((thisRegion) => ({
  ...thisRegion,
  display: thisRegion.id,
}));
