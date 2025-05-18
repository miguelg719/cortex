// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const session = new Supabase.ai.Session('gte-small');

Deno.serve(async (req) => {
  // Extract input string from JSON body
  const { input } = await req.json();

  // Generate the embedding from the user input
  const embedding = await session.run(input, {
    mean_pool: true,
    normalize: true,
  });

  // Return the embedding
  return new Response(
    JSON.stringify({ embedding }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});