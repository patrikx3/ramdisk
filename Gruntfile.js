module.exports = (grunt) => {
    const builder = require(`corifeus-builder`);
    const loader = new builder.loader(grunt);
    loader.js({
        replacer: {
            type: 'p3x',
        },
        config: {
            'clean': {
                'generated': [
                    'generated'
                ]
            }
        }

    });

    const defaults = []
    grunt.registerTask('default', defaults.concat(builder.config.task.build.js));

}
