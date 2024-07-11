
import { Reducer } from 'redux';

export const createReducer = (et?: EventTarget) => {
  const reducer: Reducer = (state = {}, { type, payload }) => {
    const _state = { ...state };
    if (type) {
      _state[type] = payload;

      et && Promise.resolve().then(() => {
        et?.dispatchEvent(new CustomEvent('storeUpdated', { detail: { type, value: payload } }));
      });
    }
    return _state;
  };

  return reducer;
};
