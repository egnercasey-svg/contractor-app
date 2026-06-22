const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async function (event) {
  const method = event.httpMethod;

  // GET — fetch historical estimates
  if (method === "GET") {
    const { data, error } = await supabase
      .from("uploaded_estimates")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(100);

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  // POST — save a new estimate summary
  if (method === "POST") {
    const entry = JSON.parse(event.body);
    const { error } = await supabase.from("uploaded_estimates").insert([{
      contractor_name: entry.contractorName,
      total_amount: entry.totalAmount,
      project_type: entry.projectType,
      scope_summary: entry.scopeSummary,
      file_name: entry.fileName,
      submitted_at: new Date().toISOString(),
    }]);

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
