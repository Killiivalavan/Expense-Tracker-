from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from app.models import Expense, Income
from itertools import chain
from operator import attrgetter
from datetime import datetime, timedelta
from sqlalchemy import func
from app import db

bp = Blueprint('dashboard', __name__)

@bp.route('/dashboard')
@login_required
def index():
    expenses = Expense.query.filter_by(user_id=current_user.id).all()
    incomes = Income.query.filter_by(user_id=current_user.id).all()

    transactions = list(chain(expenses, incomes))
    transactions.sort(key=attrgetter('date'), reverse=True)

    return render_template("dashboard.html", transactions=transactions)

@bp.route('/total_balance')
@login_required
def total_balance():
    total_expense = sum(expense.amount for expense in current_user.expenses)
    total_income = sum(income.amount for income in current_user.incomes)
    
    response_data = {
        'total_expense': float(total_expense),
        'total_income': float(total_income)
    }
    print(f"Sending data: {response_data}")
    return jsonify(response_data)

@bp.route('/monthly_expenses')
@login_required
def monthly_expenses():
    if 'start_date' in request.args and 'end_date' in request.args:
        # Handle custom date range
        try:
            start_date = datetime.strptime(request.args.get('start_date'), '%Y-%m-%d')
            end_date = datetime.strptime(request.args.get('end_date'), '%Y-%m-%d')
            # Add one day to end_date to include the full day
            end_date = end_date + timedelta(days=1)
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
    else:
        # Handle predefined periods
        days = int(request.args.get('days', 30))
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
    
    # Query daily expenses for the specified period
    daily_expenses = db.session.query(
        func.date(Expense.date).label('date'),
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.user_id == current_user.id,
        Expense.date >= start_date,
        Expense.date < end_date
    ).group_by(
        func.date(Expense.date)
    ).order_by(
        func.date(Expense.date)
    ).all()
    
    # Format the data for the chart
    dates = []
    amounts = []
    
    for expense in daily_expenses:
        dates.append(str(expense.date))
        amounts.append(float(expense.total))
    
    return jsonify({
        'dates': dates,
        'amounts': amounts
    })

