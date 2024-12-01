from flask import Blueprint, request, redirect, url_for, flash, render_template
from flask_login import login_required, current_user
from app.models import Income
from app import db
from datetime import datetime

bp = Blueprint('income', __name__)

@bp.route('/add', methods=['POST'])
@login_required
def add_income():
    description = request.form['description']
    amount = float(request.form['amount'])
    
    # Automatically set the date to current timestamp
    new_income = Income(
        description=description, 
        amount=amount, 
        date=datetime.utcnow(),
        user_id=current_user.id
    )
    
    db.session.add(new_income)
    db.session.commit()
    
    flash('Income added successfully!')
    return redirect(url_for('dashboard.index'))

@bp.route('/update_income/<int:id>', methods=['GET', 'POST'])
@login_required
def update_income(id):
    income = Income.query.get_or_404(id)
    if income.user_id != current_user.id:
        flash('You do not have permission to edit this income.', 'error')
        return redirect(url_for('dashboard.index'))

    if request.method == 'POST':
        income.description = request.form['description']
        income.amount = request.form['amount']
        db.session.commit()
        flash('Income updated successfully!', 'success')
        return redirect(url_for('dashboard.index'))

    return render_template('income/update.html', income=income)

@bp.route('/delete_income/<int:id>', methods=['POST'])
@login_required
def delete_income(id):
    income = Income.query.get_or_404(id)
    if income.user_id != current_user.id:
        flash('You do not have permission to delete this income.', 'error')
        return redirect(url_for('dashboard.index'))

    db.session.delete(income)
    db.session.commit()
    flash('Income deleted successfully!', 'success')
    return redirect(url_for('dashboard.index'))
