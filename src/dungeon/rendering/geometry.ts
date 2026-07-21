import * as THREE from 'three';
export const TILE_SIZE=1;
export function tileToWorld(x:number,y:number,level=0){return new THREE.Vector3(x*TILE_SIZE,level*TILE_SIZE,y*TILE_SIZE);}
export function boundaryTransform(tile:{x:number;y:number;level:number},side:string,height=.9){const pos=tileToWorld(tile.x+.5,tile.y+.5,tile.level); let rot=0; if(side==='n'){pos.z-=.5}else if(side==='s'){pos.z+=.5}else if(side==='e'){pos.x+=.5;rot=Math.PI/2}else{pos.x-=.5;rot=Math.PI/2} pos.y=height/2; return {position:pos,rotationY:rot};}
export const FLOOR_GEOMETRY=new THREE.BoxGeometry(.96,.08,.96);
export const WALL_GEOMETRY=new THREE.BoxGeometry(1,.9,.16);
export const DOOR_GEOMETRY=new THREE.BoxGeometry(.72,.72,.12);
export const MARKER_GEOMETRY=new THREE.ConeGeometry(.32,.7,6);
