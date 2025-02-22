import { UUID } from 'crypto';

const authRoot = 'auth';
const bundleRoot = 'bundles';
const trackRoot = 'tracks';
const commentRoot = 'comments';
const userRoot = 'users';

export const routes = {
  auth: {
    root: `/${authRoot}`,
    register: '/register',
    login: '/login',
    refresh: '/refresh',
    spotify: {
      root: '/spotify',
      callback: '/spotify/callback',
    },
  },
  bundle: {
    root: `/${bundleRoot}`,
    detail: '/:uuid',
    tracks: {
      root: `/:uuid/${trackRoot}`,
      detail: `/:uuid/${trackRoot}/:trackid`,
    },
    location: (id: UUID) => `/${bundleRoot}/${id}`, 
  },
  track: {
    root: `/${trackRoot}`,
    detail: '/:trackid',
    recentComments: '/recent-comments',
    comments: `/:trackid/${commentRoot}`,
    search: '/search',
  },
  comment: {
    root: `${commentRoot}`,
    detail: ':id',
  },
  user: {
    root: `/${userRoot}`,
    profile: '/:username/profile',
    me: '/me',
  },
} as const;
