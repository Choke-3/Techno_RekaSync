import { createClient } from '@supabase/supabase-js';
import { Project, StyleAsset } from '../types';

// Extract the core Supabase URL and key
// Handle the case where the URL provided has /rest/v1/ appended
const env = (import.meta as any).env || {};
const rawUrl = env.VITE_SUPABASE_URL || 'https://yjrudxwphpcofycwbivp.supabase.co/rest/v1/';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').trim();
const anonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcnVkeHdwaHBjb2Z5Y3diaXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjUwOTAsImV4cCI6MjA5NzAwMTA5MH0.TNuPILMuIlIlOTburHRcAihLcjCNfnlMbGpgylWNdAc';


export const supabase = createClient(cleanUrl, anonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Handle user registration in Supabase Auth
 */
export async function registerUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Handle user login in Supabase Auth
 */
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Handle user logout in Supabase Auth
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update the user profile (full name and avatar URL) in Supabase Auth user_metadata.
 */
export async function updateUserProfile(fullName: string, avatarUrl: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      avatar_url: avatarUrl
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


// SQL command string to copy/execute in Supabase SQL editor
export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor to create the tables:

-- 1. Create the projects table
CREATE TABLE IF NOT EXISTS reka_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_date TEXT,
  team TEXT[]
);

-- 2. Create the style assets table (which references projects)
CREATE TABLE IF NOT EXISTS reka_style_assets (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES reka_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  love_count INTEGER DEFAULT 0,
  skip_count INTEGER DEFAULT 0,
  total_swipes INTEGER DEFAULT 0
);

-- Enable row-level security (RLS) if desired, or disable it/create permissive public rules for client demo:
ALTER TABLE reka_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reka_style_assets ENABLE ROW LEVEL SECURITY;

-- Permissive public read/write policies for this quick setup:
CREATE POLICY "Allow public select of projects" ON reka_projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert of projects" ON reka_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of projects" ON reka_projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of projects" ON reka_projects FOR DELETE USING (true);

CREATE POLICY "Allow public select of assets" ON reka_style_assets FOR SELECT USING (true);
CREATE POLICY "Allow public insert of assets" ON reka_style_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of assets" ON reka_style_assets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete of assets" ON reka_style_assets FOR DELETE USING (true);
`;

/**
 * Checks if Supabase table endpoints are responsive by probing a basic query.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('reka_projects').select('id').limit(1);
    if (error) {
      console.warn('Supabase test table query returned error (tables might not exist yet):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connectivity check failed:', err);
    return false;
  }
}

/**
 * Fetch all projects and nested style assets from Supabase.
 */
export async function getSupabaseProjects(): Promise<Project[]> {
  // 1. Fetch live projects
  const { data: projectsData, error: projError } = await supabase
    .from('reka_projects')
    .select('*')
    .order('created_date', { ascending: false });

  if (projError) {
    throw new Error(`Failed to fetch projects: ${projError.message}`);
  }

  if (!projectsData || projectsData.length === 0) {
    return [];
  }

  // 2. Fetch all style assets
  const { data: assetsData, error: assetError } = await supabase
    .from('reka_style_assets')
    .select('*');

  if (assetError) {
    throw new Error(`Failed to fetch style assets: ${assetError.message}`);
  }

  // 3. Map values back to standard Project type
  return projectsData.map((p: any) => {
    const projectAssets = (assetsData || [])
      .filter((asset: any) => asset.project_id === p.id)
      .map((asset: any) => ({
        id: asset.id,
        title: asset.title,
        category: asset.category,
        imageUrl: asset.image_url,
        loveCount: asset.love_count ?? 0,
        skipCount: asset.skip_count ?? 0,
        totalSwipes: asset.total_swipes ?? 0
      }));

    return {
      id: p.id,
      title: p.title,
      clientName: p.client_name,
      clientEmail: p.client_email || '',
      description: p.description || '',
      status: p.status || 'Active',
      createdDate: p.created_date || '',
      team: p.team || [],
      assets: projectAssets
    };
  });
}

/**
 * Insert a project and its style assets into Supabase.
 */
export async function insertSupabaseProject(project: Project): Promise<void> {
  // 1. Insert parent project record
  const { error: projError } = await supabase
    .from('reka_projects')
    .insert({
      id: project.id,
      title: project.title,
      client_name: project.clientName,
      client_email: project.clientEmail,
      description: project.description,
      status: project.status,
      created_date: project.createdDate,
      team: project.team
    });

  if (projError) {
    throw new Error(`Failed to save project: ${projError.message}`);
  }

  // 2. Insert style assets
  if (project.assets && project.assets.length > 0) {
    const formattedAssets = project.assets.map(asset => ({
      id: asset.id,
      project_id: project.id,
      title: asset.title,
      category: asset.category,
      image_url: asset.imageUrl,
      love_count: asset.loveCount,
      skip_count: asset.skipCount,
      total_swipes: asset.totalSwipes
    }));

    const { error: assetError } = await supabase
      .from('reka_style_assets')
      .insert(formattedAssets);

    if (assetError) {
      throw new Error(`Failed to save style assets: ${assetError.message}`);
    }
  }
}

/**
 * Update project details inside Supabase (status, title, description, team, etc.)
 */
export async function updateSupabaseProject(project: Project): Promise<void> {
  const { error: projError } = await supabase
    .from('reka_projects')
    .update({
      title: project.title,
      client_name: project.clientName,
      client_email: project.clientEmail,
      description: project.description,
      status: project.status,
      created_date: project.createdDate,
      team: project.team
    })
    .eq('id', project.id);

  if (projError) {
    throw new Error(`Failed to update project details: ${projError.message}`);
  }

  // Note: we can also update their style assets by syncing or upserting them:
  if (project.assets && project.assets.length > 0) {
    for (const asset of project.assets) {
      const { error: assetError } = await supabase
        .from('reka_style_assets')
        .upsert({
          id: asset.id,
          project_id: project.id,
          title: asset.title,
          category: asset.category,
          image_url: asset.imageUrl,
          love_count: asset.loveCount,
          skip_count: asset.skipCount,
          total_swipes: asset.totalSwipes
        });

      if (assetError) {
        throw new Error(`Failed to upsert asset ${asset.title}: ${assetError.message}`);
      }
    }
  }
}

/**
 * Update project status only.
 */
export async function updateSupabaseProjectStatus(id: string, status: 'Active' | 'Completed' | 'Archived'): Promise<void> {
  const { error } = await supabase
    .from('reka_projects')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update project status: ${error.message}`);
  }
}

/**
 * Update the loveCount, skipCount, and totalSwipes of a single asset.
 */
export async function updateSupabaseAssetSwipes(assetId: string, loveCount: number, skipCount: number, totalSwipes: number): Promise<void> {
  const { error } = await supabase
    .from('reka_style_assets')
    .update({
      love_count: loveCount,
      skip_count: skipCount,
      total_swipes: totalSwipes
    })
    .eq('id', assetId);

  if (error) {
    throw new Error(`Failed to update style asset counts: ${error.message}`);
  }
}

/**
 * Delete project and associated records.
 */
export async function deleteSupabaseProject(id: string): Promise<void> {
  // Try to delete parent (which deletes children due to CASCADE if configured)
  const { error } = await supabase
    .from('reka_projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Wipe all project records from the database table.
 */
export async function deleteAllSupabaseProjects(): Promise<void> {
  const { error } = await supabase
    .from('reka_projects')
    .delete()
    .neq('id', '');

  if (error) {
    throw new Error(`Failed to clear projects: ${error.message}`);
  }
}
