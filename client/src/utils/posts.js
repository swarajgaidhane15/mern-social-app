export const likeDislike = async (postId, action) => {
  if (!action) {
    Promise.reject("Action is required");
    return;
  }
  try {
    const updatedPost = await fetch(`/post/${action}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({ postId: postId }),
    });
    return updatedPost.json();
  } catch (error) {
    console.log(error.error);
  }
};

export const addComment = async (text, postId) => {
  if (postId === undefined) {
    Promise.reject("Auth error");
    return;
  }

  try {
    const updatedPost = await fetch("/post/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("socio_token"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    });
    return updatedPost.json();
  } catch (err) {
    console.log(err.error);
  }
};
