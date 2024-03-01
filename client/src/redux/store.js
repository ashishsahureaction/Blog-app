import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/user.Slice';
import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);



//Store is just JS Object where all the state of the app store in key-value pair.
//createStore(reducer) is method in redux library who takes all the reducers as argument
//configureStore(reducer) method in redux toolkit where reducer: {name given to reducer as per slice : reducer method} i key-value pair.
//react-redux provide Provider element for wrapping the store inside any component

//Initially
// import { configureStore } from '@reduxjs/toolkit'
// import userReducer from './user/user.Slice'

// export const store = configureStore({
//   reducer: {user : userReducer,},
// })