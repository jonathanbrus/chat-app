import { SIGNIN, SIGNOUT, UPDATEUSERINFO } from "../Actions/ActionTypes";

const initialState = {
  user: null,
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      const { user, accessToken, refreshToken } = action.payLoad;

      const day = new Date();

      day.setHours(day.getHours() + 6);

      const messengerData = {
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expireAt: day,
      };

      if (!localStorage.getItem("messengerData", messengerData)) {
        localStorage.setItem("messengerData", JSON.stringify(messengerData));
      }

      return { ...state, user: user };

    case SIGNOUT:
      if (localStorage.getItem("messengerData")) {
        localStorage.removeItem("messengerData");
      }

      return { ...state, user: null };

    case UPDATEUSERINFO:
      const updatedUserInfo = action.payLoad;

      const data = JSON.parse(localStorage.getItem("messengerData"));

      if (data.user !== updatedUserInfo) {
        const messengerData = {
          ...data,
          user: updatedUserInfo,
        };
        localStorage.setItem("messengerData", JSON.stringify(messengerData));
      }

      return {
        ...state,
        user: updatedUserInfo,
      };

    default:
      return state;
  }
};
