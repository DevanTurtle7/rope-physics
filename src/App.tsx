import {useEffect, useState} from 'react';
import Tile from './Tile';

const TILE_SIZE = 20;
const HEIGHT_ERR = 4;

function App() {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const updateDimensions = () => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);

    console.log(width, height);
  };

  const evenDivide = (number: number, divisor: number) => {
    const remainder = number % divisor;
    return (number - remainder) / divisor;
  };

  const createGrid = () => {
    const grid = [];

    for (let y = 0; y < evenDivide(height, TILE_SIZE) - HEIGHT_ERR; y++) {
      const tiles = [];

      for (let x = 0; x < evenDivide(width, TILE_SIZE); x++) {
        tiles.push(<Tile key={y + ' ' + x} />);
      }

      grid.push(<div className='row'>{tiles}</div>);
    }

    return grid;
  };

  return (
    <div
      style={{
        height,
        width,
      }}
    >
      {createGrid()}
    </div>
  );
}

export default App;
