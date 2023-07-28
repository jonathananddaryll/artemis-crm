const clerk = require('@clerk/clerk-sdk-node');

function decodeToken(jwtToken) {
  const token = jwtToken.replace('Bearer ', '');
  const decodeInfo = clerk.decodeJwt(token);

  // session id
  const sessionId = decodeInfo.payload.sid;

  // user/clerk id
  const userId = decodeInfo.payload.id;

  console.log(
    'ayoo decoded info userID(inside decodeToken.js): ' + decodeInfo.payload.id
  );

  const decodedToken = {
    sessionId: sessionId,
    userId: userId
  };

  return decodedToken;
}

module.exports = {
  decodeToken: decodeToken
};
