# writeMe Blog Project

This project is a blog application built with React Vite for the frontend and Laravel 11 for the backend.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PHP](https://www.php.net/) (v8.1 or later)
- [Composer](https://getcomposer.org/)
- [MySQL](https://www.mysql.com/) or another database supported by Laravel

## Getting Started

Follow these steps to get the project running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/PathumLD/Paralax-Project.git
cd Paralax-Project
```

### 2. Backend Setup (Laravel)

a. Navigate to the backend directory:
```bash
cd backend
```

b. Install PHP dependencies:
```bash
composer install
```

c. Create a copy of the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```

d. Generate an application key:
```bash
php artisan key:generate
```

e. Configure your database in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=blog
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

f. Run database migrations:
```bash
php artisan migrate
```

g. Start the Laravel development server:
```bash
php artisan serve
```

The backend should now be running at `http://localhost:8000`.

### 3. Frontend Setup (React Vite)

a. Navigate to the frontend directory:
```bash
cd ../frontend
```

b. Install JavaScript dependencies:
```bash
npm install
# or
yarn install
```

c. Create a `.env` file in the frontend directory and add the backend API URL:
```
VITE_API_URL=http://localhost:8000/api
```

d. Start the Vite development server:
```bash
npm run dev
# or
yarn dev
```

The frontend should now be running at `http://localhost:5173`.

## Usage

Open your web browser and visit `http://localhost:5173` to access the writeMe blog application. The backend API will be accessible at `http://localhost:8000/api`.


If you encounter any issues or have questions, please open an issue on the GitHub repository.
