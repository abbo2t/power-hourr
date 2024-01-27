import './ExploreContainer.css';

interface ContainerProps {
  name: string;
  children: any;
}

const ExploreContainer: React.FC<ContainerProps> = ({name, children}) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <div>
        {children}
      </div>
      <br/><br/><br/><br/>
    </div>
  );
};

export default ExploreContainer;
