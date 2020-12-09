import shell from 'shelljs';

export function fetch(){
    shell.exec('git clone https://github.com/github/gitignore.git');
}