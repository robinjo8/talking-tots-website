import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = [
  "https://tomitalk.com",
  "https://www.tomitalk.com",
  "https://tomitalk.lovable.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = allowedOrigins.includes(origin) || (origin.startsWith("https://") && origin.endsWith(".lovable.app"));
  const allowOrigin = isAllowed ? origin : allowedOrigins[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

async function listAllFiles(
  client: SupabaseClient,
  bucket: string,
  folder: string
): Promise<string[]> {
  const files: string[] = [];

  const { data: items, error } = await client.storage
    .from(bucket)
    .list(folder);

  if (error || !items) {
    console.error(`Failed to list ${folder}:`, error);
    return files;
  }

  for (const item of items) {
    const path = `${folder}/${item.name}`;

    if (item.id === null) {
      const subFiles = await listAllFiles(client, bucket, path);
      files.push(...subFiles);
    } else {
      files.push(path);
    }
  }

  return files;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized - no auth header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("Failed to get user:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Request from user:", user.id);

    const { data: adminData, error: adminError } = await userClient
      .from("admin_permissions")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "super_admin")
      .eq("is_active", true)
      .maybeSingle();

    if (adminError || !adminData) {
      console.error("User is not super admin:", adminError);
      return new Response(
        JSON.stringify({ error: "Forbidden - only super admins can archive users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Super admin verified:", user.id);

    const { user_id: targetUserId, deletion_reason } = await req.json();
    if (!targetUserId) {
      console.error("No user_id provided in request body");
      return new Response(
        JSON.stringify({ error: "Bad request - user_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Archiving user:", targetUserId);

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .maybeSingle();

    const { data: authUserData } = await adminClient.auth.admin.getUserById(targetUserId);
    const userEmail = authUserData?.user?.email || null;

    const { data: children } = await adminClient
      .from("children")
      .select("*")
      .eq("parent_id", targetUserId);

    const { data: testSessions } = await adminClient
      .from("articulation_test_sessions")
      .select("*")
      .eq("parent_id", targetUserId);

    const sessionIds = testSessions?.map(s => s.id) || [];
    let wordResults: Record<string, any[]> = {};
    
    if (sessionIds.length > 0) {
      const { data: allWordResults } = await adminClient
        .from("articulation_word_results")
        .select("*")
        .in("session_id", sessionIds);
      
      if (allWordResults) {
        for (const result of allWordResults) {
          if (!wordResults[result.session_id]) {
            wordResults[result.session_id] = [];
          }
          wordResults[result.session_id].push(result);
        }
      }
    }

    console.log(`Found: ${children?.length || 0} children, ${testSessions?.length || 0} test sessions`);

    const { data: archive, error: archiveError } = await adminClient
      .from("archived_users")
      .insert({
        original_user_id: targetUserId,
        email: userEmail,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        username: profile?.username || null,
        archived_by: user.id,
        deletion_reason: deletion_reason || null,
      })
      .select()
      .single();

    if (archiveError || !archive) {
      console.error("Failed to create archive entry:", archiveError);
      return new Response(
        JSON.stringify({ error: "Failed to create archive", details: archiveError?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Created archive entry:", archive.id);

    if (children && children.length > 0) {
      const childArchives = children.map(child => ({
        archive_id: archive.id,
        original_child_id: child.id,
        name: child.name,
        age: child.age,
        gender: child.gender,
        birth_date: child.birth_date,
        speech_difficulties: child.speech_difficulties,
        speech_development: child.speech_development,
        speech_difficulties_description: child.speech_difficulties_description,
      }));

      const { error: childArchiveError } = await adminClient
        .from("archived_children")
        .insert(childArchives);

      if (childArchiveError) {
        console.error("Failed to archive children:", childArchiveError);
      } else {
        console.log(`Archived ${children.length} children`);
      }
    }

    if (testSessions && testSessions.length > 0) {
      const childIds = testSessions.map(s => s.child_id);
      const childNameMap = new Map<string, string>();
      
      if (children) {
        for (const child of children) {
          childNameMap.set(child.id, child.name);
        }
      }

      const sessionArchives = testSessions.map(session => ({
        archive_id: archive.id,
        original_session_id: session.id,
        original_child_id: session.child_id,
        child_name: childNameMap.get(session.child_id) || null,
        status: session.status,
        submitted_at: session.submitted_at,
        completed_at: session.completed_at,
        assigned_to: session.assigned_to,
        test_data: {
          notes: session.notes,
          priority: session.priority,
          test_version: session.test_version,
          word_results: wordResults[session.id] || [],
        },
      }));

      const { error: sessionArchiveError } = await adminClient
        .from("archived_test_sessions")
        .insert(sessionArchives);

      if (sessionArchiveError) {
        console.error("Failed to archive test sessions:", sessionArchiveError);
      } else {
        console.log(`Archived ${testSessions.length} test sessions`);
      }
    }

    const allFiles = await listAllFiles(adminClient, "uporabniski-profili", targetUserId);
    let filesArchived = 0;

    if (allFiles.length > 0) {
      console.log(`Found ${allFiles.length} storage files to archive`);
      
      for (const filePath of allFiles) {
        const relativePath = filePath.replace(`${targetUserId}/`, '');
        const destPath = `${archive.id}/${relativePath}`;
        
        const { data: fileData, error: downloadError } = await adminClient.storage
          .from("uporabniski-profili")
          .download(filePath);
        
        if (downloadError) {
          console.error(`Failed to download ${filePath}:`, downloadError);
          continue;
        }

        const { error: uploadError } = await adminClient.storage
          .from("uporabniski-profili-arhiv")
          .upload(destPath, fileData, {
            contentType: "application/octet-stream",
          });

        if (uploadError) {
          console.error(`Failed to upload to archive ${destPath}:`, uploadError);
          continue;
        }

        const { error: deleteError } = await adminClient.storage
          .from("uporabniski-profili")
          .remove([filePath]);

        if (deleteError) {
          console.error(`Failed to delete original ${filePath}:`, deleteError);
        } else {
          filesArchived++;
          console.log(`Archived: ${filePath} -> ${destPath}`);
        }
      }
      
      console.log(`Storage files archived: ${filesArchived}/${allFiles.length}`);
    } else {
      console.log("No storage files found for user");
    }

    if (sessionIds.length > 0) {
      const { error: wordDeleteError } = await adminClient
        .from("articulation_word_results")
        .delete()
        .in("session_id", sessionIds);
      
      if (wordDeleteError) {
        console.error("Failed to delete word results:", wordDeleteError);
      }
    }

    if (testSessions && testSessions.length > 0) {
      const { error: sessionDeleteError } = await adminClient
        .from("articulation_test_sessions")
        .delete()
        .eq("parent_id", targetUserId);
      
      if (sessionDeleteError) {
        console.error("Failed to delete test sessions:", sessionDeleteError);
      }
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      console.error("Failed to delete user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete user", details: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Successfully archived and deleted user:", targetUserId);

    const { error: auditError } = await adminClient
      .from("audit_logs")
      .insert({
        actor_id: user.id,
        actor_type: "super_admin",
        action: "archive_and_delete_user",
        entity_type: "user",
        entity_id: targetUserId,
        details: {
          archive_id: archive.id,
          children_count: children?.length || 0,
          sessions_count: testSessions?.length || 0,
          files_archived: filesArchived,
          scheduled_deletion_at: archive.scheduled_deletion_at,
          deletion_reason: deletion_reason,
        },
      });

    if (auditError) {
      console.error("Failed to write audit log:", auditError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User archived and deleted successfully",
        archive_id: archive.id,
        scheduled_deletion_at: archive.scheduled_deletion_at,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
