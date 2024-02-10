import {
  IonButton, IonCheckbox, IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonReorder, IonReorderGroup, IonRow,
  IonTextarea,
  IonTitle, IonToast,
  IonToolbar, ItemReorderEventDetail, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from "@ionic/react";
import {
  checkmarkOutline
} from 'ionicons/icons';
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistImporter.css";
import {useEffect, useState, useRef} from "react";
import {Storage} from '@ionic/storage';
import {saveAs} from 'file-saver';
import {
  storePhlist,
  fetchPhlist,
  storePlaylistInfo,
  fetchPlaylistInfo,
  fetchInterstitial,
  interleave,
  storeInterstitial
} from '../utilities';

const PlaylistImporter: React.FC = () => {
  const effectRan = useRef(false);
  const isDebouncing = useRef(false);
  const theCurrentId = useRef(0);
  const inputRef = useRef(null);
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
  const [filename, setFilename] = useState("playlist.json");
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchDataInUseEffect = async () => {
    let thePlaylistInfo = await fetchPlaylistInfo();
    if (thePlaylistInfo) {
      setListId(thePlaylistInfo.id);
    }
    const fetchedPlayList = await fetchPhlist();
    setExportCode(JSON.stringify(fetchedPlayList || []));
  };

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

  const handleSaveButtonClick = () => {
    const adjustedFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    // Create a Blob containing the JSON data
    const blob = new Blob([exportCode], {type: 'application/json'});
    // Trigger the "Save As" dialog
    saveAs(blob, adjustedFilename);
  };
  // @ts-ignore
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Current file input', e.target.files[0]);
    if (file) {
      // Read the content of the file
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          // Parse the JSON content of the file
          // @ts-ignore
          const jsonObject = JSON.parse(event.target.result);

          // Use the parsed object in your application
          // @ts-ignore
          setImportCode(event.target.result);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          setToastMessage('JSON format error.');
          setIsToastOpen(true);
        }
      };

      reader.readAsText(file);
    }
  };

  const storeMyPlaylist = async (playlist: any) => {
    const fetchedPlayList = await fetchPhlist();
    await storePhlist(fetchedPlayList);
  };

  const formatPlaylistForExport = async (withInterstitial: boolean) => {
    let theInterstitial = await fetchInterstitial();
    const thePlaylist = await fetchPhlist();
    if (thePlaylist) {
      if (theInterstitial && withInterstitial && theInterstitial.videoId) {
        setExportCode(JSON.stringify(interleave(thePlaylist, theInterstitial)));
      } else {
        setExportCode(JSON.stringify(thePlaylist));
      }
    }
  };

  const importPlaylist = async (playlist: any) => {

    // check if playlist has multiples of the same videoId
    const duplicates = playlist
      .map((e: { [x: string]: any; }) => e['videoId'])
      .map((e: any, i: any, final: string | any[]) => final.indexOf(e) !== i && i)
      .filter((obj: string | number) => playlist[obj])
      .map((e: string | number) => playlist[e])
    let filteredArr = [];

    console.log('Duplicates:', duplicates);
    if (duplicates.length) {
      // Remove all instances of duplicate video
      filteredArr = playlist.filter((obj: { videoId: any; }) => obj.videoId !== duplicates[0].videoId);
      // Store de-interstitialized playlist as phlist
      await storePhlist(filteredArr);
      // Store interstitial
      await storeInterstitial({
        end: duplicates[0].end,
        length: duplicates[0].length,
        start: duplicates[0].start,
        title: duplicates[0].title,
        videoId: duplicates[0].videoId
      });
    } else {
      await storePhlist(playlist);
    }
    setToastMessage(`Imported ${filteredArr.length ? filteredArr.length : playlist.length} videos!`);
    setIsToastOpen(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Import/Export Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Import/Export</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Import/Export Page">
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="6" >
                <h2>Import Playlist</h2>
                {/*<IonList>
                  <IonItem>
                    {<IonTextarea
                      className="import-code"
                      autoGrow={true}
                      value={importCode}
                      onBlur={(e) => {
                        // @ts-ignore
                        setImportCode(e.target.value);
                      }}></IonTextarea>}
                  </IonItem>
                </IonList>*/}

                <input id="playlist-upload" className="hidden" ref={inputRef} type="file" accept=".json" onChange={handleFileChange}/>
                { /* @ts-ignore */ }
                <IonButton onClick={()=>{inputRef.current.click()}}>{importCode && <IonIcon aria-hidden="true" icon={checkmarkOutline} />}Upload</IonButton>
                <IonButton onClick={(e) => {
                  let playListString = '';
                  try {
                    playListString = JSON.parse(importCode);
                  } catch (exception) {
                    console.error('JSON format error.', importCode)
                    setToastMessage('JSON format error.');
                    setIsToastOpen(true);
                    return;
                  }
                  console.log('Playlist string:', playListString);
                  importPlaylist(playListString).catch(console.error);
                }}>Import</IonButton>
              </IonCol>
              <IonCol size="12" size-sm="6" >
                <h2>Export Playlist</h2>
                <IonList>
                  {/*<IonItem>
                    <IonTextarea className="export-code" autoGrow={true} value={exportCode}></IonTextarea>
                  </IonItem>*/}
                  <IonItem>
                    <IonCheckbox checked={includeInterstitial} onClick={(e) => {
                      setIncludeInterstitial(!includeInterstitial);
                      formatPlaylistForExport(!includeInterstitial).catch(console.error);
                    }}>Include interstitial?</IonCheckbox>
                  </IonItem>
                  <IonItem>
                    <IonInput label="Filename" value={filename} onIonChange={(e) => {
                      // @ts-ignore
                      setFilename(e.target.value);
                    }}></IonInput>
                  </IonItem>
                </IonList>
                <IonButton onClick={() => {
                  return handleSaveButtonClick();
                }}>Export</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonToast
            isOpen={isToastOpen}
            message={toastMessage}
            position="top"
            positionAnchor="header"
            onDidDismiss={() => setIsToastOpen(false)}
            duration={5000}
          ></IonToast>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistImporter;
