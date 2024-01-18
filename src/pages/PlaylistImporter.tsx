import {
  IonButton, IonCheckbox, IonCol,
  IonContent, IonGrid,
  IonHeader, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonReorder, IonReorderGroup, IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar, ItemReorderEventDetail,
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistImporter.css";
import {useEffect, useState, useRef} from "react";
import {Storage} from '@ionic/storage';
import {storePhlist, fetchPhlist, storePlaylistInfo, fetchPlaylistInfo, fetchInterstitial, interleave} from '../utilities';

const PlaylistImporter: React.FC = () => {
  const effectRan = useRef(false);
  const isDebouncing = useRef(false);
  const theCurrentId = useRef(0);
  const [videoId, setVideoId] = useState('');
  const [listId, setListId] = useState('');
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
  const [importCode, setImportCode] = useState("");
  const [exportCode, setExportCode] = useState("");
  const [includeInterstitial, setIncludeInterstitial] = useState(false);

  useEffect(() => {
    if (!effectRan.current) {
      console.log("effect applied - only on the FIRST mount");
    }

    const fetchDataInUseEffect = async () => {
      let thePlaylistInfo = await fetchPlaylistInfo();
      if (thePlaylistInfo) {
        setListId(thePlaylistInfo.id);
      }
      const fetchedPlayList = await fetchPhlist();
      setExportCode(JSON.stringify(fetchedPlayList));
    }

    fetchDataInUseEffect().catch(console.error);

    return () => {
      effectRan.current = true;
    };
  }, []);

  const storeMyPlaylist = async (playlist: any) => {
    const fetchedPlayList = await fetchPhlist();
    await storePhlist(fetchedPlayList);
  };

  const formatPlaylistForExport = async (withInterstitial: boolean) => {
    let theInterstitial = await fetchInterstitial();
    const thePlaylist = await fetchPhlist();
    if (thePlaylist) {
      if (theInterstitial && withInterstitial) {
        setExportCode(JSON.stringify(interleave(thePlaylist, theInterstitial)));
      } else {
        setExportCode(JSON.stringify(thePlaylist));
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Export Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Import/Export</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Exporter Page">
          <h2>Export Your Playlist</h2>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offsetSm="2">
                <IonList>
                  <IonItem>
                    <IonTextarea className="export-code" autoGrow={true} value={exportCode}></IonTextarea>
                  </IonItem>
                  <IonItem>
                    <IonCheckbox checked={includeInterstitial} onClick={(e) => {
                      setIncludeInterstitial(!includeInterstitial);
                      formatPlaylistForExport(!includeInterstitial).catch(console.error);
                    }}>Include interstitial?</IonCheckbox>
                  </IonItem>
                </IonList>
                <IonButton onClick={() => {
                }}>Export</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <h2>Import Your Playlist</h2>
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8" offsetSm="2">
                <IonList>
                  <IonItem>
                    <IonTextarea className="import-code" autoGrow={true} value={importCode}></IonTextarea>
                  </IonItem>
                </IonList>
                <IonButton onClick={() => {
                }}>Import</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistImporter;
