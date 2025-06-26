import { supabase } from "@/integrations/supabase/client";

export async function checkDatabaseTables() {
  console.log("🔍 Checking database connection and available tables...");

  // Test basic connection
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (error) {
      console.error("❌ Failed to query information_schema:", error);

      // Try a simpler approach - test common tables
      const tablesToCheck = [
        "fraud_reports",
        "otp_verification",
        "notifications",
        "report_evidence",
        "community_interactions",
      ];

      for (const table of tablesToCheck) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select("*")
            .limit(1);
          if (error) {
            console.error(`❌ Table '${table}' error - Full object:`, error);
            console.error(
              `❌ Table '${table}' error - Stringified:`,
              JSON.stringify(error, null, 2),
            );
            console.error(`❌ Table '${table}' error - Properties:`, {
              message: error?.message,
              details: error?.details,
              hint: error?.hint,
              code: error?.code,
              error: error?.error,
              statusCode: error?.statusCode,
            });
          } else {
            console.log(`✅ Table '${table}' is accessible`);
          }
        } catch (e) {
          console.error(`❌ Exception checking table '${table}':`, e);
        }
      }
    } else {
      console.log(
        "✅ Available tables:",
        data?.map((t) => t.table_name),
      );
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// Call this immediately when the module loads
checkDatabaseTables();
