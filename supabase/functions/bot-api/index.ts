import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, userId, categoryName, amount, description, phone } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const headers = {
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    };

    if (action === "add_expense") {
      const categoryRes = await fetch(
        `${supabaseUrl}/rest/v1/categories?name=eq.${categoryName}`,
        { headers }
      );
      const categories = await categoryRes.json();
      const categoryId = categories[0]?.id;

      const expenseRes = await fetch(
        `${supabaseUrl}/rest/v1/expenses`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            user_id: userId,
            category_id: categoryId,
            amount: parseFloat(amount),
            description,
            expense_date: new Date().toISOString().split("T")[0],
          }),
        }
      );
      return new Response(JSON.stringify(await expenseRes.json()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_user") {
      const userRes = await fetch(
        `${supabaseUrl}/rest/v1/user_profiles?phone=eq.${phone}`,
        { headers }
      );
      return new Response(JSON.stringify(await userRes.json()), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_report") {
      const expensesRes = await fetch(
        `${supabaseUrl}/rest/v1/expenses?user_id=eq.${userId}`,
        { headers }
      );
      const expenses = await expensesRes.json();
      const total = expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount), 0);
      return new Response(JSON.stringify({ expenses, total }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação inválida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});