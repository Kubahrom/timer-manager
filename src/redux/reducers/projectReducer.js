import {
  ADD_PROJECT,
  SET_PROJECTS,
  PROJECTS_ERROR,
  DELETE_PROJECT,
} from '../actions/projectActions';

const initialState = {
  projects: [],
  errorMessage: '',
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case PROJECTS_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          project => project.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default projectReducer;