import axios from "axios";
import Elysia from "elysia";

// Available filters: "watching", "not_started_yet", "for_later", "up_to_date", "finished", "stopped_watching", "all_time_favorites"
const getTvTimeShows = async (
  username: string,
  password: string,
  filter?: string
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

  const { id, jwt_token } = accessTokensResponse.data.data;

  const apiUrl = `https://api2.tozelabs.com/v2/user/${id}&fields=shows.fields(id,name,filters,watched_episode_count,aired_episode_count,status,is_followed,is_up_to_date,is_archived,is_for_later,is_favorite).offset(0).limit(500)`;

  const showsResponse = await axios.get(
    `https://app.tvtime.com/sidecar?o=${encodeURI(apiUrl)}`,
    {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    }
  );

  const shows = showsResponse.data.shows
    .filter(
      (s: any) =>
        !filter ||
        s.filters.find((f: any) => f.id === "progress").values.includes(filter)
    )
    .map((s: any) => ({
      name: s.name,
      tvdbId: s.id,
      watched_episode_count: s.watched_episode_count,
      aired_episode_count: s.aired_episode_count,
      status: s.status,
      is_followed: s.is_followed,
      is_up_to_date: s.is_up_to_date,
      is_archived: s.is_archived,
      is_for_later: s.is_for_later,
      is_favorite: s.is_favorite,
    }));

  if (filter) {
    console.log(`Returning ${shows.length} shows for filter '${filter}'`);
  } else {
    console.log(`Returning all ${shows.length} shows`);
  }

  return shows;
};

const { TVTIME_USERNAME, TVTIME_PASSWORD } = process.env;

if (!TVTIME_USERNAME || !TVTIME_PASSWORD) {
  console.error("TVTIME_USERNAME and TVTIME_PASSWORD env vars are required");
  process.exit(1);
}

new Elysia({ serve: { idleTimeout: 30 } })
  .get("/shows", () => getTvTimeShows(TVTIME_USERNAME, TVTIME_PASSWORD))
  .get("/shows/:filter", (req) =>
    getTvTimeShows(TVTIME_USERNAME, TVTIME_PASSWORD, req.params.filter)
  )
  .listen(3000);

console.log("Server listening on port 3000");
