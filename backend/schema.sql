-- main'links' table
CREATE TABLE links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  short_link VARCHAR(10) UNIQUE NOT NULL,  -- Base62 code
  long_link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- for analytics, 
-- count will be generated from count all instances of the link id under logs
CREATE TABLE click_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  link_id INT NOT NULL,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

--summary counter (faster read, no need to calc firsrt)
CREATE TABLE click_summary (
  link_id INT PRIMARY KEY,
  last_clicked_at TIMESTAMP,
  total_clicks INT DEFAULT 0,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_short_link ON links (short_link);
CREATE INDEX idx_click_logs_link_id ON click_logs(link_id);
CREATE INDEX idx_click_logs_time ON click_logs(clicked_at);