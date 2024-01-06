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
import "./PlaylistEditor.css";
import { useEffect, useState, useRef } from "react";

const playList = [
  {
    videoId: "dBK0gKW61NU",
    start: 222,
    end: 224,
  },
  {
    videoId: "LtCfuHLrixY",
    start: 210,
    end: 213,
  },
  {
    videoId: "pU_nCvEq_Y4",
    start: 18526,
    end: 18529,
  },
  {
    videoId: "EHpxi7khHb0",
    start: 3008,
    end: 3010,
  },
];

const PlaylistEditor: React.FC = () => {
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

  const onMyPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    console.log("onPlayerReady is called!");
    console.log(event.target.getPlaylist())
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
            <IonTitle size="large">Edit</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Editor Page">
          <h2>Edit your playlist</h2>
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

export default PlaylistEditor;
