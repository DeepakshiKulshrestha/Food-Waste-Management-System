DELIMITER $$

CREATE TRIGGER trg_check_expiry
BEFORE INSERT ON Food_Donation
FOR EACH ROW
BEGIN
    IF NEW.expiry_time < NOW() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot donate expired food';
    END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_after_pickup
AFTER INSERT ON Pickup
FOR EACH ROW
BEGIN
    UPDATE Food_Donation
    SET status = 'Picked'
    WHERE donation_id = NEW.donation_id;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_after_distribution
AFTER INSERT ON Distribution
FOR EACH ROW
BEGIN
    UPDATE Food_Donation
    SET status = 'Distributed'
    WHERE donation_id = NEW.donation_id;
END$$

DELIMITER ;
DELIMITER $$
 
CREATE TRIGGER trg_prevent_status_downgrade
BEFORE UPDATE ON Food_Donation
FOR EACH ROW
BEGIN
    IF OLD.status = 'Distributed' AND NEW.status != 'Distributed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ERROR: Cannot change status of already Distributed donation.';
    END IF;
 
    IF OLD.status = 'Picked' AND NEW.status = 'Pending' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ERROR: Cannot revert Picked donation back to Pending.';
    END IF;
END$$
 
DELIMITER ;
 DELIMITER $$
 
CREATE TRIGGER trg_validate_quantity
BEFORE INSERT ON Food_Donation
FOR EACH ROW
BEGIN
    IF NEW.quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ERROR: Food quantity must be greater than 0.';
    END IF;
END$$
 
DELIMITER ;
 
