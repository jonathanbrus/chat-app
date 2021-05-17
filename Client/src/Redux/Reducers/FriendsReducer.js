import { FETCHFRNDS } from "../Actions/ActionTypes";

const inititalState = {
  friends: [],
};

export const FriendsReducer = (state = inititalState, action) => {
  switch (action.type) {
    case FETCHFRNDS:
      return { ...state, friends: action.payLoad };

    default:
      return state;
  }
};
