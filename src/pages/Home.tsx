import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
import {useEffect, useState} from "react";
import {fetchPhlist} from "../utilities";

const Home: React.FC = () => {
  const [playList, setPlayList] = useState<any[]>([]);
  const fetchDataInUseEffect = async () => {
    let thePlaylist = await fetchPhlist();
    if (thePlaylist) {
      setPlayList(thePlaylist);
    }
  };

  useEffect(() => {
    fetchDataInUseEffect().catch(console.error);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Playlists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Playlists</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Power Hourr">

          <IonCard routerLink={playList.length ? '/editor/1' : '/loader/1'}>
            <IonCardHeader>
              <IonCardTitle>{playList.length ? 'Edit' : 'Create'} Your Playlist</IonCardTitle>
              <IonCardSubtitle>{playList.length ? playList.length + ' Videos': 'New'}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              Memes, Music and More!
            </IonCardContent>
          </IonCard>
        
        </ExploreContainer>
      </IonContent>
    </IonPage>
  );
};

export default Home;
