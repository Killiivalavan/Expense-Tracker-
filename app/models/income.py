from app import db
from datetime import datetime

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    user = db.relationship('User', backref=db.backref('incomes', lazy=True))

    def __repr__(self):
        return f"<Income {self.id}: {self.description} - ${self.amount}>"

