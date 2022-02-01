import {mockAppCtx} from './mocks'
import {AppCtx} from 'types/context'

const generateAppCtx = (overrides?: Partial<AppCtx>): AppCtx => {
    const appCtx = {
        ...mockAppCtx,
        ...overrides,
    }

    return appCtx
}

export {generateAppCtx}
