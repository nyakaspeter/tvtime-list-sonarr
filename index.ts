import axios from "axios";
import Elysia from "elysia";

// Available filters: "all", "watch_later", "not_started_yet", "stopped", "continuing", "up_to_date"
const getTvTimeShows = async (
  username: string,
  password: string,
  filter: string
) => {
  const loginTokensResponse = await axios.post(
    "https://app.tvtime.com/sidecar?o=https%3A%2F%2Fapi2.tozelabs.com%2Fv2%2Fuser"
  );

  const accessTokensResponse = await axios.post(
    "https://app.tvtime.com/sidecar?o=https%3A%2F%2Fauth.tvtime.com%2Fv1%2Flogin",
    { username, password },
    {
      headers: {
        Authorization: `Bearer ${loginTokensResponse.data.jwt_token}`,
      },
    }
  );

  const showsResponse = await axios.get(
    "https://app.tvtime.com/sidecar?o=https%3A%2F%2Fmsapi.tvtime.com%2Fprod%2Fv1%2Ftracking%2Fcgw%2Ffollows%2Fuser%2F14739871&entity_type=series",
    {
      headers: {
        Authorization: `Bearer ${accessTokensResponse.data.data.jwt_token}`,
      },
    }
  );

  const shows = showsResponse.data.data.objects
    .filter((o: any) => o.filter.includes(filter))
    .map((o: any) => ({
      name: o.meta.name,
      tvdbId: o.meta.id,
      filter: o.filter,
    }));

  console.log(`Returning ${shows.length} shows for filter '${filter}'`);

  return shows;
};

const { TVTIME_USERNAME, TVTIME_PASSWORD } = process.env;

if (!TVTIME_USERNAME || !TVTIME_PASSWORD) {
  console.error("TVTIME_USERNAME and TVTIME_PASSWORD env vars are required");
  process.exit(1);
}

new Elysia()
  .get("/shows/:filter", (req) =>
    getTvTimeShows(TVTIME_USERNAME, TVTIME_PASSWORD, req.params.filter)
  )
  .listen(3000);

console.log("Server listening on port 3000");
