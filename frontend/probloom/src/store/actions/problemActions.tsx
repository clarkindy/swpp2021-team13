import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { push } from 'connected-react-router';

import * as interfaces from '../reducers/problemReducerInterface';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetAllProblemSetsAction {
  type: typeof actionTypes.GET_ALL_PROBLEMSETS;
  problemSets: ProblemSet[];
}

export const getAllProblemSets_: (
  problemSets: ProblemSet[]
) => GetAllProblemSetsAction = (problemSets) => ({
  type: actionTypes.GET_ALL_PROBLEMSETS,
  problemSets: problemSets,
});

export const getAllProblemSets: () => ThunkAction<
  void,
  RootState,
  null,
  GetAllProblemSetsAction
> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.get(`/api/problem/`);
    dispatch(getAllProblemSets_(data));
  };
};

export interface GetProblemSetAction {
  type: typeof actionTypes.GET_PROBLEMSET;
  pset: ProblemSet;
  problems_list: NewProblemSet[];
}

export const getProblemSet_: (problemSet) => GetProblemSetAction = (
  problemSet
) => ({
  type: actionTypes.GET_PROBLEMSET,
  pset: problemSet.res_pset,
  problems_list: problemSet.problems_list,
});

export const getProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem/${problemSetID}/`);
    dispatch(getProblemSet_(data));
  };
};

export interface GetAllSolversAction {
  type: typeof actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET;
  solvers: Solver[];
}

export const getAllSolvers_: (solvers: Solver[]) => GetAllSolversAction = (
  solvers
) => ({
  type: actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET,
  solvers: solvers,
});

export const getAllSolvers: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetAllSolversAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get(`/api/solved/${problemSetID}/`);
      dispatch(getAllSolvers_(data));
    } catch (err) {
      const { status } = (err as any).response;
      if (status === 404) {
        dispatch(getAllSolvers_([]));
      } else {
        throw err;
      }
    }
  };
};

export interface CreateProblemSetAction {
  type: typeof actionTypes.CREATE_PROBLEM_SET;
  problemSet: ProblemSet;
}

export const createProblemSet_: (
  problemSet: ProblemSet
) => CreateProblemSetAction = (problemSet: ProblemSet) => ({
  type: actionTypes.CREATE_PROBLEM_SET,
  problemSet: problemSet,
});

export const createProblemSet: (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet } = await axios.post(`/api/problem/`, {
      title: title,
      content: content,
      scope: scope,
      tag: tag,
      difficulty: difficulty,
      problems: problems,
    });
    dispatch(createProblemSet_(data));
    dispatch(push(`/problem/${data.id}/detail/`));
  };
};

export interface EditProblemSetAction {
  type: typeof actionTypes.EDIT_PROBLEM_SET;
  pset: ProblemSet;
  problems_list: NewProblemSet[];
}

export const editProblemSet_: (editData) => EditProblemSetAction = (
  editData
) => ({
  type: actionTypes.EDIT_PROBLEM_SET,
  pset: editData.res_pset,
  problems_list: editData.problems_list,
});

export const editProblemSet: (
  id: number,
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  id: number,
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.put(`/api/problem/${id}/`, {
      id: id,
      title: title,
      content: content,
      scope: scope,
      tag: tag,
      difficulty: difficulty,
      problems: problems,
    });
    dispatch(editProblemSet_(data));
    dispatch(push(`/problem/${data.id}/detail/`));
  };
};

export interface DeleteProblemSetAction {
  type: typeof actionTypes.DELETE_PROBLEMSET;
  targetID: number;
}

export const deleteProblemSet_: (
  problemSet: ProblemSet
) => DeleteProblemSetAction = (problemSet) => ({
  type: actionTypes.DELETE_PROBLEMSET,
  targetID: problemSet.id,
});

export const deleteProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, DeleteProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet } = await axios.delete(
      `/api/problem/${problemSetID}/`
    );
    dispatch(deleteProblemSet_(data));
  };
};

export interface CreateProblemAction {
  type: typeof actionTypes.CREATE_PROBLEM;
  newProblem: interfaces.UpdateProblemRequest;
}

export const createProblem_: (problemData) => CreateProblemAction = (
  problemData
) => ({
  type: actionTypes.CREATE_PROBLEM,
  newProblem: problemData
});

export const createProblem: (
  ps_id: number,
  problemData: interfaces.CreateProblemRequest
) => ThunkAction<void, RootState, null, CreateProblemAction> = (
  ps_id: number,
  problemData: interfaces.CreateProblemRequest
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem_set/${ps_id}/`);
    dispatch(createProblem_(problemData));
  };
};

export interface GetProblemAction {
  type: typeof actionTypes.GET_PROBLEM;
  selectedProblem: interfaces.GetProblemResponse;
}

export const getProblem_: (problemData) => GetProblemAction = (
  problemData
) => ({
  type: actionTypes.GET_PROBLEM,
  selectedProblem: problemData
});

export const getProblem: ( 
  id: number,
) => ThunkAction<void, RootState, null, GetProblemAction> = (
  id: number,
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem/${id}/`);
    dispatch(getProblem_(data));
  };
};

export interface UpdateProblemAction {
  type: typeof actionTypes.UPDATE_PROBLEM;
  selectedProblem: interfaces.UpdateProblemRequest;
}

export const updateProblem_: (problemData) => UpdateProblemAction = (
  problemData
) => ({
  type: actionTypes.UPDATE_PROBLEM,
  selectedProblem: problemData
});

export const updateProblem: (
  id: number,
  problemData: interfaces.UpdateProblemRequest
) => ThunkAction<void, RootState, null, UpdateProblemAction> = (
  id: number,
  problemData: interfaces.UpdateProblemRequest
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem/${id}/`);
    dispatch(updateProblem_(problemData));
  };
};

export type ProblemSetAction =
  | GetAllProblemSetsAction
  | GetProblemSetAction
  | GetAllSolversAction
  | CreateProblemSetAction
  | EditProblemSetAction
  | DeleteProblemSetAction
  | CreateProblemAction
  | GetProblemAction
  | UpdateProblemAction;
