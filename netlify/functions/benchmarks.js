const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async function (event) {
  const method = event.httpMethod;

  // GET — fetch all submissions
  if (method === "GET") {
    const { data, error } = await supabase
      .from("community_estimates")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  // POST — add a new submission
  if (method === "POST") {
    const entry = JSON.parse(event.body);
    const { error } = await supabase.from("community_estimates").insert([
      {
        project_type: entry.projectType,
        region: entry.region,
        amount: entry.amount,
        year: entry.year,
        size: entry.size,
        outcome: entry.outcome,
        description: entry.description,
        submitted_at: new Date().toISOString(),
      },
    ]);

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
