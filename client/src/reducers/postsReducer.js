export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH":
      return state;

    case "FETCH_ALL":
      return payload;

    case "DELETE":
      return state.filter((item) => item._id !== payload);

    case "ADD":
      return [payload, ...state];

    case "UPDATE":
      return state.map((item) =>
        item._id === payload.id
          ? {
              ...item,
              likes: payload.likes ?? item.likes,
              comments: payload.comments ?? item.comments,
            }
          : item
      );
  }
};
