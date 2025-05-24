select * from accounts_user
select * from donations_foodcategory
select * from waste_tracking_wastecategory

INSERT INTO waste_tracking_wastecategory (name, description) VALUES
  ('Spoiled', 'Food that has spoiled and is no longer safe to eat'),
  ('Expired', 'Food that is past its expiration date'),
  ('Leftovers', 'Uneaten leftovers from meals'),
  ('Other', 'Other types of food waste');

INSERT INTO donations_foodcategory (name, description) VALUES
  ('Fruits', 'Fresh and preserved fruits'),
  ('Vegetables', 'Leafy greens, root vegetables, etc.'),
  ('Bakery', 'Bread, pastries, and baked goods'),
  ('Dairy', 'Milk, cheese, yogurt, etc.'),
  ('Meat', 'Chicken, beef, pork, etc.');