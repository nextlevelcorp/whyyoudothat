import {createEpisode} from './createEpisode';
import script from '../scripts/episode-06.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode06Script = script as EpisodeScript;
export const Episode06 = createEpisode(episode06Script);
