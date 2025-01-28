import { MusicAlreadyInBundleException } from './music-already-in-bundle.error';

export class MusicServiceExeception {
    static readonly MusicAlreadyInBundle = new MusicAlreadyInBundleException();
}