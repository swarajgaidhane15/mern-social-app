export default (state, action) => {
  const { type, payload } = action;

  if (type === "LOGIN" || type === "UPDATE_PROFILE") {
    return payload;
  }

  if (type === "LOGOUT") {
    return null;
  }

  if (type === "FOLLOW_USER") {
    return {
      ...state,
      followers: payload.followers,
      following: payload.following,
    };
  }

  return state;
};
