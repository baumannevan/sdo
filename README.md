# How to Set Up This Project

Follow these steps to set up and run the project:

## 1. Set Up the Database

> **Note:**  
> Run the following commands in your terminal or MySQL shell.  
> Use code blocks for better readability.

```bash
# Log in to MySQL as root:
sudo mysql -u root -p
```

```sql
-- Create the user and grant privileges (if not already done):
CREATE USER 'development'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON sdo.* TO 'development'@'localhost';
FLUSH PRIVILEGES;
```

```sql
-- If the user already exists and you want to reset the password:
ALTER USER 'development'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

```sql
-- Exit MySQL:
exit
```

## 2. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
npm install
```

## 3. Run the Project

To start the client using Vite, run:

```bash
cd client
npm run dev
```

This will launch the development server. Open your browser and follow the instructions in the terminal to access the application.
