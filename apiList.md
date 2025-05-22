# Dev-Tinder API

# authRouter

-POST /singup
-POST /login
-POST /logout

# profileRouter

-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

# connectionRequestRouter

-POST /request/send/:status/:userId
-POST /request/review/:status/:requestId

# userRouter

-GET /user/connections
-GET /user/requests/received
-GET /user/feed - get user profiles of other users

Status : ignore, interested, accepted, rejected
