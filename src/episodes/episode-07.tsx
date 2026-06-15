import {createEpisode} from './createEpisode';
import script from '../scripts/episode-07.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode07Script = script as EpisodeScript;
export const Episode07 = createEpisode(episode07Script);
