import {useEffect, useState} from 'react';
import Knot from './Knot';
import Tile from './Tile';

const TILE_SIZE = 20;
const HEIGHT_ERR = 4;
const ROPE_LENGTH = 20;

function App() {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [rope, setRope] = useState([] as Knot[]);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [rope]);

  useEffect(() => {
    const newRope: Knot[] = [];

    for (let i = 0; i < ROPE_LENGTH; i++) {
      newRope.push(new Knot(0, 0));
    }

    setRope(newRope);
  }, []);

  const updateMousePosition = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    if ((x !== mouseX || y !== mouseY) && rope.length > 0) {
      const diffX = Math.abs(x - mouseX);
      const diffY = Math.abs(y - mouseY);
      setMouseX(evenDivide(x, TILE_SIZE));
      setMouseY(evenDivide(y, TILE_SIZE));

      setRope(
        rope.reduce((acc: Knot[], knot, i) => {
          const lastKnot: Knot = acc[i - 1];
          const lastKnotPrev = rope[i - 1];

          if (i === 0) {
            let knotX = evenDivide(x, TILE_SIZE);
            let knotY = evenDivide(y, TILE_SIZE);

            if (Math.max(diffX, diffY) === diffX) {
              if (diffX !== 0) {
                if (x > mouseX) {
                  knotX += 1;
                } else {
                  knotX -= 1;
                }
              }
            } else {
              if (diffY !== 0) {
                if (y > mouseY) {
                  knotY += 1;
                } else {
                  knotY -= 1;
                }
              }
            }

            return [...acc, new Knot(knotX, knotY)];
          } else if (knot.distance(lastKnot) > 1) {
            if (lastKnot.diagFrom(lastKnotPrev)) {
              if (lastKnot.onSameAxis(knot)) {
                const xDiff = lastKnot.x - knot.x;
                const yDiff = lastKnot.y - knot.y;
                return [
                  ...acc,
                  new Knot(
                    knot.x + evenDivide(xDiff, 2),
                    knot.y + evenDivide(yDiff, 2)
                  ),
                ];
              } else {
                const xDiff = lastKnot.x - lastKnotPrev.x;
                const yDiff = lastKnot.y - lastKnotPrev.y;
                return [...acc, new Knot(knot.x + xDiff, knot.y + yDiff)];
              }
            } else {
              return [...acc, new Knot(lastKnotPrev.x, lastKnotPrev.y)];
            }
          }

          return [...acc, knot.clone()];
        }, [])
      );
    }
  };

  const updateDimensions = () => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
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
        tiles.push(<Tile x={x} y={y} rope={rope} key={y + ' ' + x} />);
      }

      grid.push(
        <div className='row' key={y}>
          {tiles}
        </div>
      );
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
