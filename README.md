## Nest youtube api

### instructions

1. clone the repository

2. add env variables to the system as per `.env.example` or create `.env.development` (for development server) / `.env.production`, a `.env.development` will also be sent via email

3. postgres is required to run this project, a `docker-compose.yml` file may be used to run postgres and optionally adminer using docker

```
   docker-compose up
```

4. run the development server

```
pnpm run start:dev
```

#### For running in production

5. build the application

```
pnpm run build
```

6. start using

```
pnpm run start:prod
```

### Postman instructions

Please find `nest-youtube-postman_collection.json` in the root of the folder

add baseUrl env variable to the project settings (if not available)

```
http://localhost:3000
```

- Sign up using the the route in Users/signup
- Login using Users/signin and copy the jwt token from the response body
- Open project Authorization settings and set Authorization to `Bearer Token` and paste the token in `Token` field, this token will be sent on all requests
