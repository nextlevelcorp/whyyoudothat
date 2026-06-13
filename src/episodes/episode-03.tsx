import {createEpisode} from './createEpisode';
import script from '../scripts/episode-03.json';
import type {EpisodeScript} from '../scripts/schema';

export const episode03Script = script as EpisodeScript;
export const Episode03 = createEpisode(episode03Script);
