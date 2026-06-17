import {createEpisode} from './createEpisode';
import script from '../scripts/episode-08.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode08Script = script as EpisodeScript;
export const Episode08 = createEpisode(episode08Script);
