-- เพิ่มเมนูหลัก "อาหาร"
INSERT INTO Manage_menu (menu_name, menu_url, access_level, menu_order, path, status, parent_id, created_at, updated_at)
VALUES ('อาหาร', '/menu/thai-food', 1, 1, '/menu/thai-food', true, NULL, NOW(), NOW());

-- เพิ่มเมนูย่อย "อาหารไทย"
INSERT INTO Manage_menu (menu_name, menu_url, access_level, menu_order, path, status, parent_id, created_at, updated_at)
VALUES ('อาหารไทย', '/menu/thai-food/thai-cuisine', 2, 1, '/menu/thai-food/thai-cuisine', true, 1, NOW(), NOW());

-- เพิ่มเมนูย่อย "อาหารจีน"
INSERT INTO Manage_menu (menu_name, menu_url, access_level, menu_order, path, status, parent_id, created_at, updated_at)
VALUES ('อาหารจีน', '/menu/thai-food/chinese-cuisine', 2, 2, '/menu/thai-food/chinese-cuisine', true, 1, NOW(), NOW());

-- เพิ่มเมนูย่อย "อาหารญี่ปุ่น"
INSERT INTO Manage_menu (menu_name, menu_url, access_level, menu_order, path, status, parent_id, created_at, updated_at)
VALUES ('อาหารญี่ปุ่น', '/menu/thai-food/japanese-cuisine', 2, 3, '/menu/thai-food/japanese-cuisine', true, 1, NOW(), NOW());
