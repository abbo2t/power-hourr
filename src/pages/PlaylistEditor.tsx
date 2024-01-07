import {
  IonButton,
  IonCol,
  IonContent, IonGrid,
  IonHeader, IonItem,
  IonPage, IonRange, IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistPlayer.css";
import {useEffect, useState, useRef} from "react";
import {Storage} from '@ionic/storage';

let playList: any[] = [
  /*{
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
  },*/
];

const fetchThePlaylist = async () => {
  const store = new Storage();
  await store.create();

  let fetchedPlaylist = await store.get('playlist');
  return fetchedPlaylist;
};

const PlaylistEditor: React.FC = () => {
    const effectRan = useRef(false);
    const debouncing = useRef(false);
    const currentId = useRef(0);
    const currentLength = useRef(100);
    const opts = useRef({});
    //const videoId = useRef(playList[currentId.current].videoId);
    const [videoId, setVideoId] = useState('');


    useEffect(() => {

      if (true || !effectRan.current) {
        console.log("effect applied - only on the FIRST mount");
      }

      // declare the data fetching function
      const fetchData = async () => {
        let thePlaylist = await fetchThePlaylist();
        if (thePlaylist) {
          playList = thePlaylist;
          console.log('the playlist: ', thePlaylist);
        }
        opts.current = {
          height: "390",
          width: "640",
          playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            start: playList[currentId.current].start,
            //end: playList[currentId.current].end,
            controls: 1,
            iv_load_policy: 3,
            rel: 0,
            mute: 0
          },
        };
        //setVideoId(playList[currentId.current].videoId);
      }

      // call the function, making sure to catch any error
      fetchData().catch(console.error);

      return () => {
        effectRan.current = true;
      };
    }, []);

    const getLengthOfCurrentVideo = () => {
      return playList[currentId.current] && playList[currentId.current].length
        ? Math.floor(playList[currentId.current].length)
        : 100
    };

    const storePhlist = async () => {
      const store = new Storage();
      await store.create();

      await store.set('playlist', playList);
    };

    const onPlayerReady: YouTubeProps["onReady"] = (event) => {
      // access to player in all event handlers via event.target
      console.log("onPlayerReady is called!", currentId.current, event.target);
      //console.log(event.target)
      //event.target.pauseVideo();
      //let thePlaylist = await fetchThePlaylist();
      //console.log(thePlaylist);
      if ('24 hours + of pure black screen in HD!' !== event.target.videoTitle && '' !== event.target.videoTitle) {
        playList[currentId.current].title = event.target.videoTitle;
        playList[currentId.current].length = Math.floor(event.target.getDuration());
        console.log('PlayList Items:', playList);
        // call the function
        storePhlist()
          // make sure to catch any error
          .catch(console.error);
      }
    };

    const videoPlay = (event: any) => {
      console.log(`Entering videoPlay function with event.data = ${event.data}`);
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
            <IonTitle>Edit Playlist</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Edit</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ExploreContainer name="Playlist Player Page">
            <h2>Edit your playlist</h2>
            <IonGrid>
              <IonRow>
                <IonCol>
                  {playList.map((d, ix) => (
                    <IonItem key={d.videoId}>{d.title ? d.title : d.videoId}<IonButton onClick={() => {
                      //opts.current = {...opts.current, controls: '0'}
                      setVideoId(d.videoId);
                      console.log(ix);
                      currentId.current = ix;
                      currentLength.current = getLengthOfCurrentVideo();
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
                    }}>Play</IonButton></IonItem>
                  ))}
                  <IonButton onClick={() => {
                    // @ts-ignore
                    opts.current = {...opts.current, playerVars: {...opts.current.playerVars, autoplay: 0}};
                    setVideoId('AjWfY7SnMBI');
                  }}>Load</IonButton>
                </IonCol>
                <IonCol>
                  <YouTube
                    videoId={videoId}
                    opts={opts.current}
                    onReady={onPlayerReady}
                    onStateChange={videoPlay}
                  />
                  <IonRange
                    aria-label="Dual Knobs Range"
                    dualKnobs={true}
                    min={0}
                    max={currentLength.current}
                    onIonChange={
                      ({detail}) => {
                        console.log('ionChange emitted value: ', detail.value);
                        if (playList[currentId.current]) {
                          // @ts-ignore
                          playList[currentId.current].start = detail.value.lower;
                          // @ts-ignore
                          playList[currentId.current].end = detail.value.upper;
                          // @ts-ignore
                          playList[currentId.current].end = detail.value.lower + 60;
                          storePhlist().catch(console.error);
                        }
                      }
                    }
                    onIonKnobMoveStart={
                      ({detail}) => {
                        console.log('ionKnobMoveStart:', detail.value)
                      }
                    }
                    onIonKnobMoveEnd={
                      ({detail}) => {
                        console.log('ionKnobMoveEnd:', detail.value)
                      }
                    }
                    value={{
                      lower: playList[currentId.current] ? playList[currentId.current].start : 0,
                      upper: playList[currentId.current] ? playList[currentId.current].end : 0,
                    }}
                  ></IonRange><p>Copyright</p><p>&copy; 2024</p>
                  {/*
                  <IonButton onClick={() => {
                    //opts.current = {...opts.current, controls: '0'}
                    setVideoId(playList[currentId.current].videoId);
                  }}>Play</IonButton>
                  */}
                </IonCol>
              </IonRow>
            </IonGrid>

          </ExploreContainer>
        </IonContent>
      </IonPage>
    );
  }
;

export default PlaylistEditor;
