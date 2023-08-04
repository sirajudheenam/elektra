const initialState = {
  items: [],
  isFetching: false,
  error: null,
  loaded: false,
};

const sortByName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "@ec2credentials/request":
      return { ...state, isFetching: true, error: null };
    case "@ec2credentials/receive":
      {
        if (action.items) {
          return {
            ...state,
            isFetching: false,
            error: null,
            items: action.items.sort(sortByName),
            loaded: true,
          };
        } else if (action.item) {
          const items = state.items.slice();
          const index = items.findIndex((i) => i.id === action.item.id);
          if (index >= 0) {
            items[index] = { ...items[index], ...action.item };
          } else {
            items.push(action.item);
          }
          return {
            ...state,
            isFetching: false,
            error: null,
            items: items.sort(sortByName),
          };
        }
      }
      return state;
    case "@ec2credentials/failure":
      return { ...state, isFetching: false, error: action.error };
    // type: "@ec2credentials/error", error: error.message
    case "@ec2credentials/error":
      return { ...state, isFetching: false, error: action.error };

    case "@ec2credentials/delete": {
      const index = state.items.findIndex((i) => i.id === action.id);
      if (index < 0) return state;
      const items = state.items.slice();
      items.splice(index, 1);
      return { ...state, items };
    }
    case "@ec2credentials/requestDelete": {
      const index = state.items.findIndex((i) => i.id === action.id);
      if (index < 0) return state;
      const items = state.items.slice();
      items[index] = { ...items[index], isDeleting: true };
      return { ...state, items, error: null };
    }
    case "@ec2credentials/deleteFailure": {
      const index = state.items.findIndex((i) => i.id === action.id);
      if (index < 0) return state;
      const items = state.items.slice();
      items[index] = { ...items[index], isDeleting: false };
      return { ...state, items, error: action.error };
    }
    default:
      return state;
  }
};

export default reducer;
