# fastapi-scaffolder

1. Prerequisites: Python, Node.js and Vue.js should be installed
2. Create OpenAPI YML file
3. Run the backend generator:
```
$ cd backend_generator
$ poetry install
$ poetry run python -m fastapi_scaffolder -i example.yml -o testapp
```
3. Run the frontend generator:
```
$ cd ../frontend_generator
$ chmod +x cli.js
$ ./cli.js
```
4. Launch the Vue app:
```
$ cd ../vue_app
$ npm run dev
```
