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
import "./Tab1.css";

const Tab1: React.FC = () => {
  let playlist: string | any[] = [];
  let editing = playlist && playlist.length;
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

          <IonCard routerLink={editing ? '/editor/1' : '/loader/1'}>
            <IonCardHeader>
              <IonCardTitle>{editing ? 'Edit' : 'Create'} Your Playlist</IonCardTitle>
              <IonCardSubtitle>{editing ? playlist.length + ' Videos': 'New'}</IonCardSubtitle>
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

export default Tab1;
