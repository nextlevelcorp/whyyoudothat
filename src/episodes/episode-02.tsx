import {createEpisode} from './createEpisode';
import script from '../scripts/episode-02.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode02Script = script as EpisodeScript;
export const Episode02 = createEpisode(episode02Script);
