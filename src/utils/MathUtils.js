export const getRandomWithWeight = ( array, length = array.length ) => {
  let probs = array.slice( 0, length ).map( v => v.probability );
  const probsSum = probs.reduce( ( a, b ) => ( a + b ) );
  probs = probs.map( v => v * ( 1 / probsSum ) );

  const random = Math.random();
  let sum = 0;
  for ( let i = 0; i < length; i++ ) {
    sum += probs[ i ];
    if ( random <= sum ) {
      return array[ i ];
    }
  }
};
