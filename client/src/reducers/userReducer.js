export default (state, action) => {
  const { type, payload } = action;

  if (type === "USER" || type === "UPDATE_PROFILE") {
    return payload;
  }

  if (type === "CLEAR") {
    return null;
  }

  if (type === "UPDATE") {
    return {
      ...state,
      followers: payload.followers,
      following: payload.following,
    };
  }

  return state;
};
