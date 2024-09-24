from flask import Flask, render_template, request, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import text

app = Flask(__name__)
app.secret_key = "secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    user = db.relationship('User', backref=db.backref('expenses', lazy=True))

    def __repr__(self):
        return "<Expense %r>" % self.id

@app.route("/")
def home():
    if "email" in session:
        print("User is logged in. Redirecting to dashboard.")
        return redirect(url_for('dashboard'))
    print("User is not logged in. Rendering login page.")
    return render_template("userauth.html")

@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session["user_id"] = user.id
        session["email"] = email
        return redirect(url_for('dashboard'))
    else:
        return render_template("userauth.html", error="Invalid credentials")

@app.route("/signup", methods=["POST"])
def signup():
    email = request.form["email"]
    password = request.form["password"]
    user = User.query.filter_by(email=email).first()
    if user:
        return render_template("userauth.html", error="Email already exists")
    else:
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        session["email"] = email
        return redirect(url_for('dashboard'))

@app.route("/dashboard")
def dashboard():
    if "email" not in session:
        return redirect(url_for('home'))

    user_id = session["user_id"]

    # Fetch expenses and incomes, ordered by date in descending order
    expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()
    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.date.desc()).all()

    # No need to combine and sort in Python; they are already sorted in the database query.
    return render_template("dashboard.html", email=session["email"], expenses=expenses, incomes=incomes)

    
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route("/add_expense", methods=["POST"])
def index():
    if "email" not in session:
        return redirect(url_for('home'))
    expense_description = request.form["description"]
    expense_amount = request.form["amount"]
    user_id = session["user_id"]
    new_expense = Expense(description=expense_description, amount=expense_amount, user_id=user_id)
    try:
        db.session.add(new_expense)
        db.session.commit()
        return redirect(url_for('dashboard'))
    except:
        return "There was an issue adding your expense"

@app.route("/delete/<int:id>")
def delete(id):
    if "email" not in session:
        return redirect(url_for('home'))
    delete_expense = Expense.query.get_or_404(id)
    try:
        db.session.delete(delete_expense)
        db.session.commit()
        return redirect(url_for('dashboard'))
    except:
        return "There was a problem deleting that expense"

@app.route("/update/<int:id>", methods=["GET", "POST"])
def update(id):
    if "email" not in session:
        return redirect(url_for('home'))
    expense = Expense.query.get_or_404(id)
    if request.method == "POST":
        expense.description = request.form["description"]
        expense.amount = request.form["amount"]
        try:
            db.session.commit()
            return redirect(url_for('dashboard'))
        except:
            return "There was an issue updating your expense"
    else:
        return render_template("update.html", expense=expense)
    
     
class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    user = db.relationship('User', backref=db.backref('incomes', lazy=True))

@app.route("/add_income", methods=["POST"])
def add_income():
    if "email" not in session:
        return redirect(url_for('home'))
    income_description = request.form["description"]
    income_amount = request.form["amount"]
    user_id = session["user_id"]
    new_income = Income(description=income_description, amount=income_amount, user_id=user_id)
    try:
        db.session.add(new_income)
        db.session.commit()
        return redirect(url_for('dashboard'))
    except:
        return "There was an issue adding your income"

@app.route("/income")
def income():
    if "email" not in session:
        return redirect(url_for('home'))
    user_id = session["user_id"]
    incomes = Income.query.filter_by(user_id=user_id).order_by(Income.date.desc()).all()
    return render_template("income.html", email=session["email"], incomes=incomes)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
