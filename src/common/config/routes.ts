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
        recentComments: '/recent-comments',
        comments: `/:trackid/${commentRoot}`,
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
