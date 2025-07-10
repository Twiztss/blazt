import { neon } from "@neondatabase/serverless";

export const POST = async (request: Request) => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined.");
    }
    const sql = neon(process.env.DATABASE_URL);
    const {
      user_id,
      driver_id,
      start_location,
      start_latitude,
      start_longitude,
      destination_location,
      destination_latitude,
      destination_longitude,
      status,
      estimated_arrival_minutes,
      price
    } = await request.json();

    if (
      !user_id ||
      !driver_id ||
      !start_location ||
      !start_latitude ||
      !start_longitude ||
      !destination_location ||
      !destination_latitude ||
      !destination_longitude ||
      !status
    ) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Insert into ride table
    const rideResult = await sql`
      INSERT INTO ride (
        user_id, driver_id, start_location, start_latitude, start_longitude,
        destination_location, destination_latitude, destination_longitude, status, requested_at
      ) VALUES (
        ${user_id}, ${driver_id}, ${start_location}, ${start_latitude}, ${start_longitude},
        ${destination_location}, ${destination_latitude}, ${destination_longitude}, ${status}, NOW()
      ) RETURNING id, requested_at
    `;
    const ride_id = rideResult[0]?.id;
    const started_at = rideResult[0]?.requested_at;

    // Calculate ended_at using estimated_arrival_minutes
    const ended_at = new Date(new Date(started_at).getTime() + (estimated_arrival_minutes || 10) * 60000);

    // Insert into ride_history table
    await sql`
      INSERT INTO ride_history (
        ride_id, driver_id, user_id, start_location, start_latitude, start_longitude,
        destination_location, destination_latitude, destination_longitude, started_at, ended_at, price
      ) VALUES (
        ${ride_id}, ${driver_id}, ${user_id}, ${start_location}, ${start_latitude}, ${start_longitude},
        ${destination_location}, ${destination_latitude}, ${destination_longitude}, ${started_at}, ${ended_at}, ${price}
      )
    `;

    return Response.json(
      { message: "Ride and ride history have been created." },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: err || "Unknown error" }, { status: 500 });
  }
}; 