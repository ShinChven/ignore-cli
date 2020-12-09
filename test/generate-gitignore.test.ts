import {generateGitignore} from '../src'
import {projectPath} from "../src/path";

describe('generate .gitignore', () => {

    it('to TypeScript interface', (done) => {
        generateGitignore({
            path: projectPath(),
            search: ['jetbrains', 'windows', 'linux', 'macos', 'node', 'vscode']
        })
        done()
    }).timeout(60 * 1000);


})
