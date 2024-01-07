import {
  IonButton,
  IonContent,
  IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonReorder, IonReorderGroup,
  IonTitle,
  IonToolbar, ItemReorderEventDetail,
} from "@ionic/react";
import YouTube, { YouTubeProps } from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistLoader.css";
import { useEffect, useState, useRef } from "react";
import { Storage } from '@ionic/storage';

const PlaylistLoader: React.FC = () => {
  const effectHasRun = useRef(false);
  const isDebouncing = useRef(false);
  const theCurrentId = useRef(0);
  //const videoId = useRef(playList[currentId.current].videoId);
  const [videoId, setVideoId] = useState('');
  const myOptions = useRef<YouTubeProps["opts"]>({
    height: "195",
    width: "320",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 1,
      iv_load_policy: 3,
      rel: 0,
      listType: 'playlist',
      list: 'PL8sCGko3uCsUZJKEGgy20SItUZQGpUPz0'
    },
  });

  const storeMyPlaylist = async (playlist: any) => {
    const store = new Storage();
    await store.create();

    // await store.set('playlist', [{
    //     videoId: playlist[0],
    //     start: 50,
    //     end: 60
    // },
    // {
    //     videoId: playlist[1],
    //     start: 31,
    //     end: 35
    // }]);

    // @ts-ignore
    await store.set('playlist', playlist.map((item, index) => {
      return {
        videoId: item,
        start: 1,
        end: 61

      }
    }));
  };

  const onMyPlayerReady: YouTubeProps["onReady"] = async (event) => {
    // access to player in all event handlers via event.target
    console.log("onPlayerReady is called!");
    const myPlaylist = event.target.getPlaylist();
    console.log(myPlaylist);
    await storeMyPlaylist(myPlaylist);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Load</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Editor Page">
          <h2>Load your playlist</h2>
          <div className={"hidden"}>
          <YouTube
              opts={myOptions.current}
              onReady={onMyPlayerReady}
          />
          </div>
          <IonList>
          </IonList>
          <IonButton onClick={() => {
            //opts.current = {...opts.current, controls: '0'}
            //setVideoId(playList[currentId.current].videoId);
          }}>Save</IonButton>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistLoader;
