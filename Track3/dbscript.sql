------------------Table DDL for clients
CREATE TABLE
  "clients" ( "client_id" INT
  PRIMARY KEY
    ,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "dateofbirth" DATE,
    "gender" VARCHAR(10),
    "address" VARCHAR(100),
    "phonenumber" VARCHAR(20),
    "email" VARCHAR(100),
    "occupation" TEXT,
    "annualincome" INT,
    "salary" INT,
    "ltcg" INT,
    "stcg" INT );

------------------------Sample insert statements

INSERT INTO clients (client_id, firstname, lastname, dateofbirth, gender, address, phonenumber, email, occupation, annualincome, salary, ltcg, stcg) VALUES
(1, 'Aarav', 'Patel', '1992-07-13', 'Male', '101, Main St, City', '555-0101', 'aarav.patel@example.com', 'Marketing Manager', 2836786, 2583724, 169237, 83825),
(2, 'Zara', 'Khan', '1981-07-12', 'Female', '102, Main St, City', '555-0102', 'zara.khan@example.com', 'Software Engineer', 1312523, 1135292, 146598, 30633),
(3, 'Vihaan', 'Sharma', '1993-07-20', 'Male', '103, Main St, City', '555-0103', 'vihaan.sharma@example.com', 'Architect', 2845717, 2680681, 113147, 51889),
(4, 'Ananya', 'Gupta', '1986-01-08', 'Female', '104, Main St, City', '555-0104', 'ananya.gupta@example.com', 'Data Scientist', 943822, 776279, 141856, 25687),
(5, 'Arjun', 'Nair', '1992-05-12', 'Male', '105, Main St, City', '555-0105', 'arjun.nair@example.com', 'Graphic Designer', 2049237, 1884769, 83949, 80519),
(6, 'Saanvi', 'Verma', '1980-01-01', 'Female', '106, Main St, City', '555-0106', 'saanvi.verma@example.com', 'Architect', 2396474, 2225732, 80873, 89869),
(7, 'Ishaan', 'Malhotra', '2000-05-31', 'Male', '107, Main St, City', '555-0107', 'ishaan.malhotra@example.com', 'Graphic Designer', 3016191, 2892692, 87473, 36026),
(8, 'Kyra', 'Iyer', '1983-08-19', 'Female', '108, Main St, City', '555-0108', 'kyra.iyer@example.com', 'Doctor', 980831, 781022, 191737, 8072),
(9, 'Reyansh', 'Singh', '1977-07-17', 'Male', '109, Main St, City', '555-0109', 'reyansh.singh@example.com', 'Marketing Manager', 2206757, 2078018, 56748, 71991),
(10, 'Myra', 'Joshi', '1985-09-29', 'Female', '110, Main St, City', '555-0110', 'myra.joshi@example.com', 'Financial Analyst', 2448310, 2194617, 171815, 81878);


---------------------------Ensure your table has the storage columns ready(reset to '0')---

ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS tax_liability INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_loss_suggested INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_gain_suggested INT DEFAULT 0;

-----------------------check db is updated for client id 1---

SELECT
  "clients"."client_id",
  "clients"."firstname",
  "clients"."lastname",
  "clients"."dateofbirth",
  "clients"."gender",
  "clients"."address",
  "clients"."phonenumber",
  "clients"."email",
  "clients"."occupation",
  "clients"."annualincome",
  "clients"."salary",
  "clients"."ltcg",
  "clients"."stcg",
  "clients"."tax_liability",
  "clients"."tax_loss_suggested",
  "clients"."tax_gain_suggested",
  "clients"."embedding"
FROM
  "clients"
WHERE
  "clients"."client_id" = 1;
  ---------------------------------


-- Generate embeddings
UPDATE clients 
SET embedding = embedding('text-embedding-005', firstname || ' ' || lastname)::vector
WHERE embedding IS NULL;
EOF


-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  client_id INT PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  dateofbirth DATE,
  gender VARCHAR(10),
  address VARCHAR(100),
  phonenumber VARCHAR(20),
  email VARCHAR(100),
  occupation TEXT,
  annualincome INT,
  salary INT,
  ltcg INT,
  stcg INT,
  tax_liability INT DEFAULT 0,
  tax_loss_suggested INT DEFAULT 0,
  tax_gain_suggested INT DEFAULT 0,
  embedding vector(768)
);

-- Sample data
INSERT INTO clients (client_id, firstname, lastname, dateofbirth, gender, address, phonenumber, email, occupation, annualincome, salary, ltcg, stcg) VALUES
(1, 'Aarav', 'Patel', '1992-07-13', 'Male', '101, Main St, City', '555-0101', 'aarav.patel@example.com', 'Marketing Manager', 2836786, 2583724, 169237, 83825),
(2, 'Zara', 'Khan', '1981-07-12', 'Female', '102, Main St, City', '555-0102', 'zara.khan@example.com', 'Software Engineer', 1312523, 1135292, 146598, 30633),
(3, 'Vihaan', 'Sharma', '1993-07-20', 'Male', '103, Main St, City', '555-0103', 'vihaan.sharma@example.com', 'Architect', 2845717, 2680681, 113147, 51889),
(4, 'Ananya', 'Gupta', '1986-01-08', 'Female', '104, Main St, City', '555-0104', 'ananya.gupta@example.com', 'Data Scientist', 943822, 776279, 141856, 25687),
(5, 'Arjun', 'Nair', '1992-05-12', 'Male', '105, Main St, City', '555-0105', 'arjun.nair@example.com', 'Graphic Designer', 2049237, 1884769, 83949, 80519),
(6, 'Saanvi', 'Verma', '1980-01-01', 'Female', '106, Main St, City', '555-0106', 'saanvi.verma@example.com', 'Architect', 2396474, 2225732, 80873, 89869),
(7, 'Ishaan', 'Malhotra', '2000-05-31', 'Male', '107, Main St, City', '555-0107', 'ishaan.malhotra@example.com', 'Graphic Designer', 3016191, 2892692, 87473, 36026),
(8, 'Kyra', 'Iyer', '1983-08-19', 'Female', '108, Main St, City', '555-0108', 'kyra.iyer@example.com', 'Doctor', 980831, 781022, 191737, 8072),
(9, 'Reyansh', 'Singh', '1977-07-17', 'Male', '109, Main St, City', '555-0109', 'reyansh.singh@example.com', 'Marketing Manager', 2206757, 2078018, 56748, 71991),
(10, 'Myra', 'Joshi', '1985-09-29', 'Female', '110, Main St, City', '555-0110', 'myra.joshi@example.com', 'Financial Analyst', 2448310, 2194617, 171815, 81878)
ON CONFLICT (client_id) DO NOTHING;
