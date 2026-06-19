import {createEpisode} from './createEpisode';
import script from '../scripts/episode-09.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode09Script = script as EpisodeScript;
export const Episode09 = createEpisode(episode09Script);
