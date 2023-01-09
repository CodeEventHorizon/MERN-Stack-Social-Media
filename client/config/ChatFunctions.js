export const getSenderUser = (stateUser, otherUsers) => {
  return otherUsers[0]._id === stateUser._id ? otherUsers[1].name : otherUsers[0].name;
};

export const isIdenticalSenderMargin = (chatMessages, i, j, uId) => {
  if (
    j < chatMessages.length - 1 &&
    chatMessages[j + 1].sender._id === i.sender._id &&
    chatMessages[j].sender._id !== uId
  )
    return 33;
  else if (
    (j < chatMessages.length - 1 &&
      chatMessages[j + 1].sender._id !== i.sender._id &&
      chatMessages[j].sender._id !== uId) ||
    (j === chatMessages.length - 1 && chatMessages[j].sender._id !== uId)
  )
    return 0;
  else return "auto";
};

export const isIdenticalSender = (chatMessages, i, j, uId) => {
  return (
    j < chatMessages.length - 1 &&
    (chatMessages[j + 1].sender._id !== i.sender._id ||
      chatMessages[j + 1].sender._id === undefined) &&
    chatMessages[j].sender._id !== uId
  );
};

export const isIdenticalUser = (chatMessages, i, j) => {
  return j > 0 && chatMessages[j - 1].sender._id === i.sender._id;
};

export const isLastSentText = (chatMessages, i, uId) => {
  return (
    i === chatMessages.length - 1 &&
    chatMessages[chatMessages.length - 1].sender._id !== uId &&
    chatMessages[chatMessages.length - 1].sender._id
  );
};
