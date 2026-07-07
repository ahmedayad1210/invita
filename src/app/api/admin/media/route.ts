import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyAdminJWT, COOKIE_NAME } from "@/lib/admin-jwt";
import {
  MEDIA_BUCKET,
  MEDIA_CATEGORIES,
  MAX_MEDIA_BYTES,
  sanitizeStorageFileName,
  type MediaCategory,
} from "@/lib/invita/media-assets";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyAdminJWT(token)) !== null;
}

function supabaseRequired() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Supabase not configured. Run supabase/media-assets.sql and set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }
  return null;
}

function isMediaCategory(value: string): value is MediaCategory {
  return MEDIA_CATEGORIES.some((item) => item.id === value);
}

type PresignBody = {
  fileName?: string;
  contentType?: string;
  category?: string;
  title?: string;
  altText?: string;
  role?: string;
  fileSize?: number;
};

type PatchBody = {
  id?: string;
  title?: string;
  altText?: string;
  category?: string;
  role?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const missing = supabaseRequired();
  if (missing) return missing;

  const category = request.nextUrl.searchParams.get("category");
  const supabase = createAdminClient();

  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && isMediaCategory(category)) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const missing = supabaseRequired();
  if (missing) return missing;

  let body: PresignBody;
  try {
    body = (await request.json()) as PresignBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const fileName = body.fileName?.trim();
  const contentType = body.contentType?.trim();
  const category = body.category?.trim() ?? "image";
  const title = body.title?.trim() || fileName;
  const altText = body.altText?.trim() || null;
  const role = body.role?.trim() || null;
  const fileSize = body.fileSize ?? 0;

  if (!fileName || !contentType) {
    return NextResponse.json(
      { success: false, error: "fileName and contentType are required." },
      { status: 400 }
    );
  }

  if (!isMediaCategory(category)) {
    return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 });
  }

  const categoryConfig = MEDIA_CATEGORIES.find((item) => item.id === category);
  const allowedTypes = categoryConfig?.accept.split(",") ?? [];
  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json(
      {
        success: false,
        error: `File type ${contentType} is not allowed for ${category}.`,
      },
      { status: 400 }
    );
  }

  if (fileSize > MAX_MEDIA_BYTES) {
    return NextResponse.json(
      { success: false, error: "File exceeds 50 MB limit." },
      { status: 400 }
    );
  }

  const safeName = sanitizeStorageFileName(fileName);
  const storagePath = `${category}/${Date.now()}-${safeName}`;

  const supabase = createAdminClient();

  const { data: signed, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (signError || !signed) {
    return NextResponse.json(
      {
        success: false,
        error:
          signError?.message ??
          "Could not create upload URL. Run supabase/media-assets.sql to create the invita-media bucket.",
      },
      { status: 500 }
    );
  }

  const { data: publicData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);

  const { data: asset, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      category,
      role,
      title: title ?? safeName,
      alt_text: altText,
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      mime_type: contentType,
      file_size: fileSize || null,
      is_active: true,
    } as never)
    .select("*")
    .single();

  if (insertError || !asset) {
    return NextResponse.json(
      { success: false, error: insertError?.message ?? "Could not save asset record." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      asset,
      storagePath,
      token: signed.token,
    },
  });
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const missing = supabaseRequired();
  if (missing) return missing;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ success: false, error: "Asset id is required." }, { status: 400 });
  }

  if (body.category && !isMediaCategory(body.category)) {
    return NextResponse.json({ success: false, error: "Invalid category." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.altText !== undefined) updates.alt_text = body.altText.trim() || null;
  if (body.category !== undefined) updates.category = body.category;
  if (body.role !== undefined) updates.role = body.role?.trim() || null;
  if (body.sortOrder !== undefined) updates.sort_order = body.sortOrder;
  if (body.isActive !== undefined) updates.is_active = body.isActive;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("media_assets").update(updates as never).eq("id", body.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  const missing = supabaseRequired();
  if (missing) return missing;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, error: "Asset id is required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: asset, error: fetchError } = await supabase
    .from("media_assets")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ success: false, error: "Asset not found." }, { status: 404 });
  }

  const storagePath = (asset as { storage_path: string }).storage_path;

  const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
  if (storageError) {
    return NextResponse.json({ success: false, error: storageError.message }, { status: 500 });
  }

  const { error: deleteError } = await supabase.from("media_assets").delete().eq("id", id);
  if (deleteError) {
    return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
