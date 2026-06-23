import {createEpisode} from './createEpisode';
import script from '../scripts/episode-12.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode12Script = script as EpisodeScript;
export const Episode12 = createEpisode(episode12Script);
