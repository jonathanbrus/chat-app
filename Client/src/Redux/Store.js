import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { AuthReducer } from "./Reducers/AuthReducer";
import { ChatReducer } from "./Reducers/ChatReducer";
import { FriendsReducer } from "./Reducers/FriendsReducer";

const middlewares = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const RootReducer = combineReducers({
  Auth: AuthReducer,
  Chat: ChatReducer,
  Friends: FriendsReducer,
});

export const Store = createStore(
  RootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
