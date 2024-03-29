import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import {
  listOutline,
  libraryOutline,
  personOutline,
  createOutline,
  playCircleOutline,
  reloadOutline, downloadOutline, homeOutline
} from 'ionicons/icons';
import Home from './pages/Home';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import PlaylistLoader from './pages/PlaylistLoader';
import PlaylistPlayer from './pages/PlaylistPlayer';
import PlaylistEditor from "./pages/PlaylistEditor";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import PlaylistImporter from "./pages/PlaylistImporter";


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactHashRouter basename={typeof window !== 'undefined' && window.location.pathname.startsWith('/power-hourr') ? '/power-hourr' : ''}>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route path="/play/:id">
            <PlaylistPlayer />
          </Route>
          <Route path="/loader/:id">
            <PlaylistLoader />
          </Route>
          <Route path="/editor/:id">
            <PlaylistEditor />
          </Route>
          <Route path="/export/:id">
            <PlaylistImporter />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab0" href="/home">
            <IonIcon aria-hidden="true" icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab1" href="/editor/1">
            <IonIcon aria-hidden="true" icon={createOutline} />
            <IonLabel>Edit</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/play/1">
            <IonIcon aria-hidden="true" icon={playCircleOutline} />
            <IonLabel>Play</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/loader/1">
            <IonIcon aria-hidden="true" icon={reloadOutline} />
            <IonLabel>Load</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/export/1">
            <IonIcon aria-hidden="true" icon={downloadOutline} />
            <IonLabel>Import</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactHashRouter>
  </IonApp>
);

export default App;
