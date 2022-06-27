//* Require Module in practice-1

//Create a new file modules.js in the project's root.

console.log(arguments); //'arguments' is an array in JavaScript, and this array contains all the values that were passed into a function. So when we log this 'arguments' array to the console, if we actually see some values there, then it means that we're really in a function

/*

Run node modules.js

Notice the five arguments of the wrapper function in the output.

OUTPUT: 

[Arguments] {
  '0': {},                            //* The first one is the export, which is currently empty because we're not exporting anything.

  '1': [Function: require] {          //* The second one is the require function

    resolve: [Function: resolve] { paths: [Function: paths] },
    main: Module {
      id: '.',
      path: 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter',
      exports: {},
      filename: 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter\\modules.js',
      loaded: false,
      children: [],
      paths: [Array]
    },
    extensions: [Object: null prototype] {
      '.js': [Function (anonymous)],
      '.json': [Function (anonymous)],
      '.node': [Function (anonymous)]
    },
    cache: [Object: null prototype] {
      'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter\\modules.js': [Module]    
    }
  },
  '2': Module {           //* The third one is called Module. And in Module we have then 'exports'.
    id: '.',
    path: 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter',
    exports: {},
    filename: 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter\\modules.js',     
    loaded: false,
    children: [],
    paths: [
      'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter\\node_modules',
      'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\node_modules',
      'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\node_modules',
      'D:\\Work\\NodeJS\\node_modules',
      'D:\\Work\\node_modules',
      'D:\\node_modules'
    ]
  },

          //* Then number three and number four are the filename and the directory name.
          
  '3': 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter\\modules.js',
  '4': 'D:\\Work\\NodeJS\\2- Backend Devlopment basics\\2-how-node-works\\starter'
}

*/
