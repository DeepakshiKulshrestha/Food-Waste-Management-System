CREATE TABLE Donor (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    contact_no VARCHAR(15) UNIQUE NOT NULL,
    address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NGO (
    ngo_id INT AUTO_INCREMENT PRIMARY KEY,
    ngo_name VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    contact_no VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Volunteer (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    contact_no VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Food_Donation (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    ngo_id INT,
    food_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    expiry_time DATETIME NOT NULL,
    donation_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(20) DEFAULT 'Pending',

    FOREIGN KEY (donor_id) REFERENCES Donor(donor_id)
    ON DELETE CASCADE,

    FOREIGN KEY (ngo_id) REFERENCES NGO(ngo_id)
    ON DELETE SET NULL
);

CREATE TABLE Pickup (
    pickup_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    pickup_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    pickup_status VARCHAR(20) DEFAULT 'Pending',

    FOREIGN KEY (donation_id) REFERENCES Food_Donation(donation_id)
    ON DELETE CASCADE,

    FOREIGN KEY (volunteer_id) REFERENCES Volunteer(volunteer_id)
    ON DELETE CASCADE
);

CREATE TABLE Distribution (
    distribution_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    ngo_id INT NOT NULL,
    people_served INT CHECK (people_served >= 0),
    distribution_date DATE DEFAULT (CURRENT_DATE),

    FOREIGN KEY (donation_id) REFERENCES Food_Donation(donation_id)
    ON DELETE CASCADE,

    FOREIGN KEY (ngo_id) REFERENCES NGO(ngo_id)
    ON DELETE CASCADE
);