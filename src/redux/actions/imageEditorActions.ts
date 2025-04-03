import { AnnotationsTableDataType } from "../../types";

export const ADD_OBJECT = 'ADD_OBJECT';
export const UPDATE_OBJECT = 'UPDATE_OBJECT';
export const DELETE_OBJECT = 'DELETE_OBJECT';

export const addObject = (obj: AnnotationsTableDataType) => ({
  type: ADD_OBJECT,
  payload: obj,
});

export const updateObject = (obj: AnnotationsTableDataType) => ({
  type: UPDATE_OBJECT,
  payload: obj,
});

export const deleteObject = (obj: string) => ({
  type: DELETE_OBJECT,
  payload: obj,
});
