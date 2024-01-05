import './ExploreContainer.css';

interface ContainerProps {
  name: string;
  children: any;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, children }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <div>
        {children}
      </div>
    </div>
  );
};

export default ExploreContainer;
