import {
  SETCURCHAT,
  SETCHATS,
  SENDMSG,
  SETMESSAGE,
} from "../Actions/ActionTypes";

const inititalState = {
  chats: [],
  currentChat: null,
};

export const ChatReducer = (state = inititalState, action) => {
  switch (action.type) {
    case SETCHATS:
      let updatedChats = [];

      if (action.payLoad.length) {
        updatedChats = action.payLoad;
      } else {
        updatedChats.unshift(action.payLoad);
      }

      return {
        ...state,
        chats: updatedChats,
      };

    case SETCURCHAT:
      return { ...state, currentChat: action.payLoad };

    case SENDMSG:
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          messages: [...state.currentChat.messages, action.payLoad],
        },
      };

    case SETMESSAGE:
      const message = action.payLoad;

      let selectedChat;

      let Index;

      // eslint-disable-next-line array-callback-return
      state.chats.map((chat, index) => {
        if (chat.members.includes(message.from)) {
          chat.messages.push(message);
          selectedChat = chat;
          Index = index;
        }
      });

      let updatedChat = [...state.chats];

      updatedChat.splice(Index, 1);
      updatedChat.unshift(selectedChat);

      let updatedState;

      if (state.currentChat) {
        updatedState = {
          ...state,
          chats: updatedChat,
          currentChat: {
            ...state.currentChat,
            messages: [...state.currentChat.messages, message],
          },
        };
      }

      return { ...updatedState, chats: updatedChat };

    default:
      return state;
  }
};
