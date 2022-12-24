import Knot from './Knot';

const Tile = ({x, y, rope}: {x: number; y: number; rope: Knot[]}) => {
  return (
    <div
      className={`tile tile-${
        rope.some((knot) => knot.x === x && knot.y === y)
          ? 'active'
          : 'inactive'
      }`}
    />
  );
};

export default Tile;
