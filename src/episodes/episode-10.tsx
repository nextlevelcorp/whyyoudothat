import {createEpisode} from './createEpisode';
import script from '../scripts/episode-10.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode10Script = script as EpisodeScript;
export const Episode10 = createEpisode(episode10Script);
