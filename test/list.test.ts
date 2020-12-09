import {list} from '../src'

describe('list files', () => {

    it('to TypeScript interface', (done) => {
        list(['windows'])
        done()
    }).timeout(60 * 1000);


})
