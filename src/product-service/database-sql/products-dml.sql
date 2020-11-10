-- Products Service Database filling

-- Products filling
INSERT INTO products (title, description, imageUrl, price) VALUES
('Hohner HC 03', 'Hohner HC 03 guitar', 'https://i.ibb.co/t48k4JJ/Honer-HC-03.png', 120),
('Hohner HC 06', 'Hohner HC 06 guitar', 'https://i.ibb.co/5v37th8/Honer-HC-06.png', 140),
('Yamaha F310', 'Yamaha F310 super guitar', 'https://i.ibb.co/GH2n7Gj/Yamaha-F310.jpg', 220),
('Yamaha F370', 'Yamaha F370 black guitar', 'https://i.ibb.co/z4P9GSZ/Yamaha-F370-Black.jpg', 300),
('Yamaha FG800', 'Yamaha FG800 awesome guitar', 'https://i.ibb.co/Vjvg9hN/Yamaha-FG800.jpg', 350),
('Yamaha FG-TA BL', 'Yamaha FG-TA BL electroaccoustic guitar', 'https://i.ibb.co/Z8yD88c/Yamaha-FG-TA-BL.jpg', 1000),
('Cort AD810M OP', 'Cort AD810M OP cheep guitar', 'https://i.ibb.co/tbpgPhj/Cort-AD810-M.jpg', 140),
('Fender CD-60SCE', 'Fender CD-60SCE like a rock star guitar', 'https://i.ibb.co/QChpDJn/Fender-CD-60-SCE.jpg', 544);

-- Stocks filling
INSERT INTO stocks (product_id, count) VALUES
('paste_guitar_uuid', 10),
('paste_guitar_uuid', 7),
('paste_guitar_uuid', 5),
('paste_guitar_uuid', 4),
('paste_guitar_uuid', 1),
('paste_guitar_uuid', 3),
('paste_guitar_uuid', 3),
('paste_guitar_uuid', 8);


-- Items Selection
-- Products
SELECT * FROM products
-- Stocks
SELECT * FROM stocks

-- Products with stocks
SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count FROM products p INNER JOIN stocks s ON (s.product_id = p.id)
-- Product by ID
SELECT p.id, p.title, p.description, p.imageUrl, p.price, s.count FROM products p INNER JOIN stocks s ON (s.product_id = p.id) WHERE (p.id = 'paste_guitar_uuid')
