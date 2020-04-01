# DEVLITE

My lightly development boilerplate

## SETUP

1. Clone the reposotiry to a new folder
2. Make a dir build in the root directory and define as build environment as you need
3. Install project dependencies with npm/yarn install


### GIT CLONE



### BUILD FILES

Declare one build file for each environment to deploy the project you have, from the develop on the localhost to the remote production environment.

This files are affected by two conventions:

1. The file name follows the format:

```build.{{environment_name}}.js```

The **environment_name** is taken as a variable that match with the environments defineds in the project.

2. The file contents follows the format:

```javascript
module.exports = {
    dist: '/statics/client/',
    environment: 'dev'
}
```

You must declare an object as the module.exports with two keys:

1. **statics**: Where the bundle file has to be deployed
2. **environment**: The name of the current environment

### DEPENDENCIES


### BUILD
