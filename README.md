### Installation for frontend and backend
- Enter the frontend directory:
```bash
cd TodoListFrontend
```
- Install the dependencies:
```bash
npm install
```
- Enter the backend directory:
```bash
cd TodoListBackend
```
- Install the dependencies also there:
```bash
npm install
```

### Development

Prepare the env file for the frontend:
- Create a .env file the root of the frontend folder
- Create a new variable:
```bash
VITE_BACKEND_URL="http://localhost:3000/api/v1"
```

Start the MongoDB container:
```bash
docker compose up -d
```

Setup the MongoDB cluster:
- Login to the MongoDB cluster using your favorite tool (e.g MongoDB Compass):
```bash
mongodb://admin:password@localhost:27017/
```
- Create 2 new collections: todos, and users in local db

Start the development server:

```bash
npm run dev
```