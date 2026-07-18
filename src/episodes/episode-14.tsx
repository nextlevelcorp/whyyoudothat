import {createEpisode} from './createEpisode';
import script from '../scripts/episode-14.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode14Script = script as EpisodeScript;
export const Episode14 = createEpisode(episode14Script);
