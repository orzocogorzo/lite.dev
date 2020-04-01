# DevLite

My lightly development boilerplate

## Setup

1. Clone the reposotiry to a new folder
2. Make a dir build in the root directory and define as build environment as you need
3. Install project dependencies with npm/yarn install
4. Write your code on the src folder
5. Build your project

### Git clone

Copy the URI ```git@github.com:orzocogorzo/devlite.git``` to the clipboard and then, with the command ```git clone {{URI}} {{path/to/the/directory}}``` clone the source code to your local.
Once you have the source code on your computed you should remove the **.git** folder on your directory to clean the boilerplate git history and start a new one by your own.

### Build files

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

There are three default environments (that can be overwriteds): 

1. **pro** for the production deploy environment.
2. **pre** for the preproduction deploy environment.
3. **dev** for the local deploy for development.

### Dependencies

If your project has npm dependencies you may install it with the client of your preference (npm/yarn) on the project saving it in the packages.json index.

### Src folder

Your code must be placed inside the **src** folder. Inside the folder you must find three more folders and the **index.html**. The html file is the index where your bundle will be loaded. The **assets** is where static files and others must be placed and referenced from your code. The **styles** is the folder where all your styling code must be placed and referenced from your code. Ath the end, inside **scripts** folder is where your javascript code will be placed.

### Build

Inside the package.json comes defined three scripts by default as three ways to build your project:

1. **serve** for setup the project in development mode.
2. **build:pre** to build the project with the pre as the active environment
3. **build:pro** to build the project with the pro as the active environment

