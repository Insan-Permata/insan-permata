-- 1. Create the carousels table
CREATE TABLE IF NOT EXISTS carousels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  type TEXT NOT NULL CHECK (type IN ('background', 'story')), -- Distinguish between main background and story section
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow public read access (everyone can see the carousels)
CREATE POLICY "Public carousels are viewable by everyone" 
  ON carousels FOR SELECT 
  USING (true);

-- Allow authenticated users (admins) to manage carousels
CREATE POLICY "Admins can insert carousels" 
  ON carousels FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update carousels" 
  ON carousels FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete carousels" 
  ON carousels FOR DELETE 
  USING (auth.role() = 'authenticated');

-- 4. Create Storage Bucket for Carousel Images
-- Note: This requires the 'storage' schema to be available (standard in Supabase)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carousel_images', 'carousel_images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage Policies
-- Allow public access to view images
CREATE POLICY "Carousel images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'carousel_images');

-- Allow admins to upload images
CREATE POLICY "Admins can upload carousel images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'carousel_images' AND auth.role() = 'authenticated');

-- Allow admins to delete images
CREATE POLICY "Admins can delete carousel images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'carousel_images' AND auth.role() = 'authenticated');
