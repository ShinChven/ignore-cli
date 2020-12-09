import * as fs from 'fs-extra';
import {projectPath} from "./path";

export const gitignoreRoot = projectPath(`gitignore`);


function collectFiles(path: string): Array<string> {
    let files: Array<string> = [];
    fs.readdirSync(path).map(file => {
        let filepath = `${path}/${file}`;
        const stats = fs.statSync(filepath)
        if (stats.isDirectory()) {
            files = files.concat(collectFiles(filepath));
        } else {
            files.push(filepath)
        }
    });
    return files;
}


export const collectIgnoreFiles = (): Array<string> => collectFiles(gitignoreRoot)
    .filter(item => item.indexOf('.gitignore') > 0);

export const collectIgnoreOptions = (search: string | Array<string> | undefined = undefined): Array<string> => {
    const result = collectIgnoreFiles().map(item => item.replace(`${gitignoreRoot}/`, '').replace('.gitignore', ''))
    if (search) {
        if (typeof search === 'string') {
            return result.filter(item => item.toLowerCase().indexOf(search.toLowerCase()) >= 0)
        } else if (Array.isArray(search)) {
            return result.filter(item => {
                for (let keyword of search) {
                    if (item.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
                        return true;
                    }
                }
                return false;
            });
        }
    }
    return result;
}

export function list(search: string | Array<string> | undefined = undefined) {
    collectIgnoreOptions(search).map(item => {
        console.log(item)
    });
}

interface GenerateIgnoreParams {
    search: string | Array<string> | undefined
    path: string;
}

export function generateGitignore({search, path}: GenerateIgnoreParams) {
    const ignoreFilePath = `${path}/.gitignore`;
    const ignoreRules = new Set<string>();
    if (fs.existsSync(ignoreFilePath)) {
        fs.readFileSync(ignoreFilePath, 'utf-8').split('\n').map(rule => ignoreRules.add(rule));
    }
    const ignores = collectIgnoreOptions(search);

    ignores.map(item => {
        fs.readFileSync(`${gitignoreRoot}/${item}.gitignore`, 'utf-8').split('\n').map(rule => {
            ignoreRules.add(rule);
        });
    });

    fs.writeFileSync(ignoreFilePath, Array.from(ignoreRules).join('\n'));
}
