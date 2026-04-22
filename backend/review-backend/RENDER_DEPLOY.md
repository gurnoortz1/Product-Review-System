## Render backend setup

If you create a Render `Web Service` with native Java, set:

- Root Directory: `backend/review-backend`
- Environment: `Java`
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/review-0.0.1-SNAPSHOT.jar`

If you keep the current `Docker` web service, set:

- Root Directory: leave blank
- Dockerfile Path: `backend/review-backend/Dockerfile`
- Docker Build Context Directory: `backend/review-backend`
- Docker Command: leave blank
- Pre-Deploy Command: leave blank

Set these environment variables:

- `APP_CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>`
- `APP_JWT_SECRET=<a-long-random-secret>`
- `APP_JWT_EXPIRATION=86400000`

Optional if you want H2 data to survive restarts:

- Add a persistent disk in Render
- Mount Path: `/app/data`
- `APP_DB_PATH=/app/data/sportsdb`

Notes:

- Render provides `PORT`, and the app now reads it automatically.
- Without a persistent disk, the H2 file database resets after redeploys/restarts.
- If your frontend is also deployed, it must call the Render backend URL instead of `http://localhost:8080`.
