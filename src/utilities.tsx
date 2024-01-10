import {Storage} from "@ionic/storage";

export const storePhlist = async (phlist: any) => {
    console.log('STORING PHLIST');
    const store = new Storage();
    await store.create();
    console.log(phlist);
    await store.set('playlist', phlist);
    console.log('==============');
};

export const fetchPhlist = async () => {
    console.log('FETCHING PHLIST');
    const store = new Storage();
    await store.create();
    let fetchedPlaylist = await store.get('playlist');
    console.log(fetchedPlaylist);
    console.log('==============');
    return fetchedPlaylist;
};

export const getLengthOfVideo = (video: any) => {
    return video && video.length
        ? Math.floor(video.length)
        : 100
};
