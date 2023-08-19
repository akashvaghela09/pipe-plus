import { channel } from "./channel";
import { feed } from "./feed";
import { group } from "./group";
import { playlist } from "./playlist";
import { stream } from "./stream";
import { user } from "./user";

export const pipePlus = {
    stream: stream,
    channel: channel,
    feed: feed,
    group: group,
    playlist: playlist,
    user: user
}
