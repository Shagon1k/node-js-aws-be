-- Products Service Database tables creation

-- Products table creation
DROP TABLE products
CREATE TABLE IF NOT EXISTS products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,        -- guitar's name
  description text,           -- guitar's description
  imageUrl text,              -- guitar's image url
  price integer               -- guitar's price (in USD)
)

-- Stocks table creation
DROP TABLE stocks
CREATE TABLE IF NOT EXISTS stocks (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid,            -- related (ref) guitar's id
  count integer,              -- guitar's stock level
  foreign key ("product_id") references "products" ("id")
)
