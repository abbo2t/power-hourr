import {Storage} from "@ionic/storage";

export const storePhlist = async (phlist: any) => {
    console.log('STORING PHLIST');
    const store = new Storage();
    await store.create();
    //console.log(phlist);
    await store.set('playlist', phlist);
    console.log('==============');
};

export const fetchPhlist = async () => {
    console.log('FETCHING PHLIST');
    const store = new Storage();
    await store.create();
    let fetchedPlaylist = await store.get('playlist');
    //console.log(fetchedPlaylist);
    console.log('==============');
    return fetchedPlaylist;
};

export const storeInterstitial = async (interstitial: any) => {
    console.log('STORING INTERSTITIAL');
    const store = new Storage();
    await store.create();
    //console.log(interstitial);
    await store.set('interstitial', interstitial);
    console.log('==============');
};

export const fetchInterstitial = async () => {
    console.log('FETCHING INTERSTITIAL');
    const store = new Storage();
    await store.create();
    let fetchedInterstitial = await store.get('interstitial');
    //console.log(fetchedInterstitial);
    console.log('==============');
    return fetchedInterstitial;
};

export const storePlaylistInfo = async (playlistInfo: any) => {
    console.log('STORING PLAYLIST INFO');
    const store = new Storage();
    await store.create();
    //console.log(playlistInfo);
    await store.set('playlistInfo', playlistInfo);
    console.log('==============');
};

export const fetchPlaylistInfo = async () => {
    console.log('FETCHING PLAYLIST INFO');
    const store = new Storage();
    await store.create();
    let fetchedPlaylistInfo = await store.get('playlistInfo');
    //console.log(fetchedPlaylistInfo);
    console.log('==============');
    return fetchedPlaylistInfo;
};

export const getLengthOfVideo = (video: any) => {
    return video && video.length
        ? Math.floor(video.length)
        : 100
};

export const interleave = (arr: any[], x: any) => arr.flatMap(e => [e, x]).slice(0, -1);
