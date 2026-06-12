import {createEpisode} from './createEpisode';
import script from '../scripts/episode-01.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode01Script = script as EpisodeScript;
export const Episode01 = createEpisode(episode01Script);
