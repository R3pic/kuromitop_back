import { BundleForbiddenException } from './bundle-forbidden.error';
import { BundleNotFoundException } from './bundle-not-found.error';

export class BundleServiceException {
    static BUNDLE_NOT_FOUND = new BundleNotFoundException();
    static BUNDLE_FORBIDDEN = new BundleForbiddenException();
}