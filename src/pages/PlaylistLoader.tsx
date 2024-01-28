import {
  IonButton, IonCol,
  IonContent, IonGrid,
  IonHeader, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonReorder, IonReorderGroup, IonRow,
  IonTitle, IonToast,
  IonToolbar, ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistLoader.css";
import {useEffect, useState, useRef} from "react";
import {Storage} from '@ionic/storage';
import {storePhlist, fetchPhlist, storePlaylistInfo, fetchPlaylistInfo, fetchInterstitial} from '../utilities';

const PlaylistLoader: React.FC = () => {
  const effectRan = useRef(false);
  const isDebouncing = useRef(false);
  const theCurrentId = useRef(0);
  const [videoId, setVideoId] = useState('');
  const [listId, setListId] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [myOptions, setMyOptions] = useState<YouTubeProps["opts"]>({
    height: "195",
    width: "320",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      iv_load_policy: 3,
      rel: 0,
      listType: 'playlist',
      // list: 'PL8sCGko3uCsUZJKEGgy20SItUZQGpUPz0'
      list: ''
    },
  });

  const fetchDataInUseEffect = async () => {
    let thePlaylistInfo = await fetchPlaylistInfo();
    if (thePlaylistInfo) {
      setListId(thePlaylistInfo.id);
    }
  }

  useEffect(() => {
    if (!effectRan.current) {
      console.log("effect applied - only on the FIRST mount");
    }

    fetchDataInUseEffect().catch(console.error);

    return () => {
      effectRan.current = true;
    };
  }, []);

  useIonViewDidEnter(() => {
    console.log('ionViewDidEnter event fired');
  });

  useIonViewDidLeave(() => {
    console.log('ionViewDidLeave event fired');
  });

  useIonViewWillEnter(() => {
    console.log('ionViewWillEnter event fired');
    fetchDataInUseEffect().catch(console.error);
  });

  useIonViewWillLeave(() => {
    console.log('ionViewWillLeave event fired');
  });

  const storeMyPlaylist = async (playlist: any) => {
    const store = new Storage();
    await store.create();

    const fetchedPlayList = await fetchPhlist();
    if (typeof fetchedPlayList === 'undefined' || null === fetchedPlayList) {
      await storePhlist(playlist);
      return;
    }

    // @ts-ignore
    const updatedPlayList = playlist.map((item, index) => {
      const i = fetchedPlayList.findIndex((e: { videoId: any; }) => e.videoId === item);
      if (i > -1) {
        return {
          ...fetchedPlayList[i]
        }
      }

      return {
        videoId: item,
        start: 1,
        end: 61
      }
    });

    await storePhlist(updatedPlayList);
  };

  const onMyPlayerReady: YouTubeProps["onReady"] = async (event) => {
    // access to player in all event handlers via event.target
    console.log("onPlayerReady is called!");
    event.target.mute();
    if (event.target.getPlaylist()) {
      const myPlaylist = event.target.getPlaylist();
      console.log('got playlist', myPlaylist, event.target);
      await storeMyPlaylist(myPlaylist);
      setToastMessage(`Loaded ${myPlaylist.length} videos.`);
      setIsToastOpen(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Load Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Load</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Loader Page">
          <h2>Load your playlist</h2>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offsetSm="2">
                <div className={"hidden"}>
                  <YouTube
                    opts={myOptions}
                    onReady={onMyPlayerReady}
                  />
                </div>
                <IonList>
                  <IonItem>
                    <IonInput label="Playlist URL" placeholder="Enter playlist URL" value={(() => {
                      return `https://www.youtube.com/watch?v=L_XJ_s5IsQc&list=${listId}`;
                    })()}
                              onIonBlur={(ev: Event) => {
                                const value = (ev.target as HTMLIonInputElement).value as string;
                                let regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
                                let match = value.match(regExp);
                                if (match && match[2]) {
                                  setListId(match[2]);
                                } else {
                                  setToastMessage('Inavlid Playlist URL.');
                                  setIsToastOpen(true);
                                }
                              }}></IonInput>
                  </IonItem>
                </IonList>
                <IonButton onClick={() => {
                  const updatedOptions = {
                    ...myOptions,
                    playerVars: {
                      // @ts-ignore
                      ...myOptions.playerVars,
                      'list': listId
                    },
                  };
                  setMyOptions(updatedOptions);
                  storePlaylistInfo({'id': listId}).catch(console.error);
                  console.log(myOptions);
                }}>Load</IonButton>
              </IonCol>
              <IonToast
                isOpen={isToastOpen}
                message={toastMessage}
                position="top"
                positionAnchor="header"
                onDidDismiss={() => setIsToastOpen(false)}
                duration={5000}
              ></IonToast>
            </IonRow>
          </IonGrid>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistLoader;
