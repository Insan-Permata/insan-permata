-- ============================================
-- Complete Schema for Insan Permata
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create ENUM type for educational stages
CREATE TYPE educational_stage AS ENUM (
  '-',
  'playgroup',
  'kindergarten',
  'elementary',
  'middle_school',
  'high_school',
  'college'
);

-- 2. Create CHILDREN table
CREATE TABLE children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  story TEXT,
  photo_url TEXT,
  educational_stage educational_stage DEFAULT '-',
  interests TEXT[],
  joined_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create STAFF table
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  description TEXT,
  bible_verse TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create NEWS table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better query performance
CREATE INDEX idx_children_educational_stage ON children(educational_stage);
CREATE INDEX idx_children_date_of_birth ON children(date_of_birth);
CREATE INDEX idx_children_joined_date ON children(joined_date);
CREATE INDEX idx_staff_name ON staff(name);
CREATE INDEX idx_news_published_at ON news(published_at DESC);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 7. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create triggers for auto-updating updated_at
CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Insert sample data (optional - remove if you don't want sample data)

-- Sample children
INSERT INTO children (name, date_of_birth, gender, story, educational_stage, interests, joined_date) VALUES
  (
    'Sarah Johnson',
    '2015-03-15',
    'female',
    'Sarah loves reading and drawing. She dreams of becoming an artist one day.',
    'elementary',
    ARRAY['reading', 'drawing', 'music'],
    '2020-01-10'
  ),
  (
    'Michael Chen',
    '2018-07-22',
    'male',
    'Michael is energetic and loves sports, especially soccer.',
    'kindergarten',
    ARRAY['soccer', 'swimming', 'lego'],
    '2022-05-15'
  ),
  (
    'Emma Rodriguez',
    '2016-11-08',
    'female',
    'Emma enjoys science and nature. She loves exploring the garden.',
    'elementary',
    ARRAY['science', 'gardening', 'animals'],
    '2021-03-20'
  );

-- Sample staff
INSERT INTO staff (name, role, photo_url, description, bible_verse) VALUES
  (
    'John Smith',
    'Director',
    '/staff/john-smith.jpg',
    'John has been serving at Insan Permata for over 10 years, dedicated to providing a loving home for children.',
    'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these. - Matthew 19:14'
  ),
  (
    'Mary Johnson',
    'House Mother',
    '/staff/mary-johnson.jpg',
    'Mary cares for the daily needs of our children with patience and love.',
    'She opens her arms to the poor and extends her hands to the needy. - Proverbs 31:20'
  );

-- Sample news
INSERT INTO news (title, excerpt, content, image_url, author) VALUES
  (
    'Welcome to Our New Children',
    'We are blessed to welcome three new children to our family this month.',
    'This month has been filled with joy as we welcomed three wonderful children to Insan Permata. Each child brings their own unique personality and talents. We are committed to providing them with a loving home, quality education, and spiritual guidance.',
    '/news/welcome-new-children.jpg',
    'John Smith'
  ),
  (
    'Annual Charity Event Success',
    'Thank you to all who participated in our annual charity event!',
    'Our annual charity event was a tremendous success! Thanks to the generosity of our supporters, we raised enough funds to support our children''s education for the entire year. The event featured performances by our children, a charity auction, and inspiring testimonies from our staff.',
    '/news/charity-event.jpg',
    'Mary Johnson'
  );

-- 10. Grant permissions (optional - only if you need specific user access)
-- This is usually handled by RLS policies, but included for completeness

-- Note: No RLS policies are created here because we're using the Service Role approach
-- The service role key bypasses RLS, and you control access in your Next.js code