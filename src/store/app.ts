import * as redux from 'redux'
import { eq, actionCreatorFactory } from "@/typedActions"

const actionCreator = actionCreatorFactory('App')

export const Actions = {
    setVersion: actionCreator<string>("setVersion")
}

export interface IState {
    version: string
}

const initialState: IState = {
    version: "0.0.1",
}

export function reducer(state = initialState, action: redux.Action): IState {
    if (eq(action, Actions.setVersion)) {
        return { ...state, version: action.payload }
    }
    return state
}
