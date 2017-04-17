export function centerObjectInWidth( object, world ) {
  object.position.x = world.width / 2 - object.width / 2;
}

export function centerObjectInHeight( object, world ) {
  object.position.y = world.height / 2 - object.height / 2;
}
