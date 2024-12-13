# Expense Tracker

A sophisticated web-based expense tracking application built with Flask that helps users manage and analyze their personal finances. The application features AI-powered expense categorization, detailed reporting, and a secure user authentication system.

## Features

### Core Features
- User authentication and authorization with secure password hashing
- Expense tracking with CRUD operations
- Automatic expense categorization using Machine Learning
- Detailed expense reports and analytics
- Secure data storage with SQLite
- RESTful API endpoints for expense management

### AI-Powered Categorization
The application uses Machine Learning to automatically categorize expenses into:
- Groceries
- Transportation
- Entertainment
- Utilities
- Dining Out

The categorization system uses:
- TF-IDF Vectorization for text processing
- Multinomial Naive Bayes classifier
- Scikit-learn pipeline for streamlined processing
- Accuracy scoring and model evaluation

## Tech Stack

### Backend
- Python 3.x
- Flask 3.0.3 web framework
- SQLAlchemy 2.0.32 for ORM
- Flask-Login 0.6.3 for user session management
- Flask-Migrate for database migrations
- scikit-learn 1.5.2 for AI categorization

### Database
- SQLite for data storage
- SQLAlchemy for database operations
- Alembic for database migrations

### Security
- Password hashing and salting
- Session-based authentication
- CSRF protection
- Secure database queries with SQLAlchemy

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd expense-tracker
```

2. Create and activate a virtual environment:
```bash
python -m venv exptrackervenv
# On Windows
exptrackervenv\Scripts\activate
# On Unix or MacOS
source exptrackervenv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

### Database Setup
1. Configure your database URI in `config.py`:
```python
SQLALCHEMY_DATABASE_URI = "sqlite:///user.db"
```

### Environment Variables
Required environment variables:
- `SECRET_KEY`: Application secret key
- `DATABASE_URL`: Database connection string (defaults to SQLite)
- `DEBUG`: Development mode flag (True/False)

## API Documentation

### Expense Endpoints

#### GET /
- Description: Dashboard view showing all expenses
- Response: HTML template with expense list

#### POST /
- Description: Add new expense
- Parameters:
  - description (string): Expense description
  - amount (float): Expense amount
- Response: Redirects to dashboard

#### GET /delete/<int:id>
- Description: Delete specific expense
- Parameters:
  - id (integer): Expense ID
- Response: Redirects to dashboard

#### GET/POST /update/<int:id>
- Description: Update existing expense
- Parameters:
  - id (integer): Expense ID
  - description (string): New description
  - amount (float): New amount
- Response: Redirects to dashboard

## Database Schema

### Expense Model
```python
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
```

## AI Categorization System

The `ExpenseCategorizer` class provides intelligent expense categorization:

```python
categorizer = ExpenseCategorizer()
# Training
categorizer.train(descriptions, categories)
# Prediction
predicted_category = categorizer.predict(description)
```

### Training Process
1. Text vectorization using TF-IDF
2. Naive Bayes classification
3. Model evaluation with accuracy scoring
4. Category prediction for new expenses

## Project Structure

```
expense-tracker/
├── app/                    # Main application package
├── src/                    # Additional source code
├── instance/              # Instance-specific files
├── run.py                 # Application entry point
├── config.py              # Configuration settings
├── userauth.py            # User authentication
├── categorizerai.py       # AI categorization
├── requirements.txt       # Project dependencies
└── README.md             # Documentation
```

### Key Files
- `app.py`: Core application logic and routes
- `categorizerai.py`: ML-based expense categorization
- `userauth.py`: User authentication system
- `config.py`: Application configuration
- `run.py`: Application entry point

## Development

### Setting Up Development Environment
1. Install development dependencies:
```bash
pip install -r requirements.txt
```

2. Set up pre-commit hooks:
```bash
pre-commit install
```

### Running Tests
```bash
python -m pytest tests/
```

### Code Style
- Follow PEP 8 guidelines
- Use type hints for function parameters
- Document all functions and classes

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes:
```bash
git commit -m 'Add some feature'
```
4. Push to the branch:
```bash
git push origin feature/your-feature-name
```
5. Create a Pull Request

### Pull Request Guidelines
- Include test cases for new features
- Update documentation as needed
- Follow the existing code style
- One feature per pull request

## Troubleshooting

### Common Issues
1. Database connection errors:
   - Check database URI in config.py
   - Verify database file permissions

2. Dependencies issues:
   - Ensure all requirements are installed
   - Check Python version compatibility

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flask framework and its contributors
- scikit-learn for ML capabilities
- SQLAlchemy team for the ORM system 