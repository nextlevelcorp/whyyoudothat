import {createEpisode} from './createEpisode';
import script from '../scripts/episode-13.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode13Script = script as EpisodeScript;
export const Episode13 = createEpisode(episode13Script);
