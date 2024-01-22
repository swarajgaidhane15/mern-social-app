export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_ALL_FOLLOWING":
      return [...payload];

    case "UPDATE_FOLLOWING":
      return state.map((item) =>
        item._id === payload.id
          ? {
              ...item,
              likes: payload?.likes ?? item.likes,
              comments: payload?.comments ?? item.comments,
            }
          : item
      );

    default:
      return state;
  }
};
