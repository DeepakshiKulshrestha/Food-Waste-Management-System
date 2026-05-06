DELIMITER $$

CREATE PROCEDURE get_pending_donations()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE d_id INT;
    DECLARE qty INT;
      DECLARE f_type VARCHAR(50);

    DECLARE cur CURSOR FOR 
        SELECT donation_id, quantity 
        FROM Food_Donation 
        WHERE status = 'Pending';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO d_id, qty;

        IF done THEN
            LEAVE read_loop;
        END IF;

        SELECT d_id AS Donation_ID, qty AS Quantity;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE total_food_quantity()
BEGIN
    SELECT SUM(quantity) AS Total_Food,
    COUNT(donation_id)     AS Total_Donations,
	ROUND(AVG(quantity),2) AS Avg_Quantity_Per_Donation FROM Food_Donation;
END$$

DELIMITER ;
DELIMITER $$
 
CREATE PROCEDURE get_ngo_distribution_report()
BEGIN
    DECLARE done     INT DEFAULT FALSE;
    DECLARE v_ngo_id INT;
    DECLARE v_name   VARCHAR(50);
    DECLARE v_loc    VARCHAR(100);
 
    -- CURSOR: loops through all NGOs
    DECLARE ngo_cur CURSOR FOR
        SELECT ngo_id, ngo_name, location FROM NGO;
 
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
 
    OPEN ngo_cur;
 
    ngo_loop: LOOP
        FETCH ngo_cur INTO v_ngo_id, v_name, v_loc;
 
        IF done THEN
            LEAVE ngo_loop;
        END IF;
 
        -- For each NGO, fetch its distribution summary
        SELECT 
            v_name                      AS NGO_Name,
            v_loc                       AS Location,
            COUNT(d.distribution_id)    AS Total_Distributions,
            COALESCE(SUM(d.people_served), 0) AS People_Served,
            COALESCE(SUM(f.quantity), 0)      AS Food_Received
        FROM Distribution d
        JOIN Food_Donation f ON d.donation_id = f.donation_id
        WHERE d.ngo_id = v_ngo_id;
 
    END LOOP;
 
    CLOSE ngo_cur;
END$$
 
DELIMITER ;
DELIMITER $$
 
CREATE PROCEDURE get_volunteer_report()
BEGIN
    DECLARE done     INT DEFAULT FALSE;
    DECLARE v_id     INT;
    DECLARE v_name   VARCHAR(50);
    DECLARE v_contact VARCHAR(15);
 
    -- CURSOR: loops through all volunteers
    DECLARE vol_cur CURSOR FOR
        SELECT volunteer_id, name, contact_no FROM Volunteer;
 
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
 
    OPEN vol_cur;
 
    vol_loop: LOOP
        FETCH vol_cur INTO v_id, v_name, v_contact;
 
        IF done THEN
            LEAVE vol_loop;
        END IF;
 
        -- For each volunteer, show pickup summary
        SELECT 
            v_name                      AS Volunteer_Name,
            v_contact                   AS Contact,
            COUNT(p.pickup_id)          AS Total_Pickups,
            COALESCE(SUM(f.quantity), 0) AS Total_Food_Handled
        FROM Pickup p
        JOIN Food_Donation f ON p.donation_id = f.donation_id
        WHERE p.volunteer_id = v_id;
 
    END LOOP;
 
    CLOSE vol_cur;
END$$
 
DELIMITER ;
USE FoodWasteManagement;
CALL total_food_quantity();