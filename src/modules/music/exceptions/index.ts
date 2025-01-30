import { MusicAlreadyInBundleException } from './music-already-in-bundle.error';
import { MusicForbiddenException } from './music-forbidden.error';

export class MusicServiceExeception {
    static readonly MUSIC_ALREADY_IN_BUNDLE = new MusicAlreadyInBundleException();
    static readonly FORBIDDEN = new MusicForbiddenException(); 
}