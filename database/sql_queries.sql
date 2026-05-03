USE FoodWasteManagement;

SELECT 
    f.donation_id, d.name AS Donor_Name, n.ngo_name AS NGO_Name,
    f.food_type, f.quantity, f.status, f.expiry_time, f.donation_date
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
LEFT JOIN NGO n ON f.ngo_id = n.ngo_id
ORDER BY f.donation_date DESC;

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity, f.expiry_time
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
WHERE f.status = 'Pending';

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity,
    v.name AS Volunteer_Name, p.pickup_time, p.pickup_status
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
JOIN Pickup p ON f.donation_id = p.donation_id
JOIN Volunteer v ON p.volunteer_id = v.volunteer_id
WHERE f.status = 'Picked';

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity,
    n.ngo_name AS NGO_Name, dist.people_served, dist.distribution_date
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
JOIN Distribution dist ON f.donation_id = dist.donation_id
JOIN NGO n ON dist.ngo_id = n.ngo_id
WHERE f.status = 'Distributed';

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity, f.expiry_time
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
WHERE f.ngo_id IS NULL;

SELECT 
    d.name AS Donor_Name,
    COUNT(f.donation_id) AS Total_Donations,
    SUM(f.quantity) AS Total_Quantity_Donated
FROM Donor d
JOIN Food_Donation f ON d.donor_id = f.donor_id
GROUP BY d.donor_id, d.name
ORDER BY Total_Quantity_Donated DESC;

SELECT 
    n.ngo_name AS NGO_Name,
    COUNT(dist.distribution_id) AS Total_Distributions,
    SUM(dist.people_served) AS Total_People_Served,
    SUM(f.quantity) AS Total_Food_Received
FROM NGO n
JOIN Distribution dist ON n.ngo_id = dist.ngo_id
JOIN Food_Donation f ON dist.donation_id = f.donation_id
GROUP BY n.ngo_id, n.ngo_name
ORDER BY Total_People_Served DESC;

SELECT 
    v.name AS Volunteer_Name,
    COUNT(p.pickup_id) AS Total_Pickups
FROM Volunteer v
LEFT JOIN Pickup p ON v.volunteer_id = p.volunteer_id
GROUP BY v.volunteer_id, v.name
ORDER BY Total_Pickups DESC;

SELECT 
    food_type,
    COUNT(*) AS Donation_Count,
    SUM(quantity) AS Total_Quantity,
    AVG(quantity) AS Avg_Quantity
FROM Food_Donation
GROUP BY food_type
ORDER BY Total_Quantity DESC;

SELECT 
    status AS Donation_Status,
    COUNT(donation_id) AS Count
FROM Food_Donation
GROUP BY status;

SELECT 
    d.name AS Donor_Name,
    SUM(f.quantity) AS Total_Donated
FROM Donor d
JOIN Food_Donation f ON d.donor_id = f.donor_id
GROUP BY d.donor_id, d.name
HAVING SUM(f.quantity) > (SELECT AVG(quantity) FROM Food_Donation);

SELECT 
    v.volunteer_id, v.name AS Volunteer_Name, v.contact_no
FROM Volunteer v
WHERE v.volunteer_id NOT IN (SELECT DISTINCT volunteer_id FROM Pickup);

SELECT 
    n.ngo_id, n.ngo_name AS NGO_Name, n.location
FROM NGO n
WHERE n.ngo_id NOT IN (SELECT DISTINCT ngo_id FROM Distribution);

SELECT 
    f.donation_id, d.name AS Donor, f.food_type, f.quantity, f.status,
    v.name AS Volunteer, p.pickup_time,
    n.ngo_name AS NGO, dist.people_served, dist.distribution_date
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
LEFT JOIN Pickup p ON f.donation_id = p.donation_id
LEFT JOIN Volunteer v ON p.volunteer_id = v.volunteer_id
LEFT JOIN Distribution dist ON f.donation_id = dist.donation_id
LEFT JOIN NGO n ON dist.ngo_id = n.ngo_id
ORDER BY f.donation_id;

SELECT 
    d.name AS Top_Donor, SUM(f.quantity) AS Total_Quantity
FROM Donor d
JOIN Food_Donation f ON d.donor_id = f.donor_id
GROUP BY d.donor_id, d.name
ORDER BY Total_Quantity DESC
LIMIT 1;

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity, f.status
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
WHERE DATE(f.donation_date) = CURDATE();

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type,
    f.quantity, f.expiry_time, f.status
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
WHERE f.expiry_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 24 HOUR)
AND f.status = 'Pending';

SELECT 
    YEAR(donation_date) AS Year,
    MONTH(donation_date) AS Month,
    COUNT(donation_id) AS Total_Donations,
    SUM(quantity) AS Total_Quantity
FROM Food_Donation
GROUP BY YEAR(donation_date), MONTH(donation_date)
ORDER BY Year DESC, Month DESC;

SELECT 
    (SELECT SUM(quantity) FROM Food_Donation) AS Total_Food_Donated,
    (SELECT SUM(f.quantity) FROM Food_Donation f WHERE f.status = 'Distributed') AS Total_Food_Distributed,
    (SELECT SUM(people_served) FROM Distribution) AS Total_People_Served,
    ROUND(
        (SELECT SUM(f.quantity) FROM Food_Donation f WHERE f.status = 'Distributed')
        / (SELECT SUM(quantity) FROM Food_Donation) * 100, 2
    ) AS Distribution_Efficiency_Percent;

SELECT 
    ROUND(AVG(quantity), 2) AS Avg_Quantity_Per_Donation,
    MIN(quantity) AS Min_Quantity,
    MAX(quantity) AS Max_Quantity,
    SUM(quantity) AS Grand_Total
FROM Food_Donation;

SELECT 
    n.ngo_name, dist.distribution_date,
    dist.people_served, f.food_type, f.quantity
FROM Distribution dist
JOIN NGO n ON dist.ngo_id = n.ngo_id
JOIN Food_Donation f ON dist.donation_id = f.donation_id
WHERE dist.people_served > 10
ORDER BY dist.people_served DESC;

SELECT 'Total Donors' AS Metric, COUNT(*) AS Value FROM Donor
UNION ALL SELECT 'Total NGOs', COUNT(*) FROM NGO
UNION ALL SELECT 'Total Volunteers', COUNT(*) FROM Volunteer
UNION ALL SELECT 'Total Donations', COUNT(*) FROM Food_Donation
UNION ALL SELECT 'Pending Donations', COUNT(*) FROM Food_Donation WHERE status = 'Pending'
UNION ALL SELECT 'Picked Donations', COUNT(*) FROM Food_Donation WHERE status = 'Picked'
UNION ALL SELECT 'Distributed', COUNT(*) FROM Food_Donation WHERE status = 'Distributed'
UNION ALL SELECT 'Total Food (units)', SUM(quantity) FROM Food_Donation
UNION ALL SELECT 'People Served', SUM(people_served) FROM Distribution;

SELECT 
    d.name AS Donor_Name,
    COUNT(f.donation_id) AS Total_Donations,
    SUM(f.quantity) AS Total_Quantity,
    ROUND(AVG(f.quantity), 2) AS Avg_Per_Donation
FROM Donor d
JOIN Food_Donation f ON d.donor_id = f.donor_id
GROUP BY d.donor_id, d.name
ORDER BY Total_Donations DESC;

SELECT 
    f.donation_id, d.name AS Donor_Name, f.food_type, f.quantity
FROM Food_Donation f
JOIN Donor d ON f.donor_id = d.donor_id
WHERE f.quantity = (SELECT MAX(quantity) FROM Food_Donation);

SELECT 
    v.name AS Volunteer_Name,
    COUNT(p.pickup_id) AS Total_Pickups,
    COALESCE(SUM(f.quantity), 0) AS Total_Food_Handled
FROM Volunteer v
LEFT JOIN Pickup p ON v.volunteer_id = p.volunteer_id
LEFT JOIN Food_Donation f ON p.donation_id = f.donation_id
GROUP BY v.volunteer_id, v.name
ORDER BY Total_Pickups DESC;

SELECT * FROM Food_Donation;
SELECT * FROM Pickup;
SELECT * FROM Distribution;
SHOW TRIGGERS;
SHOW PROCEDURE STATUS WHERE Db = 'FoodWasteManagement';