-- main'links' table
CREATE TABLE links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  short_link VARCHAR(10) UNIQUE NOT NULL,  -- Base62 code
  long_link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 'counter' table (only counts)
CREATE TABLE counter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  link_id INT NOT NULL,
  count INT DEFAULT 1,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_short_link ON links (short_link);
CREATE INDEX idx_link_id ON counter (link_id);