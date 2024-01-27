import {
  IonCol,
  IonContent, IonGrid,
  IonHeader, IonItem, IonLabel,
  IonPage, IonRange, IonRow,
  IonTitle,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup, IonInput, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave
} from "@ionic/react";
import YouTube, {YouTubeProps} from "react-youtube";
import ExploreContainer from "../components/ExploreContainer";
import "./PlaylistEditor.css";
import {useEffect, useState, useRef} from "react";
import {storePhlist, fetchPhlist, storeInterstitial, fetchInterstitial, getLengthOfVideo} from "../utilities";

const PlaylistEditor: React.FC = () => {
    const effectRan = useRef(false);
    const currentId = useRef(0);
    const currentLength = useRef(100);
    const currentRange = useRef({lower: 0, upper: 0});
    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
    const [playList, setPlayList] = useState<any[]>([]);
    //const [opts, setOpts] = useState({});
    const opts = useRef({});
    //const videoId = useRef(playList[currentId.current].videoId);
    const [videoId, setVideoId] = useState('');
    const [interstitial, setInterstitial] = useState({
      end: 0,
      length: 0,
      start: 0,
      title: '',
      videoId: ''
    });

    const fetchDataInUseEffect = async () => {
      let thePlaylist = await fetchPhlist();
      if (thePlaylist) {
        setPlayList(thePlaylist);
      }
      let theInterstitial = await fetchInterstitial();
      if (theInterstitial) {
        setInterstitial(theInterstitial);
      }
      opts.current = {
        height: "390",
        width: "640",
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
          start: playList[currentId.current] ? playList[currentId.current].start : 0,
          //end: playList[currentId.current].end,
          controls: 0,
          iv_load_policy: 3,
          rel: 0,
          mute: 0
        },
      };
      setVideoId(playList[currentId.current] ? playList[currentId.current].videoId : 'AjWfY7SnMBI');
    };

    useEffect(() => {
      if (!effectRan.current) {
        console.log("effect applied - only on the FIRST mount");
      }

      fetchDataInUseEffect().catch(console.error);

      toggleAccordion();

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
      // access to player in all event handlers via event.target
      console.log("onPlayerReady is called!", currentId.current, event.target);
      if ('24 hours + of pure black screen in HD!' !== event.target.videoTitle && '' !== event.target.videoTitle) {
        currentLength.current = Math.floor(event.target.getDuration());
        if (videoId === interstitial.videoId) {
          const updatedInterstitial = {
            ...interstitial,
            title: event.target.videoTitle,
            length: Math.floor(event.target.getDuration())
          };
          setInterstitial(updatedInterstitial);
          storeInterstitial(updatedInterstitial).catch(console.error);
        } else {
          const updatedPlayList = playList.map((item, ix) => {
            return ix === currentId.current ? {
              ...playList[ix],
              title: event.target.videoTitle,
              length: Math.floor(event.target.getDuration())
            } : {...playList[ix]};
          })
          setPlayList(updatedPlayList);
          storePhlist(updatedPlayList).catch(console.error);
        }
      }
    };

    const toggleAccordion = () => {
      if (!accordionGroup.current) {
        return;
      }
      const nativeEl = accordionGroup.current;

      if (nativeEl.value === 'first') {
        nativeEl.value = undefined;
      } else {
        nativeEl.value = 'first';
      }
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
            <IonGrid>
              <IonRow>
                <IonCol size="12" size-sm="6">
                  <IonAccordionGroup ref={accordionGroup} multiple={false}>
                    <IonAccordion value="first">
                      <IonItem slot="header" color="rose">
                        Playlist
                      </IonItem>
                      <div slot="content">
                        {playList.map((d: any, ix) => (
                          <IonItem button key={d.videoId} onClick={() => {
                            currentId.current = ix;
                            currentLength.current = getLengthOfVideo(d);
                            opts.current = {
                              ...opts,
                              playerVars: {
                                // @ts-ignore
                                ...opts.playerVars,
                                autoplay: 1,
                                controls: 0,
                                start: playList[currentId.current].start,
                                end: playList[currentId.current].end,
                              },
                            };
                            setVideoId(d.videoId);
                          }}><IonLabel>{d.title ? d.title : `Video #${1 + ix}`}</IonLabel></IonItem>
                        ))}
                      </div>
                    </IonAccordion>
                    <IonAccordion value="second">
                      <IonItem slot="header" color="rose">
                        Interstitial
                      </IonItem>
                      <div slot="content">
                        <IonItem button key={'interstitial'} onClick={() => {
                          //currentId.current = ix;
                          currentLength.current = getLengthOfVideo(interstitial);
                          opts.current = {
                            ...opts,
                            playerVars: {
                              // @ts-ignore
                              ...opts.playerVars,
                              autoplay: 1,
                              controls: 0,
                              start: interstitial.start,
                              end: interstitial.end,
                            },
                          };
                          setVideoId(interstitial.videoId);
                        }}>
                          <IonLabel>{interstitial.videoId && interstitial.title ? interstitial.title : '--'}</IonLabel>
                        </IonItem>
                        <IonItem>
                          <IonInput label="VideoID" type="text" placeholder="e.g., dQw4w9WgXcQ"
                                    value={interstitial.videoId} onIonInput={(ev: Event) => {
                            const value = (ev.target as HTMLIonInputElement).value as string;
                            const updatedInterstitial = {
                              ...interstitial,
                              videoId: value
                            };
                            setInterstitial(updatedInterstitial);
                            storeInterstitial(updatedInterstitial).catch(console.error);
                          }}></IonInput>
                        </IonItem>
                      </div>
                    </IonAccordion>
                  </IonAccordionGroup>
                </IonCol>
                <IonCol size="12" size-sm="6">
                  <div className={"position-fixed"}>
                    <YouTube
                      videoId={videoId}
                      opts={opts.current}
                      onReady={onPlayerReady}
                    />
                    {videoId !== interstitial.videoId ? (
                      <IonRange
                        aria-label="Dual Knobs Range"
                        dualKnobs={true}
                        disabled={'AjWfY7SnMBI' === videoId || '' === videoId}
                        min={0}
                        max={currentLength.current}
                        onIonChange={
                          ({detail}) => {
                            console.log('ionChange emitted value: ', detail.value);
                            if (playList[currentId.current]) {
                              // update YouTube playhead
                              // @ts-ignore
                              if (currentRange.current.lower !== detail.value.lower) {
                                opts.current = {
                                  ...opts,
                                  playerVars: {
                                    // @ts-ignore
                                    ...opts.playerVars,
                                    autoplay: 1,
                                    controls: 0,
                                    // @ts-ignore
                                    start: detail.value.lower,
                                    // @ts-ignore
                                    end: detail.value.upper,
                                    // @ts-ignore
                                    //end: detail.value.lower + 60,
                                  },
                                };
                                // @ts-ignore
                                currentRange.current.upper = Math.min(detail.value.lower + 60, getLengthOfVideo(playList[currentId.current]));
                                // @ts-ignore
                                currentRange.current.lower = detail.value.lower;
                                // @ts-ignore
                              } else if (currentRange.current.upper !== detail.value.upper) {
                                opts.current = {
                                  ...opts,
                                  playerVars: {
                                    // @ts-ignore
                                    ...opts.playerVars,
                                    autoplay: 1,
                                    controls: 0,
                                    // @ts-ignore
                                    start: detail.value.upper,
                                    // @ts-ignore
                                    end: getLengthOfVideo(playList[currentId.current])
                                  },
                                };
                                // @ts-ignore
                                currentRange.current.upper = detail.value.upper;
                                // @ts-ignore
                                currentRange.current.lower = Math.max(0, detail.value.upper - 60);
                              }

                              const updatedPlayList = playList.map((item, ix) => {
                                return ix === currentId.current ? {
                                  ...playList[ix],
                                  // @ts-ignore
                                  start: currentRange.current.lower,
                                  // @ts-ignore
                                  end: currentRange.current.upper
                                  // @ts-ignore
                                  //end: detail.value.lower + 60
                                } : {...playList[ix]};
                              })
                              setPlayList(updatedPlayList);
                              storePhlist(updatedPlayList).catch(console.error);
                            }
                          }
                        }
                        value={{
                          lower: playList[currentId.current] ? playList[currentId.current].start : 0,
                          upper: playList[currentId.current] ? playList[currentId.current].end : 0,
                        }}
                      ></IonRange>
                    ) : (
                      <IonRange
                        aria-label="Dual Knob Range"
                        dualKnobs={true}
                        disabled={'AjWfY7SnMBI' === videoId || '' === videoId}
                        min={0}
                        max={currentLength.current}
                        value={{
                          lower: interstitial ? interstitial.start : 0,
                          upper: interstitial ? interstitial.end : 0
                        }}
                        onIonChange={({detail}) => {
                          console.log('Interstitial range change.');
                          if (interstitial) {
                            // update YouTube playhead
                            // @ts-ignore
                            if (currentRange.current.lower !== detail.value.lower) {
                              opts.current = {
                                ...opts,
                                playerVars: {
                                  // @ts-ignore
                                  ...opts.playerVars,
                                  autoplay: 1,
                                  controls: 0,
                                  // @ts-ignore
                                  start: detail.value.lower,
                                  // @ts-ignore
                                  end: detail.value.upper,
                                  // @ts-ignore
                                  //end: detail.value.lower + 60,
                                },
                              };
                              // @ts-ignore
                              currentRange.current.upper = detail.value.upper;
                              // @ts-ignore
                              currentRange.current.lower = detail.value.lower;
                              // @ts-ignore
                            } else if (currentRange.current.upper !== detail.value.upper) {
                              opts.current = {
                                ...opts,
                                playerVars: {
                                  // @ts-ignore
                                  ...opts.playerVars,
                                  autoplay: 1,
                                  controls: 0,
                                  // @ts-ignore
                                  start: detail.value.upper,
                                  // @ts-ignore
                                  end: getLengthOfVideo(playList[currentId.current])
                                },
                              };
                              // @ts-ignore
                              currentRange.current.upper = detail.value.upper;
                              // @ts-ignore
                              currentRange.current.lower = detail.value.lower;
                            }

                            const updatedInterstitial = {
                              ...interstitial,
                              // @ts-ignore
                              start: currentRange.current.lower,
                              // @ts-ignore
                              end: currentRange.current.upper
                            };
                            setInterstitial(updatedInterstitial);
                            storeInterstitial(updatedInterstitial).catch(console.error);
                          }
                        }}>
                      </IonRange>
                    )
                    }</div>
                  <p>Copyright</p>
                  <p>&copy; 2024</p>
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
