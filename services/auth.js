import JWT from "jsonwebtoken";

const secret = "$piderMan@123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

export { createTokenForUser, validateToken };
