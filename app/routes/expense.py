from flask import Blueprint, request, redirect, url_for, flash, render_template
from flask_login import login_required, current_user
from app.models import Expense
from app import db
from datetime import datetime
from app.services.categorizer import load_categorizer

bp = Blueprint('expense', __name__)
categorizer = load_categorizer()

@bp.route('/add', methods=['POST'])
@login_required
def add_expense():
    description = request.form['description']
    amount = float(request.form['amount'])
    
    # Automatically set the date to current timestamp
    new_expense = Expense(
        description=description, 
        amount=amount, 
        date=datetime.utcnow(),
        user_id=current_user.id
    )
    
    db.session.add(new_expense)
    db.session.commit()
    
    flash('Expense added successfully!')
    return redirect(url_for('dashboard.index'))

@bp.route('/update_expense/<int:id>', methods=['GET', 'POST'])
@login_required
def update_expense(id):
    expense = Expense.query.get_or_404(id)
    if expense.user_id != current_user.id:
        flash('You do not have permission to edit this expense.', 'error')
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        expense.description = request.form['description']
        expense.amount = request.form['amount']
        expense.category = categorizer.predict(expense.description)
        db.session.commit()
        flash('Expense updated successfully!', 'success')
        return redirect(url_for('dashboard.index'))

    return render_template('expense/update.html', expense=expense)

@bp.route('/delete_expense/<int:id>', methods=['POST'])
@login_required
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    if expense.user_id != current_user.id:
        flash('You do not have permission to delete this expense.', 'error')
        return redirect(url_for('dashboard.index'))

    db.session.delete(expense)
    db.session.commit()
    flash('Expense deleted successfully!', 'success')
    return redirect(url_for('dashboard.index'))
