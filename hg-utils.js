const { soliditySha3, padLeft, toHex, toBN, BN } = require('web3').utils;
const ethers = require('ethers');

const full256 = toBN(1).shln(256).sub(toBN(1));
const altBN128P = toBN(
  '21888242871839275222246405745257275088696311157297823662689037894645226208583'
);
const altBN128PRed = BN.red(altBN128P);
const altBN128B = toBN(3).toRed(altBN128PRed);
const onePRed = toBN(1).toRed(altBN128PRed);
const twoPRed = toBN(2).toRed(altBN128PRed);
const fourPRed = toBN(4).toRed(altBN128PRed);
const oddToggle = toBN(1).ushln(254);

function getSingleCollectionId(conditionId, indexSet) {
  const initHash = soliditySha3(
    { t: 'bytes32', v: conditionId },
    { t: 'uint', v: indexSet }
  );
  const odd = '89abcdef'.includes(initHash[2]);

  const x = toBN(initHash).toRed(altBN128PRed);

  let y, yy;
  do {
    x.redIAdd(onePRed);
    yy = x.redSqr();
    yy.redIMul(x);
    yy = yy.mod(altBN128P);
    yy.redIAdd(altBN128B);
    y = yy.redSqrt();
  } while (!y.redSqr().eq(yy));

  const ecHash = x.fromRed();
  if (odd) ecHash.ixor(oddToggle);
  return `0x${ecHash.toString(16, 64)}`;
}

function combineCollectionIds(collectionIds) {
  const points = collectionIds.map(id => {
    let x = toBN(id);
    const odd = x.and(oddToggle).eq(oddToggle);
    if (odd) x.ixor(oddToggle);
    x = x.toRed(altBN128PRed);
    let y, yy;
    yy = x.redSqr();
    yy.redIMul(x);
    yy = yy.mod(altBN128P); // this might be a BN.js bug workaround
    yy.redIAdd(altBN128B);
    y = yy.redSqrt();
    if (!y.redSqr().eq(yy)) throw new Error(`got invalid collection ID ${id}`);
    if (odd !== y.isOdd()) y = y.redNeg();
    return [x, y];
  });

  const [X, Y, Z] = points.reduce(([X1, Y1, Z1], [x2, y2]) => {
    // https://www.hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#addition-madd-2007-bl
    if (Z1 == null) {
      Z1 = onePRed;
    }

    // source 2007 Bernstein--Lange
    // assume Z2=1

    // compute Z1Z1 = Z1^2
    const Z1Z1 = Z1.redSqr();
    // compute U2 = X2 Z1Z1
    const U2 = x2.redMul(Z1Z1);
    // compute S2 = Y2 Z1 Z1Z1
    const S2 = y2.redMul(Z1).redMul(Z1Z1);
    // compute H = U2-X1
    const H = U2.redSub(X1);
    // compute HH = H^2
    const HH = H.redSqr();
    // compute I = 4 HH
    const I = HH.redMul(fourPRed);
    // compute J = H I
    const J = H.redMul(I);
    // compute r = 2 (S2-Y1)
    const r = twoPRed.redMul(S2.redSub(Y1));
    // compute V = X1 I
    const V = X1.redMul(I);
    // compute X3 = r^2-J-2 V
    const X3 = r
      .redSqr()
      .redSub(J)
      .redSub(twoPRed.redMul(V));
    // compute Y3 = r (V-X3)-2 Y1 J
    const Y3 = r.redMul(V.redSub(X3)).redSub(twoPRed.redMul(Y1).redMul(J));
    // compute Z3 = (Z1+H)^2-Z1Z1-HH
    const Z3 = Z1.redAdd(H)
      .redSqr()
      .redSub(Z1Z1)
      .redSub(HH);

    return [X3, Y3, Z3];
  });

  const invZ = Z.redInvm();
  const invZZ = invZ.redSqr();
  const invZZZ = invZZ.redMul(invZ);

  const x = X.redMul(invZZ);
  const y = Y.redMul(invZZZ);

  const ecHash = x.fromRed();
  if (y.isOdd()) ecHash.ixor(oddToggle);
  return `0x${ecHash.toString(16, 64)}`;
}


const Utils = {
  getConditionId : function (oracle, questionId, slotsCount) {
    return soliditySha3({
      t: 'address',
      v: oracle
    }, {
      t: 'bytes32',
      v: questionId
    }, {
      t: 'uint',
      v: slotsCount
    });
  },

  getCollectionId(parentCollectionId, conditionId, indexSet) {
    const newCollectionId = getSingleCollectionId(conditionId, indexSet);
    if(toBN(parentCollectionId).eqn(0))
      return newCollectionId;
    return combineCollectionIds([parentCollectionId, newCollectionId]);
  },

  getPositionId(collectionId, collateral) {
    return soliditySha3({
      t: 'address',
      v: collateral
    }, {
      t: 'bytes32',
      v: collectionId
    });
  },

  generateFullIndex : function(count) {
    var arr = [];
    var current = ethers.utils.bigNumberify(1);
    const factor = ethers.utils.bigNumberify(2);
    for(var i=0; i<count; i++) {
      arr.push(current);
      current = current.mul(factor);
    }
    return arr;
  },
};

module.exports = Utils;
