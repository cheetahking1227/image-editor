import { AnnotationsTableDataType } from "../../types";
import { ADD_OBJECT, UPDATE_OBJECT, DELETE_OBJECT } from "../actions/imageEditorActions";

type initialStateType = {
  objectData: AnnotationsTableDataType[],
}

const initialState: initialStateType = {
  objectData: [],
}

const imageEditorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_OBJECT:
      return { ...state, objectData: [...state.objectData, action.payload] }
    case UPDATE_OBJECT:
      let tempData: AnnotationsTableDataType[] = [];
      tempData = state.objectData.map((item) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return action.payload
        }
      });
      return { ...state, objectData: tempData };
    case DELETE_OBJECT:
      let restData = state.objectData.filter((item) => (item.id !== action.payload));
      return { ...state, objectData: [...restData] };
    default:
      return state
  }
}

export default imageEditorReducer;
