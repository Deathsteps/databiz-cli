# databiz-cli

> This tool generates model CRUD actions and state codes for a common MIS

## Usage


```shell
cd projectDir
databiz-cli create modelName

```

This script will generate CRUD actions for the specified model.

* For react + redux project, it will generate state reducers as well.
* For vue + vuex project, it will generate state, mutations and actions as well.

#### Setup React project

```shell
create-react-app projectName
cd projectName
npm run eject
databiz-cli setup
```

## Project Struture

React Project

All files will be created in models directory

```
.
├── App.js
├── common/
├── components/
├── index.js
├── layouts/
├── models
│   ├── App
│   │   └── reducers.js
│   ├── Component
│   │   ├── reducers.js
│   │   ├── saga.js
│   │   └── service.js
│   ├── Model
│   │   ├── reducers.js
│   │   └── service.js
│   ├── reducerHelper.js
│   ├── reducers.js
│   ├── request.js
│   └── utils.js
├── static
│   └── app.less
└── views
    ├── ModelList
    │   ├── List.jsx
    │   ├── List.less
    │   ├── Filter.jsx
    │   └── index.js
    └── Model
        ├── Detail.jsx
        ├── Detail.less
        ├── Editor.jsx
        └── Editor.less
```
