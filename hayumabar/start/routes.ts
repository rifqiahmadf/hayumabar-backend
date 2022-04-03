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

Route.get("/", async ({ response }) => {
  response.redirect().toPath("docs/index.html");
});

// Authentication Endpoint
Route.group(() => {
  Route.post("/register", "AuthController.register").as("auth.register");
  Route.post("/login", "AuthController.login")
    .as("auth.login")
    .middleware(["verify"]);
  Route.post("/otp-verification", "AuthController.otpConfirmation").as(
    "auth.verifyOtp"
  );
}).prefix("/api/v1");

Route.group(() => {
  // Read Endpoint Venue
  Route.get("/venues", "VenuesController.index").as("venue.index");
  Route.get("/venues/:id", "VenuesController.show").as("venue.show");
  // Read Endpoint Field
  Route.get("/venues/:venue_id/fields", "FieldsController.index").as(
    "field.index"
  );
  Route.get("/venues/:venue_id/fields/:id", "FieldsController.show").as(
    "field.show"
  );
})
  .prefix("/api/v1")
  .middleware(["auth"]);

Route.group(() => {
  // Venue CUD Endpoint
  Route.post("/venues", "VenuesController.store").as("venues.store");
  Route.put("/venues/:id", "VenuesController.update").as("venues.update");
  Route.delete("/venues/:id", "VenuesController.destroy").as("venues.destroy");

  // Field CUD Endpoint (Nested Route with Venue)
  Route.post("/venues/:venue_id/fields/", "FieldsController.store").as(
    "field.store"
  );
  Route.put("/venues/:venue_id/fields/:id", "FieldsController.update").as(
    "field.update"
  );
  Route.delete("/venues/:venue_id/fields/:id", "FieldsController.destroy").as(
    "field.destroy"
  );
})
  .prefix("/api/v1")
  .middleware(["auth", "owner"]);

Route.group(() => {
  // Booking Create Endpoint POST /venues/:venue_id/bookings
  Route.post("/venues/:venue_id/bookings", "BookingsController.store").as(
    "booking.store"
  );
  // Booking RUD Endpoint
  Route.get("/bookings/", "BookingsController.index").as("booking.index");
  Route.get("/bookings/:id", "BookingsController.show").as("booking.show");
  Route.put("/bookings/:id", "BookingsController.update").as("booking.update");
  Route.delete("/bookings/:id", "BookingsController.destroy").as(
    "booking.destroy"
  );
  // Join, Unjoin, Schedule Booking
  Route.put("/bookings/:id/join", "BookingsController.join").as("booking.join");
  Route.put("/bookings/:id/unjoin", "BookingsController.unjoin").as(
    "booking.unjoin"
  );
  Route.get("/schedules", "BookingsController.schedules").as(
    "booking.schedule"
  );
})
  .prefix("/api/v1")
  .middleware(["auth", "user"]);
