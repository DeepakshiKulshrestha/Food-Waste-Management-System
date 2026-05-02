INSERT INTO Donor (name, contact_no, address) VALUES
('Sharma Caterers', '9000000001', 'Delhi'),
('Gupta Restaurant', '9000000002', 'Noida'),
('City Hotel', '9000000003', 'Gurgaon');

INSERT INTO NGO (ngo_name, location, contact_no) VALUES
('Helping Hands', 'Delhi', '8000000001'),
('Food For All', 'Noida', '8000000002');

INSERT INTO Volunteer (name, contact_no) VALUES
('Amit', '7000000001'),
('Priya', '7000000002');

INSERT INTO Food_Donation (donor_id, ngo_id, food_type, quantity, expiry_time) VALUES
(1, 1, 'Rice & Dal', 50, '2026-05-01 20:00:00'),  -- pending
(2, NULL, 'Chapati & Sabzi', 30, '2026-05-02 18:00:00'), -- unassigned NGO
(3, 2, 'Biryani', 40, '2026-05-03 21:00:00'), -- pending
(1, NULL, 'Paneer Curry', 25, '2026-05-01 19:00:00'); -- fully free

INSERT INTO Pickup (donation_id, volunteer_id) VALUES
(1, 1);   -- only 1 picked

INSERT INTO Distribution (donation_id, ngo_id, people_served) VALUES
(1, 1, 20);