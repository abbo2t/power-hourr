import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave,
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistPlayer.css";
import {useEffect, useState, useRef} from "react";
import {fetchPhlist, fetchInterstitial, interleave} from "../utilities";


const PlaylistPlayer: React.FC = () => {
  const effectRan = useRef(false);
  const debouncing = useRef(false);
  const currentId = useRef(0);
  const opts = useRef({});
  const [videoId, setVideoId] = useState('AjWfY7SnMBI');
  const [playList, setPlayList] = useState<any[]>([]);
  const [fullscreen, setFullscreen] = useState(false);


  // declare the data fetching function
  const fetchDataInUseEffect = async () => {
    let theInterstitial = await fetchInterstitial();
    let thePlaylist = await fetchPhlist();
    if (thePlaylist) {
      if (theInterstitial && theInterstitial.videoId) {
        setPlayList(interleave(thePlaylist, theInterstitial));
      } else {
        setPlayList(thePlaylist);
      }
    }

    opts.current = {
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
        start: thePlaylist[currentId.current].start,
        end: thePlaylist[currentId.current].end,
        controls: 0,
        iv_load_policy: 3,
        rel: 0
      },
    };
  };

  useEffect(() => {

    if (!effectRan.current) {
      console.log("effect applied - only on the FIRST mount");
    }

    // call the function, making sure to catch any error
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

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    console.log("onPlayerReady is called!", event.target);
    if(event.target.getVideoData()) {
      console.log('Video Error Code', event.target.getVideoData().errorCode);
      // If error, go to next video
      if( event.target.getVideoData().errorCode ) {
        debouncing.current = false;
        videoPlay({data: YouTube.PlayerState.ENDED});
      }
    }
  };

  const videoPlay = (event: any) => {
    console.log("Entering videoPlay function with event.data = " + event.data);
    if (event.data == YouTube.PlayerState.PLAYING) {
      debouncing.current = false;
      console.log("YouTube Video is PLAYING!!");
    }
    if (event.data == YouTube.PlayerState.PAUSED) {
      console.log("YouTube Video is PAUSED!!");
    }

    // after loading next video, before startin the next one, one extra end event will be passed,
    // so need this debouncing logic
    if (debouncing.current) return;
    if (event.data == YouTube.PlayerState.ENDED) {
      debouncing.current = true;
      console.log("YouTube Video is ENDING!!");
      currentId.current = 1 + currentId.current;
      if (playList[currentId.current]) {
        opts.current = {
          ...opts.current,
          playerVars: {
            // @ts-ignore
            ...opts.current.playerVars,
            start: playList[currentId.current].start,
            end: playList[currentId.current].end,
          },
        };
        setVideoId(playList[currentId.current].videoId);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Play Playlist</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Play</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Playlist Player Page">
          <h2>Play your playlist</h2>
          <div className={fullscreen ? 'fullscreen' : ''}>
          <YouTube
            videoId={videoId}
            opts={opts.current}
            onReady={onPlayerReady}
            onStateChange={videoPlay}
          />
          </div>
          <IonButton className="play-button" disabled={currentId.current == 0
            && playList[currentId.current]
            && playList[currentId.current].videoId === videoId}
                     onClick={() => {
                       currentId.current = 0;
                       opts.current = {
                         ...opts.current,
                         playerVars: {
                           // @ts-ignore
                           ...opts.current.playerVars,
                           autoplay: 1,
                           start: playList[currentId.current].start,
                           end: playList[currentId.current].end,
                         },
                       };
                       setVideoId(playList[currentId.current].videoId);
                     }}>{currentId.current == 0
            && playList[currentId.current] ? 'Play' : 'Restart'}
          </IonButton>
          <IonButton className={fullscreen ? 'fullscreen-button' : ''} onClick={() => {
            setFullscreen(!fullscreen);
          }}>
            Fullscreen
          </IonButton>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistPlayer;
