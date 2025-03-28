import { execa as _execa } from 'execa';

import TaskBuilder from '../task-builder.js';
import { Project } from '../project.js';

/**
 * Builder that can be used to generate a gulp task to generate documentation
 * from code comments in typescript files.
 */
export class DocsTsTaskBuilder extends TaskBuilder {
    /**
     * Creates a new task builder.
     */
    constructor() {
        super(
            'docs-ts',
            'Generates documentation from code comments in typescript files',
        );
    }

    /**
     * Generates a gulp task to generate documentation from code comments in
     * source code.
     *
     * @protected
     * @param {Object} project Reference to the project for which the task needs
     * to be defined.
     *
     * @returns {Function} A gulp task.
     */
    _createTask(project) {
        if (!(project instanceof Project)) {
            throw new Error('Invalid project (arg #1)');
        }

        const { rootDir } = project;
        const docsDir = rootDir.getChild('docs').getFilePath(project.version);
        const srcPath = rootDir.getChild('src').getAllFilesGlob('ts');

        const task = () =>
            _execa(
                'typedoc',
                ['--out', docsDir, srcPath, '--entryPointStrategy', 'resolve'],
                {
                    stdio: 'inherit',
                },
            ).then(undefined, (err) => {
                /*
                 * Do nothing. This handler prevents the gulp task from
                 * crashing with an unhandled error.
                 */
                console.error(err);
            });
        return task;
    }
}
