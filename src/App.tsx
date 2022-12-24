import {useEffect, useState} from 'react';
import Knot from './Knot';
import Tile from './Tile';

const TILE_SIZE = 20;
const HEIGHT_PADDING = 6;
const ROPE_LENGTH = 20;
const VALID_KEYS = [
  'w',
  'a',
  's',
  'd',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

function App() {
  const evenDivide = (number: number, divisor: number) => {
    const remainder = number % divisor;
    return (number - remainder) / divisor;
  };

  const [height, setHeight] = useState(
    evenDivide(window.innerHeight, TILE_SIZE) - HEIGHT_PADDING
  );
  const [width, setWidth] = useState(evenDivide(window.innerWidth, TILE_SIZE));
  const [rope, setRope] = useState([] as Knot[]);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', keyPress);
    return () => window.removeEventListener('keydown', keyPress);
  }, [rope]);

  useEffect(() => {
    const newRope: Knot[] = [];

    for (let i = 0; i < ROPE_LENGTH; i++) {
      newRope.push(new Knot(0, 0));
    }

    setRope(newRope);
  }, []);

  const keyPress = ({key}: {key: string}) => {
    console.log(key);
    if (VALID_KEYS.some((validKey) => validKey === key)) {
      setRope(
        rope.reduce((acc: Knot[], knot, i) => {
          if (i === 0) {
            let knotX = rope[i].x;
            let knotY = rope[i].y;

            if (key === 'ArrowUp' || key === 'w') {
              knotY -= 1;
            } else if (key === 'ArrowDown' || key === 's') {
              knotY += 1;
            } else if (key === 'ArrowLeft' || key === 'a') {
              knotX -= 1;
            } else {
              knotX += 1;
            }

            if (knotX < 0) {
              knotX += width;
            }

            if (knotY < 0) {
              knotY += height;
            }

            return [...acc, new Knot(knotX % width, knotY % height)];
          } else {
            const lastKnot: Knot = acc[i - 1];
            const lastKnotPrev = rope[i - 1];

            if (knot.distance(lastKnot) > 1) {
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
          }

          return [...acc, knot.clone()];
        }, [])
      );
    }
  };

  const updateDimensions = () => {
    setHeight(evenDivide(window.innerHeight, TILE_SIZE) - HEIGHT_PADDING);
    setWidth(evenDivide(window.innerWidth, TILE_SIZE));
  };
  console.log(height, width);

  const createGrid = () => {
    const grid = [];

    for (let y = 0; y < height; y++) {
      const tiles = [];

      for (let x = 0; x < width; x++) {
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
    <div id='app'>
      <div>{createGrid()}</div>
      <footer>
        <p>Navigate using arrow keys or WASD</p>
        <p>Inspired by Advent of Code 2022 Day 9</p>
      </footer>
    </div>
  );
}

export default App;
