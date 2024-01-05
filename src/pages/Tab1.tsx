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
        <ExploreContainer name="Playlists Page">

          <IonCard  routerLink="/editor/1">
            <IonCardHeader>
              <IonCardTitle>New Year's Eve 2023</IonCardTitle>
              <IonCardSubtitle>60 Tracks</IonCardSubtitle>
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
