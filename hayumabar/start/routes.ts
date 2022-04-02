/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

// Authentication Endpoint
Route.post("/register", "AuthController.register").as("auth.register");
Route.post("/login", "AuthController.login")
  .as("auth.login")
  .middleware(["verify"]);
Route.post("/otp-verification", "AuthController.otpConfirmation").as(
  "auth.verifyOtp"
);

// Venue Endpoint
Route.resource("venues", "VenuesController")
  .apiOnly()
  .middleware({ "*": ["auth", "owner"] });
