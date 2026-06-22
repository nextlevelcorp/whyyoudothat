import {createEpisode} from './createEpisode';
import script from '../scripts/episode-11.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode11Script = script as EpisodeScript;
export const Episode11 = createEpisode(episode11Script);
