import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistPlayer.css";
import {useEffect, useState, useRef} from "react";
import {fetchPhlist, fetchInterstitial} from "../utilities";

const interleave = (arr:any[], x: any) => arr.flatMap(e => [e, x]).slice(0, -1);

const PlaylistPlayer: React.FC = () => {
  const effectRan = useRef(false);
  const debouncing = useRef(false);
  const currentId = useRef(0);
  const [videoId, setVideoId] = useState('AjWfY7SnMBI');
  const [playList, setPlayList] = useState<any[]>([]);
  let opts = useRef({});

  useEffect(() => {

    if (!effectRan.current) {
      console.log("effect applied - only on the FIRST mount");
    }

    // declare the data fetching function
    const fetchDataInUseEffect = async () => {
      let theInterstitial = await fetchInterstitial();
      let thePlaylist = await fetchPhlist();
      if (thePlaylist) {
        if(theInterstitial) {
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
          autoplay: 1,
          start: thePlaylist[currentId.current].start,
          end: thePlaylist[currentId.current].end,
          controls: 0,
          iv_load_policy: 3,
          rel: 0
        },
      };
    }

    // call the function, making sure to catch any error
    fetchDataInUseEffect().catch(console.error);

    return () => {
      effectRan.current = true;
    };
  }, []);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    console.log("onPlayerReady is called!");
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
        setVideoId(playList[currentId.current].videoId);
        opts.current = {
          ...opts.current,
          playerVars: {
            // @ts-ignore
            ...opts.current.playerVars,
            start: playList[currentId.current].start,
            end: playList[currentId.current].end,
          },
        };
      }
    }
  };

  // var updateButton = document.getElementById('update-button');
  //   updateButton.addEventListener('click', function(event) {
  //       var playListString = document.getElementById('playlist-object').value;
  //       try {
  //           playList = JSON.parse(playListString);
  //       }
  //       catch (exception) {
  //           alert('JSON format error. Please check your input and try again.')
  //           return;
  //       }
  //       currentId = 0;
  //       player.loadVideoById({
  //           'videoId': playList[currentId].videoId,
  //           'startSeconds': playList[currentId].start,
  //           'endSeconds': playList[currentId].end
  //       });
  //   });

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
          <YouTube
            videoId={videoId}
            opts={opts.current}
            onReady={onPlayerReady}
            onStateChange={videoPlay}
          />
          <IonButton onClick={() => {
            setVideoId(playList[currentId.current].videoId);
          }}>Play
          </IonButton>
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default PlaylistPlayer;
