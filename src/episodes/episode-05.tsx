import {createEpisode} from './createEpisode';
import script from '../scripts/episode-05.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode05Script = script as EpisodeScript;
export const Episode05 = createEpisode(episode05Script);
