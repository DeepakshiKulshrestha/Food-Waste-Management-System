DELIMITER $$

CREATE PROCEDURE get_pending_donations()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE d_id INT;
    DECLARE qty INT;

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
    SELECT SUM(quantity) AS Total_Food FROM Food_Donation;
END$$

DELIMITER ;