// Reference coordinates in the actual 1672 × 942 classroom painting.
// The rod sits against the underside of the timber lintel, not on the wall.
export const curtainSource = [[38,90],[512,90],[40,990],[679,851]];
export const windowAnchors = [[335,135],[468,175],[336,600],[514,570]];

export function projectiveMap(source, target) {
  const rows = source.flatMap(([x,y],index) => {
    const [u,v] = target[index];
    return [[x,y,1,0,0,0,-u*x,-u*y,u],[0,0,0,x,y,1,-v*x,-v*y,v]];
  });
  for (let column=0; column<8; column++) {
    let pivot=column;
    for (let row=column+1; row<8; row++) if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot=row;
    [rows[column],rows[pivot]]=[rows[pivot],rows[column]];
    const divisor=rows[column][column];
    if (Math.abs(divisor)<1e-12) throw new Error('Degenerate curtain projection');
    for (let j=column; j<=8; j++) rows[column][j]/=divisor;
    for (let row=0; row<8; row++) {
      if (row===column) continue;
      const multiple=rows[row][column];
      for (let j=column; j<=8; j++) rows[row][j]-=multiple*rows[column][j];
    }
  }
  return [...rows.map(row=>row[8]),1];
}

export function curtainProjection(width,height) {
  const target=windowAnchors.map(([x,y])=>[x*width/1672,y*height/942]);
  const h=projectiveMap(curtainSource,target);
  // CSS matrix3d is column-major. The final row performs perspective division.
  const matrix=[h[0],h[3],0,h[6],h[1],h[4],0,h[7],0,0,1,0,h[2],h[5],0,1];
  return { matrix, homography:h, target };
}

export function alignWindowCurtain(room) {
  const patch=room.querySelector('.curtain-patch');
  if (!patch || !room.clientWidth || !room.clientHeight) return;
  const {matrix}=curtainProjection(room.clientWidth,room.clientHeight);
  patch.style.transform=`matrix3d(${matrix.join(',')})`;
  patch.dataset.aligned='true';
}
