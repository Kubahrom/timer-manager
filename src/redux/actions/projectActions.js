import firebase from '../../firebase/firebase';

//Actions
export const SET_PROJECTS = 'set_projects';
export const SET_PROJECT = 'set_project';
export const CLEAR_PROJECTS = 'clear_project';
export const PROJECTS_ERROR = 'projects_error';
export const ADD_PROJECT = 'add_project';
export const DELETE_PROJECT = 'delete_project';
export const UPDATE_PROJECT = 'update_project';

//Set project action creator
const setProjects = payload => ({ type: SET_PROJECTS, payload });

//Set project action creator
const setProject = payload => ({ type: SET_PROJECT, payload });

//Clear projects action creator
export const clearProjects = () => ({ type: CLEAR_PROJECTS });

//Add project action creator
const addProject = payload => ({ type: ADD_PROJECT, payload });

//Project error action creator
const projectError = payload => ({ type: PROJECTS_ERROR, payload });

//Delete project action creator
const deleteProject = payload => ({ type: DELETE_PROJECT, payload });

//Update project action creator
const updateProjectActionCreator = payload => ({
  type: UPDATE_PROJECT,
  payload,
});

//Set projects based on user
export const getProjects = () => async (dispatch, getState) => {
  try {
    const { uid } = getState().user.user;
    const ref = firebase.firestore().collection('projects');
    const res = await ref
      .where('owner', '==', uid)
      .orderBy('created', 'desc')
      .get();
    const data = await res.docs.map(doc => doc.data());
    if (data.length !== 0) {
      dispatch(setProjects(data));
    } else {
      dispatch(projectError('no-projects'));
    }
  } catch (err) {
    console.error(err);
  }
};

//Get project based on user and project id
export const getProject = projectId => async (dispatch, getState) => {
  try {
    const { uid } = getState().user.user;
    const ref = firebase.firestore().collection('projects');
    const res = await ref
      .where('owner', '==', uid)
      .where('id', '==', projectId)
      .get();
    const data = await res.docs.map(doc => doc.data());
    if (data.length !== 0) {
      dispatch(setProject(data));
    } else {
      dispatch(projectError('not-found'));
    }
  } catch (err) {
    console.error(err);
  }
};

//Add new project
export const createNewProject = (project, closeModal) => async dispatch => {
  try {
    const ref = firebase.firestore().collection('projects');
    const newProject = {
      id: project.id,
      name: project.name,
      owner: project.owner,
      shared: project.shared,
      created: project.created,
    };
    await ref.doc(project.id).set(newProject);
    await dispatch(addProject(newProject));
    closeModal && closeModal();
  } catch (err) {
    console.error(err);
  }
};

//Delete Project
export const deleteProjectById = (projectId, redirect) => async dispatch => {
  try {
    const ref = firebase.firestore().collection('projects');
    await ref.doc(projectId).delete();
    await dispatch(deleteProject(projectId));
    redirect && redirect();
  } catch (err) {
    console.error(err);
  }
};

//Update project
export const updateProject = (project, closeModal) => async dispatch => {
  try {
    const ref = firebase.firestore().collection('projects');
    await ref.doc(project.id).update({ name: project.name });
    dispatch(updateProjectActionCreator(project));
    closeModal && closeModal();
  } catch (err) {
    console.error(err);
  }
};
