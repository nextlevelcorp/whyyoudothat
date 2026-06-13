import {createEpisode} from './createEpisode';
import script from '../scripts/episode-04.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode04Script = script as EpisodeScript;
export const Episode04 = createEpisode(episode04Script);
